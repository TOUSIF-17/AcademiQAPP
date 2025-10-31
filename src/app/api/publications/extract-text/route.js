import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mammoth from 'mammoth';
import * as pdf from 'pdf-parse';
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
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({
        error: 'Unauthorized'
      }, {
        status: 401
      });
    }
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({
        error: 'File is required'
      }, {
        status: 400
      });
    }
    try {
      const text = await extractTextFromFile(file);
      return NextResponse.json({
        message: 'Text extracted successfully',
        text: text.substring(0, 2000) // Limit to first 2000 characters
      }, {
        status: 200
      });
    } catch (error) {
      return NextResponse.json({
        error: 'Failed to extract text from file'
      }, {
        status: 400
      });
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
