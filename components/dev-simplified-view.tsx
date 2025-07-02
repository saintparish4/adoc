"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function DevSimplifiedView() {
  const [link, setLink] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

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
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quick File Share
        </h1>
        <p className="text-gray-600">
          Simple file sharing for development teams
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        role="button"
        tabIndex={0}
        aria-label="File upload area"
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <p className="text-gray-600">
              {isDragActive 
                ? "Drop the file here..." 
                : "Drag and drop a file here, or click to select"
              }
            </p>
            <p className="text-sm text-gray-500">
              Supports: Images, PDFs, text files, ZIP (max 10MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {link && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium mb-2">Share this link:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={link}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded text-sm bg-white"
            />
            <button
              onClick={() => navigator.clipboard.writeText(link)}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Copy
            </button>
          </div>
          <p className="text-sm text-green-700 mt-2">
            Link expires after one download
          </p>
        </div>
      )}

      {/* Quick Tips for Developers */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Developer Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Perfect for sharing build artifacts and logs</li>
          <li>• Use for temporary file sharing during development</li>
          <li>• Links automatically expire for security</li>
          <li>• No account required - just upload and share</li>
        </ul>
      </div>
    </div>
  );
} 