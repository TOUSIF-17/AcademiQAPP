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
export async function GET(request, {
  params
}) {
  try {
    const {
      id
    } = params;
    if (!id) {
      return NextResponse.json({
        error: 'Publication ID is required'
      }, {
        status: 400
      });
    }

    // Fetch the publication with author details
    const publication = await db.publication.findUnique({
      where: {
        id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            userType: true,
            profileImage: true
          }
        }
      }
    });
    if (!publication) {
      return NextResponse.json({
        error: 'Publication not found'
      }, {
        status: 404
      });
    }
    return NextResponse.json({
      publication
    });
  } catch (error) {
    console.error('Get publication error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
export async function DELETE(request, {
  params
}) {
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
      id
    } = params;
    if (!id) {
      return NextResponse.json({
        error: 'Publication ID is required'
      }, {
        status: 400
      });
    }

    // First check if the publication exists and belongs to the user
    const publication = await db.publication.findUnique({
      where: {
        id,
        authorId: decoded.userId // Ensure user can only delete their own publications
      }
    });
    if (!publication) {
      return NextResponse.json({
        error: 'Publication not found or you do not have permission to delete it'
      }, {
        status: 404
      });
    }

    // Delete the publication
    await db.publication.delete({
      where: {
        id
      }
    });
    return NextResponse.json({
      message: 'Publication deleted successfully'
    }, {
      status: 200
    });
  } catch (error) {
    console.error('Delete publication error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}