"use client";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import DevSimplifiedView from "../components/dev-simplified-view";
import { getRolePermissions, type User } from "../lib/auth";
import { UploadIcon, ShieldIcon, DocumentIcon, ChartIcon } from "../components/icons";
import Link from "next/link";
import { 
  ArrowRightIcon,
  CloudArrowUpIcon,
  CogIcon
} from "@heroicons/react/24/outline";
import { Button, Card, CardHeader, CardBody, Badge, Alert } from "../components/ui";

export default function Home() {
  const [link, setLink] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // For demo purposes, create a default user
    // In a real app, this would come from authentication context
    const demoUser: User = {
      id: 'demo-user',
      email: 'demo@example.com',
      role: 'user',
      createdAt: new Date(),
    };
    setCurrentUser(demoUser);
  }, []);

  const onDrop = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setIsLoading(true);
    setError(undefined);
    
    try {
      const form = new FormData();
      form.append("file", file);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }
      
      const data = await res.json();
      setLink(data.link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md', '.json', '.csv'],
    },
    maxFiles: 1,
    disabled: isLoading
  });

  // Show simplified view for developers
  if (currentUser?.role === 'dev') {
    return <DevSimplifiedView />;
  }

  return (
    <div className="min-h-screen bg-gray-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <Badge variant="primary" className="mb-6">
              AI-Powered Document Management
            </Badge>
            <h1 className="t-display-lg text-white mb-6">
              Secure file sharing with{" "}
              <span className="text-gradient">intelligent analysis</span>
            </h1>
            <p className="t-body-lg text-white/80 max-w-3xl mx-auto mb-8">
              Upload legal documents and get instant risk assessment with detailed 
              redline suggestions. Enterprise-grade security with role-based access control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4">
                Get Started
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="lg" className="text-lg px-8 py-4 text-white border-white/20 hover:bg-white/10">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="t-h2 text-gray-900 mb-4">
              Everything you need for document management
            </h2>
            <p className="t-body-lg text-gray-600 max-w-2xl mx-auto">
              From secure file sharing to AI-powered analysis, we've got you covered 
              with enterprise-grade features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card variant="elevated" className="group hover:scale-105 transition-transform duration-300">
              <CardBody className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
                  <CloudArrowUpIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="t-h5 text-gray-900 mb-4">Secure file sharing</h3>
                <p className="t-body text-gray-600 mb-4">
                  Upload files and get secure, one-time download links with 
                  comprehensive audit trails.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    One-time download links
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    Complete audit trails
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    Role-based permissions
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* Feature 2 */}
            <Card variant="elevated" className="group hover:scale-105 transition-transform duration-300">
              <CardBody className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-purple-200 transition-colors">
                  <DocumentIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="t-h5 text-gray-900 mb-4">AI contract analysis</h3>
                <p className="t-body text-gray-600 mb-4">
                  Upload legal documents and get instant risk assessment with detailed 
                  redline suggestions.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    PDF and DOCX support
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    Risk scoring and analysis
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    Exportable reports
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* Feature 3 */}
            <Card variant="elevated" className="group hover:scale-105 transition-transform duration-300">
              <CardBody className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-green-200 transition-colors">
                  <ShieldIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="t-h5 text-gray-900 mb-4">Enterprise security</h3>
                <p className="t-body text-gray-600 mb-4">
                  Role-based access control, audit logs, and comprehensive security 
                  for enterprise teams.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    Role-based permissions
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    Complete audit trails
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    Admin dashboard
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="t-display-md text-blue-600 mb-2 group-hover:scale-110 transition-transform">∞</div>
              <div className="t-body text-gray-600">Files uploaded</div>
            </div>
            <div className="group">
              <div className="t-display-md text-green-600 mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="t-body text-gray-600">Secure</div>
            </div>
            <div className="group">
              <div className="t-display-md text-purple-600 mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="t-body text-gray-600">Available</div>
            </div>
            <div className="group">
              <div className="t-display-md text-yellow-600 mb-2 group-hover:scale-110 transition-transform">0</div>
              <div className="t-body text-gray-600">Setup time</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="t-h2 text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <p className="t-body-lg text-gray-600 mb-8">
            Join thousands of teams using ADOC for secure document management and AI-powered analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analyze">
              <Button size="lg" className="text-lg px-8 py-4">
                Analyze Document
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Alert */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="info" title="Demo Mode Active">
            You're currently in demo mode. Use the "Switch Role" button in the header to test different user experiences. 
            All data is simulated for demonstration purposes.
          </Alert>
        </div>
      </div>
    </div>
  );
}
