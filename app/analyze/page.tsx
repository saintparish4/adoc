"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnalysisResult {
  riskyClauses: Array<{
    clause: string;
    risk: "low" | "medium" | "high";
    description: string;
    suggestion: string;
  }>;
  summary: string;
  riskScore: number;
}

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [analysisMethod, setAnalysisMethod] = useState<"file" | "text">("file");

  const onDrop = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Basic validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size must be less than 10MB");
      return;
    }

    await analyzeContent(file);
  };

  const analyzeContent = async (content: File | string) => {
    setIsAnalyzing(true);
    setError(undefined);
    setAnalysisResult(null);
    
    try {
      const form = new FormData();
      
      if (typeof content === "string") {
        form.append("text", content);
      } else {
        form.append("file", content);
      }
      
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: form,
      });
      
      if (!res.ok) {
        throw new Error(`Analysis failed: ${res.statusText}`);
      }
      
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextAnalysis = () => {
    if (!pastedText.trim()) {
      setError("Please paste some text to analyze");
      return;
    }
    analyzeContent(pastedText);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
    disabled: isAnalyzing || analysisMethod === "text"
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const downloadMarkdown = () => {
    if (!analysisResult) return;
    
    let markdown = `# Contract Analysis Report\n\n`;
    markdown += `## Risk Score: ${analysisResult.riskScore}/100\n\n`;
    markdown += `## Summary\n${analysisResult.summary}\n\n`;
    markdown += `## Risky Clauses\n\n`;
    
    analysisResult.riskyClauses.forEach((clause, index) => {
      markdown += `### ${index + 1}. ${clause.risk.toUpperCase()} Risk\n\n`;
      markdown += `**Clause:**\n\`\`\`\n${clause.clause}\n\`\`\`\n\n`;
      markdown += `**Risk Description:** ${clause.description}\n\n`;
      markdown += `**Suggestion:** ${clause.suggestion}\n\n`;
      markdown += `---\n\n`;
    });
    
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contract-analysis.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Contract Analyzer
          </h1>
          <p className="text-xl text-gray-600">
            Upload a legal document or paste text to analyze for risky clauses
          </p>
        </div>

        {/* Analysis Method Toggle */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setAnalysisMethod("file")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                analysisMethod === "file"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setAnalysisMethod("text")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                analysisMethod === "text"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        {analysisMethod === "file" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                isDragActive 
                  ? 'border-blue-400 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              role="button"
              tabIndex={0}
              aria-label="File upload area"
            >
            <input {...getInputProps()} />
            
            {isAnalyzing ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 text-lg">Analyzing document...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900 mb-2">
                    {isDragActive 
                      ? "Drop the document here..." 
                      : "Choose a file or drag it here"
                    }
                  </p>
                  <p className="text-gray-500">
                    Supports: PDF, DOCX, DOC (max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Text Paste Section */}
        {analysisMethod === "text" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="space-y-6">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your legal text here..."
                className="w-full h-64 p-6 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                disabled={isAnalyzing}
              />
              <div className="flex justify-center">
                <button
                  onClick={handleTextAnalysis}
                  disabled={isAnalyzing || !pastedText.trim()}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Text"}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-800 text-lg">{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-8">
            {/* Risk Score */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Risk Assessment</h2>
                <button
                  onClick={downloadMarkdown}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download Report
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-gray-900">
                  {analysisResult.riskScore}/100
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        analysisResult.riskScore >= 70 ? 'bg-red-500' :
                        analysisResult.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${analysisResult.riskScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="prose max-w-none text-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {analysisResult.summary}
                </ReactMarkdown>
              </div>
            </div>

            {/* Risky Clauses */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risky Clauses</h3>
              <div className="space-y-6">
                {analysisResult.riskyClauses.map((clause, index) => (
                  <div key={index} className="border-l-4 border-gray-200 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Clause {index + 1}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(clause.risk)}`}>
                        {clause.risk.toUpperCase()} RISK
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md mb-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{clause.clause}</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-900">Risk Description:</span>
                        <p className="text-sm text-gray-600 mt-1">{clause.description}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Suggestion:</span>
                        <p className="text-sm text-gray-600 mt-1">{clause.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 