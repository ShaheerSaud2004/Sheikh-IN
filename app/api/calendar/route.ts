import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/calendar - Get calendar events for a user
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
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')
    const userId = searchParams.get('userId') || user.id

    const whereClause: any = {
      userId
    }

    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const events = await prisma.calendarEvent.findMany({
      where: whereClause,
      include: {
        user: {
          include: { profile: true }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Calendar fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/calendar - Create a new calendar event
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
      title, 
      description, 
      startTime, 
      endTime, 
      eventType, 
      serviceType, 
      location,
      isRecurring,
      recurrence,
      meetingUrl 
    } = body

    // Validate required fields
    if (!title || !startTime || !endTime || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const event = await prisma.calendarEvent.create({
      data: {
        userId: user.id,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        eventType,
        serviceType,
        location,
        isRecurring: isRecurring || false,
        recurrence: recurrence ? JSON.stringify(recurrence) : null,
        meetingUrl
      },
      include: {
        user: {
          include: { profile: true }
        }
      }
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Calendar creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/calendar - Update a calendar event
export async function PUT(request: NextRequest) {
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
    const { eventId, ...updateData } = body

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    // Check if user owns the event
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: {
        id: eventId,
        userId: user.id
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 })
    }

    // Convert dates if provided
    if (updateData.startTime) {
      updateData.startTime = new Date(updateData.startTime)
    }
    if (updateData.endTime) {
      updateData.endTime = new Date(updateData.endTime)
    }

    // Convert recurrence to JSON string if provided
    if (updateData.recurrence) {
      updateData.recurrence = JSON.stringify(updateData.recurrence)
    }

    const event = await prisma.calendarEvent.update({
      where: { id: eventId },
      data: updateData,
      include: {
        user: {
          include: { profile: true }
        }
      }
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Calendar update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/calendar - Delete a calendar event
export async function DELETE(request: NextRequest) {
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
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    // Check if user owns the event
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: {
        id: eventId,
        userId: user.id
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 })
    }

    await prisma.calendarEvent.delete({
      where: { id: eventId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Calendar deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

