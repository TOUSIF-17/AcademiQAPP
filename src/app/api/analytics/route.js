import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
function getDateRange(timeRange) {
  const now = new Date();
  let startDate;
  switch (timeRange) {
    case '3months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      break;
    case '6months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'all':
    default:
      startDate = new Date(2000, 0, 1); // Very old date for "all time"
      break;
  }
  return {
    startDate,
    endDate: now
  };
}
export async function GET(request) {
  try {
    const {
      searchParams
    } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'all';
    const {
      startDate,
      endDate
    } = getDateRange(timeRange);

    // Get all publications with filters
    const publications = await db.publication.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            department: true,
            designation: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get all faculty for department stats
    const faculty = await db.user.findMany({
      where: {
        role: {
          in: ['faculty', 'admin']
        }
      },
      include: {
        publications: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      }
    });

    // 1. Publication trends by year
    const publicationTrends = publications.reduce((acc, pub) => {
      const year = new Date(pub.createdAt).getFullYear();
      const existing = acc.find(item => item.year === year);
      if (existing) {
        existing.count += 1;
        existing.citations += pub.citations;
      } else {
        acc.push({
          year,
          count: 1,
          citations: pub.citations
        });
      }
      return acc;
    }, []).sort((a, b) => a.year - b.year);

    // 2. Department statistics
    const departmentStats = faculty.reduce((acc, member) => {
      if (!member.department) return acc;
      const deptPublications = member.publications.length;
      const deptCitations = member.publications.reduce((sum, pub) => sum + pub.citations, 0);
      const existing = acc.find(item => item.department === member.department);
      if (existing) {
        existing.publications += deptPublications;
        existing.citations += deptCitations;
      } else {
        acc.push({
          department: member.department,
          publications: deptPublications,
          citations: deptCitations
        });
      }
      return acc;
    }, []).sort((a, b) => b.publications - a.publications);

    // 3. Top authors
    const topAuthors = faculty.map(member => ({
      name: member.name,
      publications: member.publications.length,
      citations: member.publications.reduce((sum, pub) => sum + pub.citations, 0)
    })).filter(author => author.publications > 0).sort((a, b) => b.citations - a.citations);

    // 4. Monthly trends (last 12 months)
    const monthlyTrends = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const monthPublications = publications.filter(pub => {
        const pubDate = new Date(pub.createdAt);
        return pubDate >= monthStart && pubDate <= monthEnd;
      });
      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        }),
        publications: monthPublications.length,
        citations: monthPublications.reduce((sum, pub) => sum + pub.citations, 0)
      });
    }

    // 5. Research areas (based on specializations)
    const researchAreas = faculty.filter(member => member.specialization).reduce((acc, member) => {
      const areas = member.specialization.split(',').map(s => s.trim());
      areas.forEach(area => {
        if (area) {
          const existing = acc.find(item => item.area === area);
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({
              area,
              count: 1
            });
          }
        }
      });
      return acc;
    }, []).sort((a, b) => b.count - a.count).slice(0, 6); // Top 6 areas

    const analyticsData = {
      publicationTrends,
      departmentStats,
      topAuthors,
      monthlyTrends,
      researchAreas
    };
    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
