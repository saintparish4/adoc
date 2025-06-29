import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { config, validateConfig } from "./config.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import uploadRoutes from "./upload.js";
import downloadRoutes from "./download.js";

// Validate configuration before starting
try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error.message);
  process.exit(1);
}

// Initialize services
const supabase = createClient(config.supabase.url, config.supabase.key);
const prisma = new PrismaClient();

// Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}, shutting down gracefully...`);
  
  try {
    await prisma.$disconnect();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow file downloads
}));

// CORS configuration
app.use(cors({
  origin: config.security.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'adoc API',
    version: '1.0.0',
    description: 'Secure file upload and download API',
    endpoints: {
      upload: 'POST /api/upload',
      download: 'GET /api/download/:token',
      health: 'GET /health'
    },
    documentation: 'https://github.com/your-repo/docs'
  });
});

// Mount routes with service injection
app.use("/api", uploadRoutes(supabase, prisma));
app.use("/api", downloadRoutes(supabase, prisma));

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 adoc Backend is running on port ${config.port}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${config.port}/health`);
  console.log(`📚 API docs: http://localhost:${config.port}/api`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof config.port === 'string' ? 'Pipe ' + config.port : 'Port ' + config.port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});
