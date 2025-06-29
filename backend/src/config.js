/**
 * Application configuration
 * Centralized configuration management with validation
 */

const config = {
  // Server configuration
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
  },
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  
  // Security configuration
  security: {
    aesSecret: process.env.AES_SECRET,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    },
  },
  
  // File upload configuration
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedMimes: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/zip',
      'application/x-zip-compressed'
    ],
    expirationDays: parseInt(process.env.FILE_EXPIRATION_DAYS) || 30,
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'dev',
  },
};

/**
 * Validate required configuration
 */
function validateConfig() {
  const required = [
    'supabase.url',
    'supabase.key',
    'security.aesSecret',
  ];
  
  const missing = [];
  
  for (const path of required) {
    const value = path.split('.').reduce((obj, key) => obj?.[key], config);
    if (!value) {
      missing.push(path);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
  
  // Validate AES secret format
  if (config.security.aesSecret.length !== 64) {
    throw new Error('AES_SECRET must be exactly 64 characters (32 bytes in hex)');
  }
  
  return true;
}

export { config, validateConfig }; 