import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true }
    })
  } catch (error) {
    return null
  }
}

// GET /api/messages/[userId] - Get messages between current user and specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params

    // Get messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            fromUserId: user.id,
            toUserId: userId
          },
          {
            fromUserId: userId,
            toUserId: user.id
          }
        ]
      },
      include: {
        fromUser: {
          include: { profile: true }
        },
        toUser: {
          include: { profile: true }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Mark messages from the other user as read
    await prisma.message.updateMany({
      where: {
        fromUserId: userId,
        toUserId: user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/messages/[userId] - Mark messages as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params

    // Mark all unread messages from this user as read
    await prisma.message.updateMany({
      where: {
        fromUserId: userId,
        toUserId: user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




