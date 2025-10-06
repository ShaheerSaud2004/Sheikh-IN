import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/bookings - Get bookings for a user
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
    const type = searchParams.get('type') // 'sheikh' or 'client'
    const status = searchParams.get('status')
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')

    let whereClause: any = {}

    if (type === 'sheikh') {
      whereClause.sheikhId = user.id
    } else if (type === 'client') {
      whereClause.clientId = user.id
    } else {
      // Get both types
      whereClause.OR = [
        { sheikhId: user.id },
        { clientId: user.id }
      ]
    }

    if (status) {
      whereClause.status = status
    }

    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        sheikh: {
          include: { profile: true }
        },
        client: {
          include: { profile: true }
        },
        event: true
      },
      orderBy: {
        startTime: 'desc'
      }
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/bookings - Create a new booking
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
      sheikhId, 
      eventId, 
      serviceType, 
      startTime, 
      endTime, 
      location, 
      description, 
      notes,
      price 
    } = body

    // Validate required fields
    if (!sheikhId || !eventId || !serviceType || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if the event is available
    const event = await prisma.calendarEvent.findFirst({
      where: {
        id: eventId,
        userId: sheikhId,
        isBooked: false,
        status: 'AVAILABLE'
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not available for booking' }, { status: 400 })
    }

    // Generate meeting URL for video calls
    const meetingUrl = `https://meet.sheikhdin.com/${eventId}-${Date.now()}`

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        sheikhId,
        clientId: user.id,
        eventId,
        serviceType,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        description,
        notes,
        price,
        meetingUrl
      },
      include: {
        sheikh: {
          include: { profile: true }
        },
        client: {
          include: { profile: true }
        },
        event: true
      }
    })

    // Update the event as booked
    await prisma.calendarEvent.update({
      where: { id: eventId },
      data: {
        isBooked: true,
        bookedBy: user.id,
        status: 'BOOKED'
      }
    })

    // Create notification for the sheikh
    await prisma.notification.create({
      data: {
        userId: sheikhId,
        title: 'New Booking Request',
        message: `${user.profile?.name || 'Someone'} has requested to book your time for ${serviceType}`,
        type: 'BOOKING_REQUEST',
        data: JSON.stringify({ bookingId: booking.id })
      }
    })

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/bookings - Update booking status
export async function PATCH(request: NextRequest) {
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
    const { bookingId, status, notes } = body

    if (!bookingId || !status) {
      return NextResponse.json({ error: 'Booking ID and status are required' }, { status: 400 })
    }

    // Check if user has permission to update this booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [
          { sheikhId: user.id },
          { clientId: user.id }
        ]
      },
      include: {
        sheikh: { include: { profile: true } },
        client: { include: { profile: true } }
      }
    })

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found or unauthorized' }, { status: 404 })
    }

    // Update the booking
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        notes
      },
      include: {
        sheikh: {
          include: { profile: true }
        },
        client: {
          include: { profile: true }
        },
        event: true
      }
    })

    // If cancelled, free up the calendar event
    if (status === 'CANCELLED') {
      await prisma.calendarEvent.update({
        where: { id: existingBooking.eventId },
        data: {
          isBooked: false,
          bookedBy: null,
          status: 'AVAILABLE'
        }
      })
    }

    // Create notification for the other party
    const notificationUserId = existingBooking.sheikhId === user.id ? 
      existingBooking.clientId : existingBooking.sheikhId
    const notificationTitle = status === 'CONFIRMED' ? 'Booking Confirmed' : 
                             status === 'CANCELLED' ? 'Booking Cancelled' : 'Booking Updated'

    await prisma.notification.create({
      data: {
        userId: notificationUserId,
        title: notificationTitle,
        message: `Your booking for ${existingBooking.serviceType} has been ${status.toLowerCase()}`,
        type: `BOOKING_${status}` as any,
        data: JSON.stringify({ bookingId: booking.id })
      }
    })

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Booking update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

