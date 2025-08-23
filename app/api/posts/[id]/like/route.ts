import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const postId = params.id

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        likes: {
          increment: 1
        }
      }
    })
    
    return NextResponse.json({ likes: post.likes })
  } catch (error) {
    console.error('Error liking post:', error)
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
  }
}
