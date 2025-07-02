import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'hr' | 'legal' | 'dev' | 'user';
  createdAt: Date;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function createUser(email: string, role: User['role'] = 'user'): Promise<User | null> {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        role,
      },
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function updateUserRole(userId: string, role: User['role']): Promise<User | null> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return user;
  } catch (error) {
    console.error('Error updating user role:', error);
    return null;
  }
}

export function getRolePermissions(role: User['role']) {
  const permissions = {
    admin: {
      canViewDashboard: true,
      canViewAllFiles: true,
      canViewAuditLogs: true,
      canManageUsers: true,
      canAnalyzeContracts: true,
      canUploadFiles: true,
      canDownloadFiles: true,
      canExportReports: true,
    },
    hr: {
      canViewDashboard: false,
      canViewAllFiles: false,
      canViewAuditLogs: false,
      canManageUsers: false,
      canAnalyzeContracts: true,
      canUploadFiles: true,
      canDownloadFiles: true,
      canExportReports: true,
      templates: ['nda', 'employment', 'confidentiality'],
    },
    legal: {
      canViewDashboard: true,
      canViewAllFiles: true,
      canViewAuditLogs: true,
      canManageUsers: false,
      canAnalyzeContracts: true,
      canUploadFiles: true,
      canDownloadFiles: true,
      canExportReports: true,
    },
    dev: {
      canViewDashboard: false,
      canViewAllFiles: false,
      canViewAuditLogs: false,
      canManageUsers: false,
      canAnalyzeContracts: false,
      canUploadFiles: true,
      canDownloadFiles: true,
      canExportReports: false,
    },
    user: {
      canViewDashboard: false,
      canViewAllFiles: false,
      canViewAuditLogs: false,
      canManageUsers: false,
      canAnalyzeContracts: true,
      canUploadFiles: true,
      canDownloadFiles: true,
      canExportReports: true,
    },
  };

  return permissions[role] || permissions.user;
}

export function getRoleDisplayName(role: User['role']): string {
  const displayNames = {
    admin: 'Administrator',
    hr: 'Human Resources',
    legal: 'Legal Team',
    dev: 'Developer',
    user: 'User',
  };
  return displayNames[role] || 'User';
}

export function getRoleColor(role: User['role']): string {
  const colors = {
    admin: 'bg-purple-100 text-purple-800',
    hr: 'bg-blue-100 text-blue-800',
    legal: 'bg-green-100 text-green-800',
    dev: 'bg-orange-100 text-orange-800',
    user: 'bg-gray-100 text-gray-800',
  };
  return colors[role] || colors.user;
} 