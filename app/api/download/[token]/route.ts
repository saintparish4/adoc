import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { createAuditLog } from '../../../../lib/audit';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const file = await prisma.file.findUnique({
      where: { token },
    });

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Check if file is expired
    if (new Date(file.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'File has expired' },
        { status: 410 }
      );
    }

    // Check if file has already been downloaded
    if (file.isUsed) {
      return NextResponse.json(
        { error: 'File has already been downloaded' },
        { status: 410 }
      );
    }

    // Read the file
    const filePath = join(process.cwd(), 'public', 'uploads', file.path);
    let fileBuffer: Buffer;
    
    try {
      fileBuffer = await readFile(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: 'File not found on disk' },
        { status: 404 }
      );
    }

    // Mark file as used
    await prisma.file.update({
      where: { id: file.id },
      data: { isUsed: true },
    });

    // Log the download
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await createAuditLog({
      fileId: file.id,
      ipAddress,
      userAgent,
      action: 'download',
    });

    // Determine content type based on file extension
    const fileExtension = file.path.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (fileExtension === 'pdf') {
      contentType = 'application/pdf';
    } else if (['jpg', 'jpeg'].includes(fileExtension || '')) {
      contentType = 'image/jpeg';
    } else if (fileExtension === 'png') {
      contentType = 'image/png';
    } else if (fileExtension === 'gif') {
      contentType = 'image/gif';
    } else if (fileExtension === 'webp') {
      contentType = 'image/webp';
    } else if (fileExtension === 'txt') {
      contentType = 'text/plain';
    } else if (fileExtension === 'md') {
      contentType = 'text/markdown';
    } else if (fileExtension === 'json') {
      contentType = 'application/json';
    } else if (fileExtension === 'csv') {
      contentType = 'text/csv';
    }

    // Return the file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${file.path.split('/').pop()}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 