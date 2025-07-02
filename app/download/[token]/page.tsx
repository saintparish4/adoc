"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface FileInfo {
  id: string;
  path: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export default function DownloadPage() {
  const params = useParams();
  const token = params.token as string;
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchFileInfo();
    }
  }, [token]);

  const fetchFileInfo = async () => {
    try {
      const response = await fetch(`/api/files/${token}`);
      if (!response.ok) {
        throw new Error('File not found or expired');
      }
      const data = await response.json();
      setFileInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!fileInfo) return;

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/download/${token}`);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileInfo.path.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refresh file info to show updated status
      await fetchFileInfo();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading file information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to upload page
          </a>
        </div>
      </div>
    );
  }

  if (!fileInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">File not found</p>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to upload page
          </a>
        </div>
      </div>
    );
  }

  const isExpired = new Date(fileInfo.expiresAt) < new Date();
  const fileName = fileInfo.path.split('/').pop() || 'Unknown file';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              File Download
            </h1>
            <p className="text-gray-600">
              {isExpired ? 'This file has expired' : 'Click the button below to download'}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Name
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {fileName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex items-center space-x-2">
                {isExpired ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Expired
                  </span>
                ) : fileInfo.isUsed ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Already Downloaded
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires At
              </label>
              <p className="text-sm text-gray-900">
                {new Date(fileInfo.expiresAt).toLocaleString()}
              </p>
            </div>
          </div>

          {!isExpired && !fileInfo.isUsed && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDownloading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Downloading...
                </div>
              ) : (
                'Download File'
              )}
            </button>
          )}

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Upload another file
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 