import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const postIdToDelete = 'cmeop88ol0001tvxqo2ojyp7d'

  try {
    const post = await prisma.post.findUnique({
      where: { id: postIdToDelete },
      include: { user: true }
    })

    if (post) {
      console.log('Found post to delete:', {
        id: post.id,
        content: post.content,
        user: post.user?.email || 'Unknown'
      })

      await prisma.post.delete({
        where: { id: postIdToDelete }
      })
      
      console.log(`✅ Post "${post.content}" deleted successfully!`)
    } else {
      console.log('❌ Post not found')
    }
  } catch (e) {
    console.error('❌ Error deleting post:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
