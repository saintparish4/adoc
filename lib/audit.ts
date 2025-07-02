import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuditLogData {
  fileId: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  action: 'view' | 'download' | 'upload' | 'analyze';
  userAgent?: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        fileId: data.fileId,
        userId: data.userId,
        userEmail: data.userEmail,
        ipAddress: data.ipAddress,
        action: data.action,
        userAgent: data.userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to avoid breaking the main functionality
  }
}

export async function getAuditLogsByFile(fileId: string) {
  try {
    return await prisma.auditLog.findMany({
      where: { fileId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
        file: {
          select: {
            path: true,
            token: true,
            expiresAt: true,
            isUsed: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    return [];
  }
}

export async function getAllAuditLogs(limit = 100) {
  try {
    return await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
        file: {
          select: {
            path: true,
            token: true,
            expiresAt: true,
            isUsed: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  } catch (error) {
    console.error('Failed to get all audit logs:', error);
    return [];
  }
}

export async function getFileStats() {
  try {
    const files = await prisma.file.findMany({
      include: {
        _count: {
          select: {
            auditLogs: true,
          },
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return files.map(file => ({
      id: file.id,
      path: file.path,
      token: file.token,
      expiresAt: file.expiresAt,
      isUsed: file.isUsed,
      createdAt: file.createdAt,
      viewCount: file._count.auditLogs,
      lastAccessed: file.auditLogs[0]?.createdAt || null,
    }));
  } catch (error) {
    console.error('Failed to get file stats:', error);
    return [];
  }
} 