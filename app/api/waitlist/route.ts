import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Simple in-memory storage for demo purposes
// In production, you'd use a proper database
let waitlistEntries: Array<{
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  interest?: string
  message?: string
  createdAt: Date
}> = []

// POST /api/waitlist - Add user to waitlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, location, interest, message } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    // Check if email already exists
    const existingEntry = waitlistEntries.find(entry => entry.email === email)

    if (existingEntry) {
      return NextResponse.json({ error: 'This email is already on the waitlist' }, { status: 400 })
    }

    // Create waitlist entry
    const waitlistEntry = {
      id: Math.random().toString(36).substring(2, 15),
      name,
      email,
      phone,
      location,
      interest,
      message,
      createdAt: new Date()
    }
    
    waitlistEntries.push(waitlistEntry)

    // Send confirmation email using Resend
    try {
      await sendWelcomeEmail(email, name)
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined the waitlist!',
      id: waitlistEntry.id 
    })

  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/waitlist - Get waitlist entries (admin only)
export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd check for admin authentication here
    const entries = waitlistEntries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error fetching waitlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Real email sending function using Resend
async function sendWelcomeEmail(email: string, name: string) {
  console.log(`📧 Sending welcome email to ${email} for ${name}`)
  
  // Initialize Resend with API key
  const resend = new Resend(process.env.RESEND_API_KEY || 're_6rEzNT3K_FXobwoatavkUdbrA6Z8CcaBy')
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Sheikh-Din <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to Sheikh-Din Waitlist! 🕌',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Sheikh-Din!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">LinkedIn for Sheikhs</p>
          </div>
          
          <div style="padding: 40px; background: white;">
            <h2 style="color: #374151; margin-bottom: 20px;">Assalamu alaikum ${name}!</h2>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining the Sheikh-Din waitlist! We're excited to have you as part of our community.
            </p>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 30px;">
              You'll be among the first to know when we launch, and you'll get exclusive early access to:
            </p>
            
            <ul style="color: #6b7280; line-height: 1.8; margin-bottom: 30px;">
              <li>🔍 Find qualified Islamic scholars in your area</li>
              <li>📅 Book nikah ceremonies, khutbahs, and consultations</li>
              <li>📚 Access Islamic knowledge and educational content</li>
              <li>🤝 Connect with like-minded Muslims and professionals</li>
            </ul>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <h3 style="color: #166534; margin: 0 0 10px 0;">What's Next?</h3>
              <p style="color: #166534; margin: 0; font-size: 14px;">
                We'll notify you via email as soon as we launch. In the meantime, 
                feel free to share Sheikh-Din with your friends and family!
              </p>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6;">
              If you have any questions, please don't hesitate to reach out to us.
            </p>
            
            <p style="color: #6b7280; line-height: 1.6; margin-top: 30px;">
              Barakallahu feek,<br>
              The Sheikh-Din Team
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">© 2024 Sheikh-Din. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `
        Welcome to Sheikh-Din!
        
        Assalamu alaikum ${name}!
        
        Thank you for joining the Sheikh-Din waitlist! We're excited to have you as part of our community.
        
        You'll be among the first to know when we launch, and you'll get exclusive early access to:
        - Find qualified Islamic scholars in your area
        - Book nikah ceremonies, khutbahs, and consultations
        - Access Islamic knowledge and educational content
        - Connect with like-minded Muslims and professionals
        
        We'll notify you via email as soon as we launch. In the meantime, feel free to share Sheikh-Din with your friends and family!
        
        If you have any questions, please don't hesitate to reach out to us.
        
        Barakallahu feek,
        The Sheikh-Din Team
      `
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('✅ Email sent successfully:', data)
    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

