import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const publications = await db.publication.findMany({
      where: { authorId: params.userId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            designation: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(publications)
  } catch (error) {
    console.error('Error fetching user publications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}