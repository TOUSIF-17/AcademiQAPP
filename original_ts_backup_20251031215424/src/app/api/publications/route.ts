import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const department = searchParams.get('department');
    
    const skip = (page - 1) * limit;
    
    // Build query
    let where: any = {};
    
    if (department && department !== 'all') {
      where.author = {
        department: department
      };
    }
    
    const publications = await db.publication.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            userType: true,
            profileImage: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
    
    const total = await db.publication.count({ where });
    
    return NextResponse.json({
      publications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Get publications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const journal = formData.get('journal') as string;
    const publicationDate = formData.get('publicationDate') as string;
    const keywords = formData.get('keywords') as string;
    const doi = formData.get('doi') as string;
    const volume = formData.get('volume') as string;
    const issue = formData.get('issue') as string;
    const pages = formData.get('pages') as string;
    const authors = formData.get('authors') as string;
    const file = formData.get('file') as File;
    const summary = formData.get('summary') as string;
    
    if (!title || !abstract || !journal || !publicationDate) {
      return NextResponse.json(
        { error: 'Title, abstract, journal, and publication date are required' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Handle file upload
    let fileName = '';
    let filePath = '';
    let fileType = '';
    
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create unique filename
      const timestamp = Date.now();
      fileName = `${timestamp}-${file.name}`;
      filePath = `/uploads/${fileName}`;
      fileType = file.type.includes('pdf') ? 'pdf' : 'docx';
      
      // Save file (in production, use cloud storage)
      const fs = await import('fs');
      const path = await import('path');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
    }

    // Create publication
    const publication = await db.publication.create({
      data: {
        title,
        authors: authors || user.name,
        abstract,
        keywords,
        journal,
        volume,
        issue,
        pages,
        publicationDate: publicationDate ? new Date(publicationDate) : null,
        doi,
        fileName,
        filePath,
        authorId: decoded.userId,
        // Store summary if provided
        summary: summary || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            userType: true,
            profileImage: true,
          }
        }
      }
    });

    return NextResponse.json(
      { message: 'Publication created successfully', publication },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create publication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}