# adoc Backend API

A secure file upload and download API built with Express.js, featuring client-side encryption, secure file storage, and one-time download links.

## 🚀 Features

- **Secure File Upload**: Client-side AES-256-CBC encryption
- **One-Time Download Links**: Files are automatically deleted after download
- **File Expiration**: Configurable expiration dates (default: 30 days)
- **Rate Limiting**: Built-in protection against abuse
- **CORS Support**: Configurable cross-origin requests
- **Health Monitoring**: Built-in health check endpoint
- **Comprehensive Error Handling**: Detailed error responses and logging
- **Security Headers**: Helmet.js for enhanced security

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Supabase account for file storage
- Environment variables configured

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/adoc"
   
   # Supabase
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_KEY="your-supabase-anon-key"
   
   # Security
   AES_SECRET="64-character-hex-string-32-bytes"
   
   # Server
   PORT=4000
   NODE_ENV=development
   
   # CORS
   ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
   
   # Rate Limiting
   RATE_LIMIT_MAX=100
   
   # File Configuration
   FILE_EXPIRATION_DAYS=30
   ```

4. **Generate AES Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Set up database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:4000
```

### Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0"
}
```

#### Upload File
```http
POST /api/upload
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: File to upload (max 100MB)

**Response:**
```json
{
  "success": true,
  "link": "http://localhost:4000/api/download/token",
  "token": "uuid-token",
  "expiresAt": "2025-02-01T00:00:00.000Z",
  "fileInfo": {
    "originalName": "document.pdf",
    "size": 1024,
    "type": "application/pdf"
  }
}
```

#### Download File
```http
GET /api/download/:token
```

**Response:**
- File download with appropriate headers
- File is automatically deleted after download

### Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2025-01-01T00:00:00.000Z",
  "path": "/api/upload"
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `SUPABASE_URL` | Supabase project URL | - | Yes |
| `SUPABASE_KEY` | Supabase anonymous key | - | Yes |
| `AES_SECRET` | 64-character hex encryption key | - | Yes |
| `PORT` | Server port | 4000 | No |
| `NODE_ENV` | Environment | development | No |
| `ALLOWED_ORIGINS` | CORS allowed origins | localhost:3000 | No |
| `RATE_LIMIT_MAX` | Rate limit requests per window | 100 | No |
| `FILE_EXPIRATION_DAYS` | File expiration in days | 30 | No |

### File Types

Supported file types:
- PDF documents
- Text files
- Microsoft Word documents
- Images (JPEG, PNG, GIF)
- ZIP archives

## 🔒 Security Features

- **Client-side Encryption**: Files are encrypted before upload
- **One-time Download**: Files are deleted after first download
- **Rate Limiting**: Protection against abuse
- **CORS Protection**: Configurable cross-origin requests
- **Security Headers**: Helmet.js for enhanced security
- **Input Validation**: Comprehensive request validation
- **Error Sanitization**: No sensitive data in error responses

## 📁 Project Structure

```
backend/
├── src/
│   ├── config.js              # Configuration management
│   ├── index.js               # Main application entry
│   ├── upload.js              # Upload route handlers
│   ├── download.js            # Download route handlers
│   └── middleware/
│       ├── error-handler.js   # Error handling middleware
│       └── validation.js      # Request validation
├── prisma/
│   └── schema.prisma          # Database schema
├── package.json
└── README.md
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run build` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

### Database Schema

The application uses Prisma with the following schema:

```prisma
model File {
  id          String   @id @default(cuid())
  token       String   @unique
  path        String
  isUsed      Boolean  @default(false)
  expiresAt   DateTime
  originalName String?
  fileSize    Int?
  mimeType    String?
  uploadedAt  DateTime @default(now())
}
```

## 🚀 Deployment

### Docker (Recommended)

1. **Build the image**
   ```bash
   docker build -t adoc-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 4000:4000 --env-file .env adoc-backend
   ```

### Manual Deployment

1. **Set production environment**
   ```bash
   export NODE_ENV=production
   ```

2. **Install dependencies**
   ```bash
   npm ci --only=production
   ```

3. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## 📊 Monitoring

### Health Check
Monitor application health via `/health` endpoint.

### Logging
Application logs include:
- Request/response logging
- Error details with stack traces
- Performance metrics
- Security events

### Metrics
Consider integrating with monitoring services like:
- Prometheus + Grafana
- DataDog
- New Relic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API examples 