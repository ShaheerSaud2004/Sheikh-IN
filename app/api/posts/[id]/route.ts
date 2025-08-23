import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const postId = params.id

  try {
    await prisma.post.delete({
      where: {
        id: postId,
      },
    })
    
    console.log(`Post ${postId} deleted successfully`)
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
