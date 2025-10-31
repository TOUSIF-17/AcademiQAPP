import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import * as pdf from 'pdf-parse';
import mammoth from 'mammoth';
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({
        error: 'No file uploaded'
      }, {
        status: 400
      });
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Only PDF and Word documents are allowed'
      }, {
        status: 400
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir, {
        recursive: true
      });
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Extract text based on file type
    let extractedText = '';
    let abstract = '';
    if (file.type === 'application/pdf') {
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (file.type.includes('word')) {
      const result = await mammoth.extractRawText({
        buffer
      });
      extractedText = result.value;
    }

    // Try to extract abstract (simple heuristic - look for "Abstract" keyword)
    const abstractMatch = extractedText.match(/abstract\s*:?\s*(.*?)(?=\n\s*(introduction|keywords|1\.|i\.))/i);
    if (abstractMatch) {
      abstract = abstractMatch[1].trim();
    } else {
      // If no clear abstract found, use first 500 characters
      abstract = extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : '');
    }
    return NextResponse.json({
      message: 'File uploaded successfully',
      fileName,
      filePath,
      abstract,
      fullText: extractedText
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({
      error: 'Failed to upload file'
    }, {
      status: 500
    });
  }
}
