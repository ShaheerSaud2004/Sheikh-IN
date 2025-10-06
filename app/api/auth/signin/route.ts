import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Demo accounts for production (when database isn't available)
    const demoAccounts = {
      'sheikh.ahmad@example.com': { password: 'password123', userType: 'PROFESSIONAL', name: 'Sheikh Ahmad' },
      'ali.hassan@example.com': { password: 'password123', userType: 'SEEKER', name: 'Ali Hassan' },
      'masjid.taqwa@example.com': { password: 'password123', userType: 'ORGANIZATION', name: 'Masjid Taqwa' }
    }

    // Check demo accounts first
    if (demoAccounts[email as keyof typeof demoAccounts] && 
        demoAccounts[email as keyof typeof demoAccounts].password === password) {
      const account = demoAccounts[email as keyof typeof demoAccounts]
      const token = generateToken(email) // Use email as ID for demo
      
      return NextResponse.json({
        user: {
          id: email,
          email: email,
          userType: account.userType,
          name: account.name,
          profile: { name: account.name, bio: 'Demo account' }
        },
        token
      })
    }

    // Try database authentication
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Generate token
      const token = generateToken(user.id)

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          profile: user.profile
        },
        token
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Fall back to demo accounts if database fails
      return NextResponse.json(
        { error: 'Database unavailable. Please use demo accounts.' },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
