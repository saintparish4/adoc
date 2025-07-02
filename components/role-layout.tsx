"use client";
import { useState, useEffect } from "react";
import { getRolePermissions, getRoleDisplayName, getRoleColor, type User } from "../lib/auth";

interface RoleLayoutProps {
  children: React.ReactNode;
  user?: User;
}

export default function RoleLayout({ children, user }: RoleLayoutProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(user || null);
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    if (!user) {
      // For demo purposes, create a default user
      // In a real app, this would come from authentication
      const demoUser: User = {
        id: 'demo-user',
        email: 'demo@example.com',
        role: 'user',
        createdAt: new Date(),
      };
      setCurrentUser(demoUser);
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to continue</p>
        </div>
      </div>
    );
  }

  const permissions = getRolePermissions(currentUser.role);
  const roleDisplayName = getRoleDisplayName(currentUser.role);
  const roleColor = getRoleColor(currentUser.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-gray-900">ADOC</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleColor}`}>
                {roleDisplayName}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600">{currentUser.email}</span>
              <button
                onClick={() => {
                  // Demo role switcher
                  const roles: User['role'][] = ['user', 'hr', 'legal', 'dev', 'admin'];
                  const currentIndex = roles.indexOf(currentUser.role);
                  const nextRole = roles[(currentIndex + 1) % roles.length];
                  setCurrentUser({ ...currentUser, role: nextRole });
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Switch Role (Demo)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <a
              href="/"
              className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Upload Files
            </a>
            
            {permissions.canAnalyzeContracts && (
              <a
                href="/analyze"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Analyze Contracts
              </a>
            )}

            {permissions.canViewDashboard && (
              <a
                href="/dashboard"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </a>
            )}

            {currentUser.role === 'hr' && (
              <a
                href="/templates"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Templates
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Role-specific Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Logged in as {roleDisplayName} • {currentUser.email}</p>
            {currentUser.role === 'hr' && (
              <p className="mt-1">Access to HR templates and simplified contract analysis</p>
            )}
            {currentUser.role === 'legal' && (
              <p className="mt-1">Full access to legal dashboard and audit logs</p>
            )}
            {currentUser.role === 'dev' && (
              <p className="mt-1">Simplified file sharing and download access</p>
            )}
            {currentUser.role === 'admin' && (
              <p className="mt-1">Full administrative access to all features</p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
} 