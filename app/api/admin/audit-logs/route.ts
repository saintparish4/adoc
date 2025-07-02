import { NextRequest, NextResponse } from 'next/server';
import { getAllAuditLogs } from '../../../../lib/audit';

export async function GET(request: NextRequest) {
  try {
    const auditLogs = await getAllAuditLogs(100);
    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error('Admin audit logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 