"use client";
import { useState } from "react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  icon: string;
}

const templates: Template[] = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    description: 'Standard NDA template for protecting confidential information',
    category: 'Confidentiality',
    content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into as of [DATE] by and between:

[COMPANY NAME], a [STATE] corporation with its principal place of business at [ADDRESS] ("Disclosing Party")

and

[RECIPIENT NAME], an individual residing at [ADDRESS] ("Receiving Party")

1. CONFIDENTIAL INFORMATION
The Receiving Party acknowledges that it may receive confidential and proprietary information from the Disclosing Party.

2. NON-DISCLOSURE
The Receiving Party agrees to maintain the confidentiality of the Confidential Information and not to disclose it to any third party.

3. USE RESTRICTIONS
The Receiving Party shall use the Confidential Information solely for the purpose of [PURPOSE] and for no other purpose.

4. TERM
This Agreement shall remain in effect for a period of [DURATION] from the date of this Agreement.

5. RETURN OF MATERIALS
Upon termination of this Agreement, the Receiving Party shall return all Confidential Information to the Disclosing Party.

[COMPANY NAME]
By: ________________________
Title: _____________________

[RECIPIENT NAME]
By: ________________________
Date: _____________________`,
    icon: '🔒',
  },
  {
    id: 'employment',
    name: 'Employment Agreement',
    description: 'Standard employment contract template',
    category: 'Employment',
    content: `EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is entered into as of [DATE] by and between:

[COMPANY NAME], a [STATE] corporation with its principal place of business at [ADDRESS] ("Employer")

and

[EMPLOYEE NAME], an individual residing at [ADDRESS] ("Employee")

1. POSITION AND DUTIES
Employee shall serve as [POSITION] and shall perform such duties as may be assigned by Employer.

2. COMPENSATION
Employee shall receive an annual salary of [SALARY] payable in accordance with Employer's standard payroll practices.

3. TERM OF EMPLOYMENT
This Agreement shall commence on [START DATE] and shall continue until terminated by either party.

4. BENEFITS
Employee shall be eligible to participate in Employer's benefit plans in accordance with the terms of such plans.

5. TERMINATION
Either party may terminate this Agreement with [NOTICE PERIOD] written notice to the other party.

[COMPANY NAME]
By: ________________________
Title: _____________________

[EMPLOYEE NAME]
By: ________________________
Date: _____________________`,
    icon: '👔',
  },
  {
    id: 'confidentiality',
    name: 'Confidentiality Agreement',
    description: 'Comprehensive confidentiality agreement for employees',
    category: 'Confidentiality',
    content: `CONFIDENTIALITY AGREEMENT

This Confidentiality Agreement (the "Agreement") is entered into as of [DATE] by and between:

[COMPANY NAME], a [STATE] corporation with its principal place of business at [ADDRESS] ("Company")

and

[EMPLOYEE NAME], an individual residing at [ADDRESS] ("Employee")

1. CONFIDENTIAL INFORMATION
Employee acknowledges that during employment, Employee will have access to confidential information including but not limited to trade secrets, customer lists, and proprietary technology.

2. NON-DISCLOSURE
Employee agrees to maintain the confidentiality of all Confidential Information and not to disclose it to any third party.

3. NON-USE
Employee agrees not to use any Confidential Information for any purpose other than in connection with Employee's employment.

4. RETURN OF MATERIALS
Upon termination of employment, Employee shall return all Confidential Information to Company.

5. SURVIVAL
This Agreement shall survive the termination of Employee's employment.

[COMPANY NAME]
By: ________________________
Title: _____________________

[EMPLOYEE NAME]
By: ________________________
Date: _____________________`,
    icon: '🤐',
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleDownloadTemplate = (template: Template) => {
    const blob = new Blob([template.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAnalyzeTemplate = (template: Template) => {
    // Navigate to analyze page with template content
    const analyzeUrl = `/analyze?template=${template.id}`;
    window.location.href = analyzeUrl;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">HR Templates</h1>
          <p className="text-xl text-gray-600">
            Access and manage standard contract templates for your organization
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200"
            >
                          <div className="p-8">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">{template.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {template.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 text-lg">{template.description}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownloadTemplate(template)}
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Download
                  </button>
                  <button
                  onClick={() => handleAnalyzeTemplate(template)}
                  className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Analyze
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-medium text-gray-900 mb-1">Create Custom Template</h3>
            <p className="text-sm text-gray-600">Build a new template from scratch</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-medium text-gray-900 mb-1">Template Analytics</h3>
            <p className="text-sm text-gray-600">View usage statistics</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-medium text-gray-900 mb-1">Template Settings</h3>
            <p className="text-sm text-gray-600">Configure template defaults</p>
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTemplate.name} - Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {selectedTemplate.content}
                </pre>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => handleDownloadTemplate(selectedTemplate)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download Template
                </button>
                <button
                  onClick={() => handleAnalyzeTemplate(selectedTemplate)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Analyze Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 