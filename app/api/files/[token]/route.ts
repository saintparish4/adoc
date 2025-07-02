import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const file = await prisma.file.findUnique({
      where: { token },
      select: {
        id: true,
        path: true,
        expiresAt: true,
        isUsed: true,
        createdAt: true,
      },
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

    return NextResponse.json(file);

  } catch (error) {
    console.error('File info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 