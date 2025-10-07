'use client'

import { formatDistanceToNow } from 'date-fns'
import { Check, CheckCheck } from 'lucide-react'

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    createdAt: Date
    isRead: boolean
    fromUser: {
      id: string
      profile?: {
        name: string
        profileImage?: string
      }
    }
  }
  isOwnMessage: boolean
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {!isOwnMessage && (
          <div className="flex-shrink-0">
            <img
              src={message.fromUser.profile?.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={message.fromUser.profile?.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}
        
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-4 py-2 rounded-2xl max-w-full break-words ${
              isOwnMessage
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-gray-200 text-gray-900 rounded-bl-md'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
          
          <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>
            
            {isOwnMessage && (
              <div className="flex-shrink-0">
                {message.isRead ? (
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                ) : (
                  <Check className="w-3 h-3 text-gray-400" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}





