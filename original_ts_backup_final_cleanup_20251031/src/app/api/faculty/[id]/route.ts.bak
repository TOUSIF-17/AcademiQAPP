import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const faculty = await db.user.findUnique({
      where: { 
        id: params.id,
        role: {
          in: ['faculty', 'admin']
        }
      },
      include: {
        publications: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!faculty) {
      return NextResponse.json(
        { error: 'Faculty not found' },
        { status: 404 }
      )
    }

    // Calculate total citations
    const totalCitations = faculty.publications.reduce((sum, pub) => sum + pub.citations, 0)

    const facultyWithStats = {
      ...faculty,
      citations: totalCitations
    }

    return NextResponse.json(facultyWithStats)
  } catch (error) {
    console.error('Error fetching faculty:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}