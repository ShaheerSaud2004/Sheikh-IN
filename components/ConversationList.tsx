'use client'

import { formatDistanceToNow } from 'date-fns'
import { Search, MessageCircle } from 'lucide-react'
import { useState } from 'react'

interface Conversation {
  id: string
  email: string
  name: string
  profileImage?: string
  bio?: string
  userType: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedUserId: string | null
  onSelectConversation: (userId: string) => void
  onNewMessage: () => void
}

export default function ConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
  onNewMessage
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'PROFESSIONAL':
        return 'bg-green-100 text-green-800'
      case 'ORGANIZATION':
        return 'bg-purple-100 text-purple-800'
      case 'SEEKER':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'PROFESSIONAL':
        return 'Professional'
      case 'ORGANIZATION':
        return 'Organization'
      case 'SEEKER':
        return 'Seeker'
      default:
        return userType
    }
  }

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <button
            onClick={onNewMessage}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedUserId === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={conversation.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      {conversation.lastMessageTime && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getUserTypeColor(conversation.userType)}`}>
                        {getUserTypeLabel(conversation.userType)}
                      </span>
                    </div>
                    
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}




