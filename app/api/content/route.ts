import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/content - Get content with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const authorId = searchParams.get('authorId')
    const isLive = searchParams.get('isLive')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const whereClause: any = {
      isPublic: true
    }

    if (category) {
      whereClause.category = category
    }

    if (authorId) {
      whereClause.authorId = authorId
    }

    if (isLive !== null) {
      whereClause.isLive = isLive === 'true'
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { content: { contains: search } }
      ]
    }

    const skip = (page - 1) * limit

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where: whereClause,
        include: {
          author: {
            include: { profile: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.content.count({ where: whereClause })
    ])

    return NextResponse.json({
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Content fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/content - Create new content
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
      content: contentText,
      videoUrl,
      audioUrl,
      thumbnail,
      category,
      tags,
      isPublic,
      isLive,
      liveUrl,
      duration
    } = body

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const content = await prisma.content.create({
      data: {
        authorId: user.id,
        title,
        description,
        content: contentText || '',
        videoUrl,
        audioUrl,
        thumbnail,
        category,
        tags: tags ? JSON.stringify(tags) : null,
        isPublic: isPublic !== false,
        isLive: isLive || false,
        liveUrl,
        duration
      },
      include: {
        author: {
          include: { profile: true }
        }
      }
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Content creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/content - Update content
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
    const { contentId, ...updateData } = body

    if (!contentId) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 })
    }

    // Check if user owns the content
    const existingContent = await prisma.content.findFirst({
      where: {
        id: contentId,
        authorId: user.id
      }
    })

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found or unauthorized' }, { status: 404 })
    }

    // Convert tags to JSON string if provided
    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags)
    }

    const content = await prisma.content.update({
      where: { id: contentId },
      data: updateData,
      include: {
        author: {
          include: { profile: true }
        }
      }
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Content update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/content - Delete content
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
    const contentId = searchParams.get('contentId')

    if (!contentId) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 })
    }

    // Check if user owns the content
    const existingContent = await prisma.content.findFirst({
      where: {
        id: contentId,
        authorId: user.id
      }
    })

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found or unauthorized' }, { status: 404 })
    }

    await prisma.content.delete({
      where: { id: contentId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Content deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

