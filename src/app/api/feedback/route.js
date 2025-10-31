import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Simple sentiment analysis function
function analyzeSentiment(text) {
  const positiveWords = ['excellent', 'great', 'good', 'amazing', 'wonderful', 'fantastic', 'helpful', 'useful', 'valuable', 'informative', 'clear', 'well-written', 'insightful', 'brilliant', 'outstanding'];
  const negativeWords = ['poor', 'bad', 'terrible', 'awful', 'useless', 'confusing', 'unclear', 'disappointing', 'inadequate', 'weak', 'flawed', 'problematic', 'unsatisfactory'];
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  const score = (positiveCount - negativeCount) / Math.max(words.length, 1);
  let sentiment = 'neutral';
  if (score > 0.05) sentiment = 'positive';else if (score < -0.05) sentiment = 'negative';
  return {
    sentiment,
    score
  };
}
export async function POST(request) {
  try {
    const {
      content,
      facultyId,
      publicationId,
      studentName,
      studentEmail
    } = await request.json();
    if (!content || !facultyId) {
      return NextResponse.json({
        error: 'Content and faculty ID are required'
      }, {
        status: 400
      });
    }

    // Perform sentiment analysis
    const sentimentAnalysis = analyzeSentiment(content);
    const feedback = await db.feedback.create({
      data: {
        content,
        sentiment: sentimentAnalysis.sentiment,
        sentimentScore: sentimentAnalysis.score,
        facultyId,
        publicationId: publicationId || null,
        studentName: studentName || null,
        studentEmail: studentEmail || null
      },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        publication: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    return NextResponse.json({
      message: 'Feedback submitted successfully',
      feedback
    }, {
      status: 201
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
export async function GET(request) {
  try {
    const {
      searchParams
    } = new URL(request.url);
    const facultyId = searchParams.get('facultyId');
    const publicationId = searchParams.get('publicationId');
    const whereClause = {};
    if (facultyId) whereClause.facultyId = facultyId;
    if (publicationId) whereClause.publicationId = publicationId;
    const feedback = await db.feedback.findMany({
      where: whereClause,
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        publication: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
