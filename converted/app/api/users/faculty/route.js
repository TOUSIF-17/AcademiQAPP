import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
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
export async function GET(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({
        error: 'Unauthorized'
      }, {
        status: 401
      });
    }

    // Fetch all users except the current user (to show faculty directory)
    const faculty = await db.user.findMany({
      where: {
        id: {
          not: decoded.userId
        },
        userType: 'Faculty' // Only show faculty members
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        userType: true,
        profileImage: true,
        bio: true,
        citations: true,
        hIndex: true,
        teachingWeight: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json({
      faculty,
      count: faculty.length
    });
  } catch (error) {
    console.error('Get faculty error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
