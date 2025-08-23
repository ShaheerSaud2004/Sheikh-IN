import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

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

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await prisma.profile.update({
        where: { userId: user.id },
        data: {
          ...body,
          languages: body.languages ? JSON.stringify(body.languages) : undefined,
          specialties: body.specialties ? JSON.stringify(body.specialties) : undefined,
          certifications: body.certifications ? JSON.stringify(body.certifications) : undefined
        }
      })
      return NextResponse.json(updatedProfile)
    }

    // Create new profile
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        ...body,
        languages: body.languages ? JSON.stringify(body.languages) : null,
        specialties: body.specialties ? JSON.stringify(body.specialties) : null,
        certifications: body.certifications ? JSON.stringify(body.certifications) : null
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              userType: true
            }
          },
          credentials: true,
          experiences: true,
          videos: true,
          endorsements: true
        }
      })

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      return NextResponse.json({
        ...profile,
        languages: profile.languages ? JSON.parse(profile.languages) : [],
        specialties: profile.specialties ? JSON.parse(profile.specialties) : [],
        certifications: profile.certifications ? JSON.parse(profile.certifications) : []
      })
    }

    // Get all profiles (for discovery)
    const profiles = await prisma.profile.findMany({
      include: {
        user: {
          select: {
            userType: true
          }
        },
        credentials: true,
        experiences: true
      },
      take: 20
    })

    const formattedProfiles = profiles.map(profile => ({
      ...profile,
      languages: profile.languages ? JSON.parse(profile.languages) : [],
      specialties: profile.specialties ? JSON.parse(profile.specialties) : [],
      certifications: profile.certifications ? JSON.parse(profile.certifications) : []
    }))

    return NextResponse.json(formattedProfiles)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
