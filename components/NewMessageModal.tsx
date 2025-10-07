'use client'

import { useState, useEffect } from 'react'
import { X, Search, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface User {
  id: string
  email: string
  profile?: {
    name: string
    profileImage?: string
    bio?: string
  }
  userType: string
}

interface NewMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUser: (user: User) => void
}

export default function NewMessageModal({ isOpen, onClose, onSelectUser }: NewMessageModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  const fetchUsers = async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/search?type=users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">New Message</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No users found' : 'No users available'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user)
                    onClose()
                  }}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        src={user.profile?.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                        alt={user.profile?.name || 'User'}
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {user.profile?.name || 'Unknown User'}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getUserTypeColor(user.userType)}`}>
                          {getUserTypeLabel(user.userType)}
                        </span>
                      </div>
                      
                      {user.profile?.bio && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {user.profile.bio}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}





