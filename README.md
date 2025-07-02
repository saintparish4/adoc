# ADOC - AI-Powered Document Management

A Next.js application for secure file sharing and AI-powered legal document analysis.

## Features

### File Upload & Sharing
- Secure file upload with one-time download links
- Support for images, PDFs, and text files
- Automatic link expiration after download

### AI Contract Analyzer
- Upload legal documents (PDF, DOCX) or paste text
- AI-powered analysis of risky clauses
- Risk assessment with scoring
- Detailed redline suggestions
- Export analysis as Markdown

### Admin Dashboard & Audit Logs
- Track file uploads, downloads, and views
- Monitor user activity and IP addresses
- View detailed access logs per file
- Real-time statistics and analytics
- Activity timeline and audit trail

### Role-Based Access Control
- **HR Users**: Access to contract templates and simplified analysis
- **Legal Team**: Full dashboard access with audit logs
- **Developers**: Simplified file sharing interface
- **Administrators**: Complete system access and user management
- **Regular Users**: Standard file upload and analysis features

## Getting Started

### Prerequisites
- Node.js 18+ 
- OpenAI API key
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your configuration:
```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL="postgresql://username:password@localhost:5432/adoc?schema=public"
```

4. Set up the database:
```bash
node setup-db.js
npx prisma migrate deploy
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### File Upload
1. Visit the home page
2. Drag and drop a file or click to select
3. Get a one-time download link
4. Share the link with others

### AI Contract Analysis
1. Click "Analyze Contract" on the home page
2. Choose between file upload or text paste
3. Upload a legal document (PDF/DOCX) or paste text
4. Wait for AI analysis
5. Review risk assessment and redline suggestions
6. Download the analysis report

### Admin Dashboard
1. Click "Dashboard" on the home page
2. View file statistics and recent activity
3. Click "View Logs" to see detailed access logs for any file
4. Monitor uploads, downloads, and analysis activity

### Role-Based Features
1. **HR Users**: Access "Templates" page for contract templates
2. **Legal Team**: Full dashboard access with comprehensive analytics
3. **Developers**: Simplified interface focused on file sharing
4. **Administrators**: Complete system oversight and user management
5. **Demo Mode**: Use "Switch Role" button to test different user experiences

## API Endpoints

- `POST /api/upload` - Upload files and get download links
- `POST /api/analyze` - Analyze legal documents with AI
- `GET /api/download/[token]` - Download files (one-time access)
- `GET /api/files/[token]` - Get file information
- `GET /api/admin/files` - Get file statistics (admin)
- `GET /api/admin/audit-logs` - Get audit logs (admin)

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4
- **File Processing**: pdf-parse, mammoth
- **Markdown**: react-markdown, remark-gfm

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
