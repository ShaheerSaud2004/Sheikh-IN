'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { 
  BookOpen,
  Play,
  Mic,
  Radio,
  Search,
  Filter,
  Plus,
  Heart,
  Eye,
  Clock,
  User
} from 'lucide-react'

interface Content {
  id: string
  title: string
  description: string
  content?: string
  videoUrl?: string
  audioUrl?: string
  thumbnail?: string
  category: string
  tags?: string
  isPublic: boolean
  isLive: boolean
  liveUrl?: string
  views: number
  likes: number
  duration?: number
  createdAt: string
  author: {
    profile: {
      name: string
      profileImage?: string
    }
  }
}

export default function ContentPage() {
  const { user, token } = useAuth()
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showLiveOnly, setShowLiveOnly] = useState(false)

  const categories = [
    'ARTICLE',
    'VIDEO', 
    'PODCAST',
    'LIVESTREAM',
    'KHUTBAH',
    'LESSON',
    'REMINDER'
  ]

  useEffect(() => {
    fetchContent()
  }, [search, selectedCategory, showLiveOnly, token])

  const fetchContent = async () => {
    if (!token) return

    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory) params.append('category', selectedCategory)
      if (showLiveOnly) params.append('isLive', 'true')

      const response = await fetch(`/api/content?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setContent(data.content || [])
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'VIDEO': return <Play className="w-5 h-5" />
      case 'PODCAST': return <Mic className="w-5 h-5" />
      case 'LIVESTREAM': return <Radio className="w-5 h-5" />
      default: return <BookOpen className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'VIDEO': return 'bg-red-100 text-red-800'
      case 'PODCAST': return 'bg-purple-100 text-purple-800'
      case 'LIVESTREAM': return 'bg-orange-100 text-orange-800'
      case 'KHUTBAH': return 'bg-green-100 text-green-800'
      case 'LESSON': return 'bg-blue-100 text-blue-800'
      case 'ARTICLE': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-emerald-600" />
              Islamic Content Library
            </h1>
            <p className="text-gray-600 mt-2">
              Discover Islamic knowledge, khutbahs, lessons, and more
            </p>
          </div>
          
          {user?.userType === 'PROFESSIONAL' && (
            <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showLiveOnly}
                  onChange={(e) => setShowLiveOnly(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">Live Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail/Header */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-teal-100">
                  {item.thumbnail ? (
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {getCategoryIcon(item.category)}
                    </div>
                  )}
                  
                  {/* Live Badge */}
                  {item.isLive && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                      LIVE
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category.charAt(0) + item.category.slice(1).toLowerCase()}
                    </span>
                  </div>
                  
                  {/* Duration for videos/audio */}
                  {item.duration && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {formatDuration(item.duration)}
                    </div>
                  )}
                </div>
                
                {/* Content Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.description}</p>
                  
                  {/* Author */}
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      {item.author.profile.profileImage ? (
                        <img 
                          src={item.author.profile.profileImage} 
                          alt={item.author.profile.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.author.profile.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {item.views}
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {item.likes}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button className="flex items-center text-emerald-600 hover:text-emerald-700">
                      {item.isLive ? (
                        <>
                          <Radio className="w-4 h-4 mr-1" />
                          Watch Live
                        </>
                      ) : item.videoUrl ? (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Watch
                        </>
                      ) : item.audioUrl ? (
                        <>
                          <Mic className="w-4 h-4 mr-1" />
                          Listen
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-1" />
                          Read
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && content.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-500">
              {search || selectedCategory ? 'Try adjusting your search or filters' : 'Be the first to share Islamic content'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

