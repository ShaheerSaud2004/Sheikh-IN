import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import nodemailer from 'nodemailer'

// In-memory storage for serverless environment
// Note: In production, you'd want to use a database like PostgreSQL or MongoDB
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

    // Send confirmation email
    try {
      console.log(`📧 Sending welcome email to ${email} for ${name}`)
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

// Email sending function that can send to anyone
async function sendWelcomeEmail(email: string, name: string) {
  console.log(`📧 Sending welcome email to ${email} for ${name}`)
  
  // Try Gmail SMTP first with new app password
  try {
    console.log('Trying Gmail SMTP with new app password...')
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shaheersaud2004@gmail.com',
        pass: process.env.app_password || 'jxcb clih jcnq yluw'
      }
    })

    const mailOptions = {
      from: 'Sheikh-Din <shaheersaud2004@gmail.com>',
      to: email,
      subject: 'Welcome to Sheikh-Din Waitlist! 🕌',
      html: getEmailHTML(name),
      text: getEmailText(name)
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully via Gmail SMTP:', info.messageId)
    return info
    
  } catch (gmailError) {
    console.log('❌ Gmail SMTP failed, trying Resend:', gmailError)
    
    // Fallback to Resend
    try {
      const resend = new Resend(process.env.RESEND_API_KEY || 're_6rEzNT3K_FXobwoatavkUdbrA6Z8CcaBy')
      
      const { data, error } = await resend.emails.send({
        from: 'Sheikh-Din <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to Sheikh-Din Waitlist! 🕌',
        html: getEmailHTML(name),
        text: getEmailText(name)
      })

      if (error) {
        throw error
      }

      console.log('✅ Email sent successfully via Resend:', data)
      return data
      
    } catch (resendError) {
      console.log('❌ Resend also failed, using fallback method:', resendError)
    
      // Final fallback: Send email to your verified address with the intended recipient info
      try {
        const resend = new Resend(process.env.RESEND_API_KEY || 're_6rEzNT3K_FXobwoatavkUdbrA6Z8CcaBy')
        
        const { data, error } = await resend.emails.send({
          from: 'Sheikh-Din <onboarding@resend.dev>',
          to: ['shaheersaud2004s@gmail.com'],
          subject: `📧 Sheikh-Din Waitlist: ${name} (${email}) signed up!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">New Waitlist Signup!</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Sheikh-Din</p>
              </div>
              
              <div style="padding: 40px; background: white;">
                <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                  <p style="color: #92400e; margin: 0; font-size: 14px;">
                    <strong>📧 Forward this email to:</strong> <strong>${name}</strong> (${email})
                  </p>
                </div>
                <h2 style="color: #374151; margin-bottom: 20px;">New Signup Details:</h2>
                <p style="color: #6b7280; margin-bottom: 10px;"><strong>Name:</strong> ${name}</p>
                <p style="color: #6b7280; margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
                <p style="color: #6b7280; margin-bottom: 20px;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                
                <h3 style="color: #374151; margin-bottom: 20px;">Welcome Email for ${name}:</h3>
                
                ${getEmailHTML(name)}
              </div>
              
              <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                <p style="margin: 0;">© 2024 Sheikh-Din. All rights reserved.</p>
              </div>
            </div>
          `
        })

        if (error) {
          throw error
        }

        console.log('✅ Fallback email sent successfully:', data)
        return data
        
      } catch (fallbackError) {
        console.error('❌ All email methods failed:', fallbackError)
        throw fallbackError
      }
    }
  }
}

// Helper function to generate email HTML
function getEmailHTML(name: string) {
  return `
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
  `
}

// Helper function to generate email text
function getEmailText(name: string) {
  return `
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
}