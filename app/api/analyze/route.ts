import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import OpenAI from 'openai';
import { createAuditLog } from '../../../lib/audit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to parse PDF file');
  }
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to parse DOCX file');
  }
}

async function analyzeWithGPT(text: string) {
  const prompt = `Analyze the following legal document and extract risky clauses. Provide a comprehensive analysis in the following JSON format:

{
  "riskyClauses": [
    {
      "clause": "exact text of the risky clause",
      "risk": "low|medium|high",
      "description": "explanation of why this clause is risky",
      "suggestion": "specific redline suggestion to mitigate the risk"
    }
  ],
  "summary": "overall assessment of the document's risk level and key concerns",
  "riskScore": 75
}

Focus on identifying:
- Unfavorable terms and conditions
- Excessive liability clauses
- Unclear or ambiguous language
- Missing important protections
- Unreasonable obligations
- Intellectual property issues
- Confidentiality concerns
- Termination clauses
- Payment terms
- Dispute resolution mechanisms

Document text:
${text.substring(0, 8000)} // Limit to first 8000 characters to stay within token limits

Provide only valid JSON output.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a legal expert specializing in contract analysis and risk assessment. Provide detailed, accurate analysis of legal documents with specific recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    // Try to parse the JSON response
    try {
      const analysis = JSON.parse(response);
      return analysis;
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid AI response format');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze document with AI');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const text = formData.get('text') as string;

    if (!file && !text) {
      return NextResponse.json(
        { error: 'No file or text provided' },
        { status: 400 }
      );
    }

    let documentText = '';

    if (file) {
      // Handle file upload
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json(
          { error: 'File size must be less than 10MB' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      
      if (file.type === 'application/pdf') {
        documentText = await extractTextFromPDF(buffer);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        documentText = await extractTextFromDOCX(buffer);
      } else if (file.type === 'application/msword') {
        // For .doc files, we'll need to convert them first
        // For now, return an error suggesting to convert to DOCX
        return NextResponse.json(
          { error: 'Please convert .doc files to .docx format before uploading' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload PDF or DOCX files.' },
          { status: 400 }
        );
      }
    } else if (text) {
      // Handle pasted text
      documentText = text;
    }

    if (!documentText.trim()) {
      return NextResponse.json(
        { error: 'No readable text found in the document' },
        { status: 400 }
      );
    }

    // Analyze with GPT
    const analysis = await analyzeWithGPT(documentText);

    // Log the analysis
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create a temporary file record for analysis logging
    const tempFileId = `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    await createAuditLog({
      fileId: tempFileId,
      ipAddress,
      userAgent,
      action: 'analyze',
    });

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 