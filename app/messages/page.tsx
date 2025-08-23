'use client'

import Navigation from '@/components/Navigation'
import { MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Messages Coming Soon</h2>
            <p className="text-gray-600">
              Direct messaging feature will be available soon. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
