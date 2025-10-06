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

// GET /api/messages - Get conversations for the current user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all conversations (unique users the current user has messaged or received messages from)
    const conversations = await prisma.$queryRaw`
      SELECT DISTINCT 
        u.id,
        u.email,
        p.name,
        p.profileImage,
        p.bio,
        u.userType,
        (
          SELECT m.content 
          FROM "Message" m 
          WHERE (m."fromUserId" = ${user.id} AND m."toUserId" = u.id) 
             OR (m."fromUserId" = u.id AND m."toUserId" = ${user.id})
          ORDER BY m."createdAt" DESC 
          LIMIT 1
        ) as lastMessage,
        (
          SELECT m."createdAt" 
          FROM "Message" m 
          WHERE (m."fromUserId" = ${user.id} AND m."toUserId" = u.id) 
             OR (m."fromUserId" = u.id AND m."toUserId" = ${user.id})
          ORDER BY m."createdAt" DESC 
          LIMIT 1
        ) as lastMessageTime,
        (
          SELECT COUNT(*) 
          FROM "Message" m 
          WHERE m."fromUserId" = u.id 
            AND m."toUserId" = ${user.id} 
            AND m."isRead" = false
        ) as unreadCount
      FROM "User" u
      LEFT JOIN "Profile" p ON u.id = p."userId"
      WHERE u.id IN (
        SELECT DISTINCT 
          CASE 
            WHEN m."fromUserId" = ${user.id} THEN m."toUserId"
            ELSE m."fromUserId"
          END
        FROM "Message" m
        WHERE m."fromUserId" = ${user.id} OR m."toUserId" = ${user.id}
      )
      ORDER BY "lastMessageTime" DESC
    `

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { toUserId, content } = await request.json()

    if (!toUserId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: toUserId }
    })

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        fromUserId: user.id,
        toUserId,
        content: content.trim()
      },
      include: {
        fromUser: {
          include: { profile: true }
        },
        toUser: {
          include: { profile: true }
        }
      }
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




