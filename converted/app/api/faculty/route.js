import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET(request) {
  try {
    const faculty = await db.user.findMany({
      where: {
        role: {
          in: ['faculty', 'admin']
        }
      },
      include: {
        publications: {
          select: {
            id: true,
            title: true,
            year: true,
            citations: true
          },
          orderBy: {
            year: 'desc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Calculate total citations for each faculty member
    const facultyWithStats = faculty.map(member => ({
      ...member,
      citations: member.publications.reduce((sum, pub) => sum + pub.citations, 0)
    }));
    return NextResponse.json(facultyWithStats);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
