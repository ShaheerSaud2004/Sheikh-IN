import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/analytics - Get analytics data for a user
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let dateFilter: any = {}
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else {
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - parseInt(period))
      dateFilter = {
        gte: daysAgo
      }
    }

    // Get booking analytics
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { sheikhId: user.id },
          { clientId: user.id }
        ],
        createdAt: dateFilter
      },
      include: {
        sheikh: { include: { profile: true } },
        client: { include: { profile: true } }
      }
    })

    // Get profile views (simulated - you'd track this separately)
    const profileViews = await prisma.analytics.findMany({
      where: {
        userId: user.id,
        date: dateFilter
      },
      select: {
        date: true,
        profileViews: true
      }
    })

    // Get content analytics
    const content = await prisma.content.findMany({
      where: {
        authorId: user.id,
        createdAt: dateFilter
      },
      select: {
        id: true,
        title: true,
        views: true,
        likes: true,
        category: true,
        createdAt: true
      }
    })

    // Get proposals analytics
    const proposals = await prisma.proposal.findMany({
      where: {
        OR: [
          { fromUserId: user.id },
          { toUserId: user.id }
        ],
        createdAt: dateFilter
      },
      include: {
        fromUser: { include: { profile: true } },
        toUser: { include: { profile: true } }
      }
    })

    // Get messages analytics
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: user.id },
          { toUserId: user.id }
        ],
        createdAt: dateFilter
      }
    })

    // Calculate summary statistics
    const totalBookings = bookings.length
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length
    const totalRevenue = bookings
      .filter(b => b.status === 'COMPLETED' && b.price)
      .reduce((sum, b) => sum + (b.price || 0), 0)
    
    const totalProfileViews = profileViews.reduce((sum, p) => sum + p.profileViews, 0)
    const totalContentViews = content.reduce((sum, c) => sum + c.views, 0)
    const totalContentLikes = content.reduce((sum, c) => sum + c.likes, 0)
    
    const sentProposals = proposals.filter(p => p.fromUserId === user.id).length
    const receivedProposals = proposals.filter(p => p.toUserId === user.id).length
    const acceptedProposals = proposals.filter(p => p.status === 'accepted').length
    
    const sentMessages = messages.filter(m => m.fromUserId === user.id).length
    const receivedMessages = messages.filter(m => m.toUserId === user.id).length

    // Calculate monthly trends
    const monthlyData = Array.from({ length: parseInt(period) }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (parseInt(period) - 1 - i))
      const dateStr = date.toISOString().split('T')[0]
      
      return {
        date: dateStr,
        bookings: bookings.filter(b => 
          b.createdAt.toISOString().split('T')[0] === dateStr
        ).length,
        revenue: bookings
          .filter(b => 
            b.createdAt.toISOString().split('T')[0] === dateStr && 
            b.status === 'COMPLETED' && 
            b.price
          )
          .reduce((sum, b) => sum + (b.price || 0), 0),
        profileViews: profileViews
          .filter(p => p.date.toISOString().split('T')[0] === dateStr)
          .reduce((sum, p) => sum + p.profileViews, 0)
      }
    })

    // Top performing content
    const topContent = content
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)

    // Service type breakdown
    const serviceBreakdown = bookings.reduce((acc, booking) => {
      acc[booking.serviceType] = (acc[booking.serviceType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Content category breakdown
    const contentBreakdown = content.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      summary: {
        totalBookings,
        completedBookings,
        totalRevenue,
        totalProfileViews,
        totalContentViews,
        totalContentLikes,
        sentProposals,
        receivedProposals,
        acceptedProposals,
        sentMessages,
        receivedMessages
      },
      trends: {
        monthlyData,
        topContent,
        serviceBreakdown,
        contentBreakdown
      },
      bookings: bookings.slice(0, 10), // Recent bookings
      content: content.slice(0, 10) // Recent content
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/analytics - Record analytics event
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      eventType, 
      targetUserId, 
      contentId, 
      metadata 
    } = body

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get or create today's analytics record
    let analytics = await prisma.analytics.findFirst({
      where: {
        userId: targetUserId || user.id,
        date: today
      }
    })

    if (!analytics) {
      analytics = await prisma.analytics.create({
        data: {
          userId: targetUserId || user.id,
          date: today
        }
      })
    }

    // Update analytics based on event type
    const updateData: any = {}
    
    switch (eventType) {
      case 'PROFILE_VIEW':
        updateData.profileViews = { increment: 1 }
        break
      case 'CONTENT_VIEW':
        updateData.contentViews = { increment: 1 }
        // Also update the content view count
        if (contentId) {
          await prisma.content.update({
            where: { id: contentId },
            data: { views: { increment: 1 } }
          })
        }
        break
      case 'BOOKING_CREATED':
        updateData.bookings = { increment: 1 }
        break
      case 'MESSAGE_SENT':
        updateData.messagesSent = { increment: 1 }
        break
      case 'PROPOSAL_SENT':
        updateData.proposalsSent = { increment: 1 }
        break
      case 'PROPOSAL_RECEIVED':
        updateData.proposalsReceived = { increment: 1 }
        break
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.analytics.update({
        where: { id: analytics.id },
        data: updateData
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics recording error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


