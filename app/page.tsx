"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [link, setLink] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onDrop = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Basic validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            File Upload
          </h1>
          <p className="text-gray-600">
            Upload a file to get a one-time download link
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
                Supports: Images, PDFs, and text files (max 10MB)
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
            <p className="text-green-800 font-medium mb-2">Your one-time link:</p>
            <a 
              href={link} 
              className="text-blue-600 hover:text-blue-800 underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link}
            </a>
            <p className="text-sm text-green-700 mt-2">
              This link will expire after one download
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
