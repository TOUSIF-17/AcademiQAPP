import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import summarizationService from '@/services/summarizationService';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';
import { db } from '@/lib/db';

// Force Node.js runtime – required for pdf-parse/mammoth/Buffer
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
async function extractTextFromFile(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  if (file.type === 'application/pdf') {
    const data = await pdf(buffer);
    return data.text;
  } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
    const result = await mammoth.extractRawText({
      buffer
    });
    return result.value;
  } else {
    throw new Error('Unsupported file type');
  }
}
export async function POST(request) {
  try {
    const decoded = verifyToken(request); // optional: allow unauthenticated summarization

    const formData = await request.formData();
    const file = formData.get('file');
    const text = formData.get('text');
    const publicationId = formData.get('publicationId');
    if (!file && !text) {
      return NextResponse.json({
        error: 'Either file or text is required'
      }, {
        status: 400
      });
    }
    let content = text;
    if (file) {
      try {
        content = await extractTextFromFile(file);
      } catch (error) {
        return NextResponse.json({
          error: 'Failed to extract text from file'
        }, {
          status: 400
        });
      }
    }
    if (!content || content.trim().length < 20) {
      return NextResponse.json({
        error: 'Text content is too short for summarization'
      }, {
        status: 400
      });
    }

    // Generate summary
    const summary = await summarizationService.generateSummary(content);

    // If publicationId is provided, update the publication with summary
    if (publicationId && decoded) {
      try {
        await db.publication.update({
          where: {
            id: publicationId
          },
          data: {
            summary: summary
          }
        });
      } catch (error) {
        console.error('Failed to update publication with summary:', error);
      }
    }
    return NextResponse.json({
      message: 'Summary generated successfully',
      summary,
      originalText: content.substring(0, 500) + (content.length > 500 ? '...' : '')
    }, {
      status: 200
    });
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
