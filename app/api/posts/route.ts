import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Posts fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    // Clean up the data before creating the post
    const cleanData = {
      userId: user.id,
      content: body.content,
      postType: body.postType,
      serviceType: body.serviceType || null,
      location: body.location || null,
      date: body.date ? new Date(body.date) : null,
      compensation: body.compensation || null,
      requirements: body.requirements || null
    }

    const post = await prisma.post.create({
      data: cleanData,
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
