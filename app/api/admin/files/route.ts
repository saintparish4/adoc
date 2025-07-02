import { NextRequest, NextResponse } from 'next/server';
import { getFileStats } from '../../../../lib/audit';

export async function GET(request: NextRequest) {
  try {
    const fileStats = await getFileStats();
    return NextResponse.json(fileStats);
  } catch (error) {
    console.error('Admin files error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 