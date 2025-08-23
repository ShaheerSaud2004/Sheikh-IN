import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📝 Found ${posts.length} posts in database:`)
    console.log('='.repeat(50))
    
    posts.forEach((post, index) => {
      console.log(`\n${index + 1}. Post ID: ${post.id}`)
      console.log(`   Content: ${post.content}`)
      console.log(`   User: ${post.user?.profile?.name || post.user?.email || 'Unknown'}`)
      console.log(`   Created: ${post.createdAt}`)
      console.log(`   Service Type: ${post.serviceType || 'None'}`)
      console.log(`   Location: ${post.location || 'None'}`)
    })

    if (posts.length === 0) {
      console.log('❌ No posts found in database')
    }
  } catch (e) {
    console.error('❌ Error fetching posts:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
