'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import ConversationList from '@/components/ConversationList'
import ChatInterface from '@/components/ChatInterface'
import NewMessageModal from '@/components/NewMessageModal'
import { useAuth } from '@/contexts/AuthContext'

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

interface Message {
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
  toUser: {
    id: string
    profile?: {
      name: string
      profileImage?: string
    }
  }
}

export default function MessagesPage() {
  const { user, token } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<{
    id: string
    name: string
    profileImage?: string
    userType: string
  } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)

  // Check for URL parameter to start conversation with specific user
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const targetUserId = urlParams.get('user')
    
    if (targetUserId && token) {
      // Fetch user details and start conversation
      fetchUserAndStartConversation(targetUserId)
    }
  }, [token])

  // Fetch user details and start conversation
  const fetchUserAndStartConversation = async (userId: string) => {
    if (!token) return

    try {
      const response = await fetch(`/api/profile?userId=${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setSelectedUserId(userId)
        setSelectedUser({
          id: userId,
          name: userData.name,
          profileImage: userData.profileImage,
          userType: userData.user.userType
        })
        fetchMessages(userId)
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  // Fetch conversations
  const fetchConversations = async () => {
    if (!token) return

    setIsLoadingConversations(true)
    try {
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoadingConversations(false)
    }
  }

  // Fetch messages for a specific conversation
  const fetchMessages = async (userId: string) => {
    if (!token) return

    setIsLoadingMessages(true)
    try {
      const response = await fetch(`/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  // Send a message
  const sendMessage = async (content: string) => {
    if (!token || !selectedUserId) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          toUserId: selectedUserId,
          content
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, data.message])
        
        // Update conversations list with new message
        fetchConversations()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // Handle conversation selection
  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId)
    const conversation = conversations.find(c => c.id === userId)
    if (conversation) {
      setSelectedUser({
        id: conversation.id,
        name: conversation.name,
        profileImage: conversation.profileImage,
        userType: conversation.userType
      })
    }
    fetchMessages(userId)
  }

  // Handle new message from modal
  const handleNewMessage = (selectedUser: any) => {
    setSelectedUserId(selectedUser.id)
    setSelectedUser({
      id: selectedUser.id,
      name: selectedUser.profile?.name || 'Unknown User',
      profileImage: selectedUser.profile?.profileImage,
      userType: selectedUser.userType
    })
    setMessages([])
    fetchMessages(selectedUser.id)
  }

  // Handle back button
  const handleBack = () => {
    setSelectedUserId(null)
    setSelectedUser(null)
    setMessages([])
  }

  // Poll for new conversations and messages
  useEffect(() => {
    if (token) {
      fetchConversations()
      
      // Poll for updates every 10 seconds
      const interval = setInterval(() => {
        fetchConversations()
        if (selectedUserId) {
          fetchMessages(selectedUserId)
        }
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [token, selectedUserId])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Please sign in</h2>
              <p className="text-gray-600">You need to be signed in to access messages.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-200px)]">
            <div className="flex h-full">
              {/* Conversation List */}
              <div className="hidden md:block">
                <ConversationList
                  conversations={conversations}
                  selectedUserId={selectedUserId}
                  onSelectConversation={handleSelectConversation}
                  onNewMessage={() => setShowNewMessageModal(true)}
                />
              </div>

              {/* Chat Interface */}
              <div className="flex-1">
                <ChatInterface
                  selectedUser={selectedUser}
                  messages={messages}
                  onSendMessage={sendMessage}
                  onBack={handleBack}
                  isLoading={isLoadingMessages}
                />
              </div>
            </div>
          </div>

          {/* Mobile Conversation List (shown when no conversation is selected) */}
          {!selectedUserId && (
            <div className="md:hidden mt-4">
              <ConversationList
                conversations={conversations}
                selectedUserId={selectedUserId}
                onSelectConversation={handleSelectConversation}
                onNewMessage={() => setShowNewMessageModal(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      <NewMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onSelectUser={handleNewMessage}
      />
    </div>
  )
}
