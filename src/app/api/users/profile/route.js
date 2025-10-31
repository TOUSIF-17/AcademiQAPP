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
export async function PUT(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({
        error: 'Unauthorized'
      }, {
        status: 401
      });
    }
    const {
      name,
      bio,
      userType
    } = await request.json();
    const user = await db.user.update({
      where: {
        id: decoded.userId
      },
      data: {
        name,
        bio,
        userType,
        updatedAt: new Date()
      }
    });
    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, {
        status: 404
      });
    }

    // Remove password from response
    const {
      password: _,
      ...userResponse
    } = user;
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userResponse
    }, {
      status: 200
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
