import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const serviceType = searchParams.get('serviceType')
    const location = searchParams.get('location')
    const language = searchParams.get('language')
    const madhhab = searchParams.get('madhhab')
    const professionalType = searchParams.get('professionalType')

    // Build where clause
    const where: any = {
      user: {
        userType: 'PROFESSIONAL'
      }
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
        { seminary: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (madhhab) {
      where.madhhab = madhhab
    }

    if (professionalType) {
      where.professionalType = professionalType
    }

    const profiles = await prisma.profile.findMany({
      where,
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
        endorsements: true
      },
      take: 20
    })

    // Filter by language and serviceType if provided (since they're JSON strings)
    let filteredProfiles = profiles

    if (language) {
      filteredProfiles = filteredProfiles.filter(profile => {
        if (!profile.languages) return false
        const languages = JSON.parse(profile.languages)
        return languages.includes(language)
      })
    }

    if (serviceType) {
      filteredProfiles = filteredProfiles.filter(profile => {
        if (!profile.specialties) return false
        const specialties = JSON.parse(profile.specialties)
        return specialties.includes(serviceType)
      })
    }

    // Format the response
    const formattedProfiles = filteredProfiles.map(profile => ({
      ...profile,
      languages: profile.languages ? JSON.parse(profile.languages) : [],
      specialties: profile.specialties ? JSON.parse(profile.specialties) : [],
      certifications: profile.certifications ? JSON.parse(profile.certifications) : []
    }))

    return NextResponse.json(formattedProfiles)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
