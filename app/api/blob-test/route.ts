import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST() {
  try {
    const { url } = await put('test-blob.txt', 'Hello World from Sheikh-Din!', { 
      access: 'public' 
    })
    
    return NextResponse.json({ 
      success: true, 
      url,
      message: 'BLOB storage test successful' 
    })
  } catch (error) {
    console.error('BLOB storage error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload to BLOB storage' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'BLOB storage test endpoint ready',
    instructions: 'Send a POST request to test BLOB storage'
  })
}
