'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { 
  Heart, 
  MessageCircle, 
  Send, 
  MapPin, 
  Calendar,
  DollarSign,
  Users,
  BookOpen,
  Plus,
  X,
  Briefcase
} from 'lucide-react'
import { format } from 'date-fns'

interface Post {
  id: string
  content: string
  postType: string
  serviceType?: string
  location?: string
  date?: string
  compensation?: string
  requirements?: string
  likes: number
  views: number
  createdAt: string
  isLiked?: boolean
  user: {
    id: string
    email: string
    userType: string
    profile: {
      name: string
      profileImage?: string
      professionalType?: string
      location?: string
    }
  }
}

interface UserProfile {
  id: string
  name: string
  bio?: string
  profileImage?: string
  professionalType?: string
  location?: string
  userType: string
}

export default function Feed() {
  const router = useRouter()
  const { token } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [newPost, setNewPost] = useState({
    content: '',
    postType: 'Reminder',
    serviceType: '',
    location: '',
    date: '',
    compensation: '',
    requirements: ''
  })

  useEffect(() => {
    fetchPosts()
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    if (!token) return
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setCurrentUser({
          id: userData.user.id,
          name: userData.user.profile?.name || userData.user.email,
          bio: userData.user.profile?.bio,
          profileImage: userData.user.profile?.profileImage,
          professionalType: userData.user.profile?.professionalType,
          location: userData.user.profile?.location,
          userType: userData.user.userType
        })
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      setError('')
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        console.log('Feed received data:', data)
        console.log('First post user ID:', data[0]?.user?.id)
        
        // Log detailed post information
        if (data.length > 0) {
          console.log('=== POST CONTENT DETAILS ===')
          data.forEach((post: any, index: number) => {
            console.log(`Post ${index + 1}:`, {
              id: post.id,
              title: post.title,
              content: post.content,
              serviceType: post.serviceType,
              location: post.location,
              date: post.date,
              compensation: post.compensation,
              requirements: post.requirements,
              user: post.user?.name || 'Unknown user'
            })
          })
          console.log('=== END POST DETAILS ===')
        }
        
        setPosts(data)
      } else {
        setError('Error loading posts')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Error loading posts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    try {
      setError('')
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newPost,
          date: newPost.date ? new Date(newPost.date) : null
        })
      })

      if (response.ok) {
        const post = await response.json()
        setPosts([post, ...posts])
        setShowCreatePost(false)
        setNewPost({
          content: '',
          postType: 'Reminder',
          serviceType: '',
          location: '',
          date: '',
          compensation: '',
          requirements: ''
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setError('Failed to create post')
    }
  }

  const getPostIcon = (postType: string) => {
    switch (postType) {
      case 'Opportunity':
        return <Briefcase className="h-4 w-4" />
      case 'Request':
        return <Users className="h-4 w-4" />
      case 'Reminder':
        return <BookOpen className="h-4 w-4" />
      default:
        return null
    }
  }

  const getPostTypeColor = (postType: string) => {
    switch (postType) {
      case 'Opportunity':
        return 'bg-blue-100 text-blue-700'
      case 'Request':
        return 'bg-purple-100 text-purple-700'
      case 'Reminder':
        return 'bg-emerald-100 text-emerald-700'
      case 'Announcement':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Profile Card */}
            <div className="lg:col-span-3">
              {currentUser && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
                  {/* Profile Banner */}
                  <div className="h-16 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                  
                  {/* Profile Content */}
                  <div className="px-4 pb-4 -mt-8 relative">
                    <div className="flex flex-col items-center text-center">
                      {/* Profile Picture */}
                      <button 
                        onClick={() => router.push(`/profile/${currentUser.id}`)}
                        className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white mb-3 hover:bg-emerald-200 transition-colors"
                      >
                        <span className="text-emerald-600 font-semibold text-xl">
                          {currentUser.name[0].toUpperCase()}
                        </span>
                      </button>
                      
                      {/* Profile Info */}
                      <button 
                        onClick={() => router.push(`/profile/${currentUser.id}`)}
                        className="hover:text-emerald-600 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 mb-1">{currentUser.name}</h3>
                      </button>
                      
                      {currentUser.professionalType && (
                        <p className="text-sm text-emerald-600 font-medium mb-2">
                          {currentUser.professionalType}
                        </p>
                      )}
                      
                      {currentUser.bio && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {currentUser.bio}
                        </p>
                      )}
                      
                      {currentUser.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                          <MapPin className="h-3 w-3" />
                          {currentUser.location}
                        </div>
                      )}
                    </div>
                    
                    {/* Profile Stats */}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Profile views</span>
                        <span className="text-emerald-600 font-medium">127</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>Post impressions</span>
                        <span className="text-emerald-600 font-medium">1,242</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-6">
          {/* Create Post Button */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Create Post</span>
            </button>
          </div>

          {/* Create Post Modal */}
          {showCreatePost && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Create Post</h2>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post Type
                    </label>
                    <select
                      value={newPost.postType}
                      onChange={(e) => setNewPost({ ...newPost, postType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    >
                      <option value="Reminder">Islamic Reminder</option>
                      <option value="Opportunity">Job Opportunity</option>
                      <option value="Request">Service Request</option>
                      <option value="Announcement">Announcement</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      placeholder="What would you like to share?"
                    />
                  </div>

                  {(newPost.postType === 'Opportunity' || newPost.postType === 'Request') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Type
                        </label>
                        <select
                          value={newPost.serviceType}
                          onChange={(e) => setNewPost({ ...newPost, serviceType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                        >
                          <option value="">Select Service</option>
                          <option value="NIKAH">Nikah</option>
                          <option value="KHUTBAH">Khutbah</option>
                          <option value="JANAZAH">Janazah</option>
                          <option value="COUNSELING">Counseling</option>
                          <option value="TEACHING">Teaching</option>
                          <option value="YOUTH_PROGRAM">Youth Program</option>
                          <option value="RAMADAN_PROGRAM">Ramadan Program</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={newPost.location}
                          onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                          placeholder="City, State"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={newPost.date}
                          onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Compensation
                        </label>
                        <input
                          type="text"
                          value={newPost.compensation}
                          onChange={(e) => setNewPost({ ...newPost, compensation: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                          placeholder="e.g., $200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Requirements
                        </label>
                        <textarea
                          value={newPost.requirements}
                          onChange={(e) => setNewPost({ ...newPost, requirements: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                          placeholder="Any specific requirements?"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCreatePost(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.content}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Posts Feed */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" role="status"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">Be the first to share something with the community!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm">
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <button 
                          onClick={() => router.push(`/profile/${post.user.id}`)}
                          className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 hover:bg-emerald-200 transition-colors cursor-pointer"
                        >
                          <span className="text-emerald-600 font-semibold">
                            {post.user.profile?.name?.[0] || post.user.email[0].toUpperCase()}
                          </span>
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => router.push(`/profile/${post.user.id}`)}
                              className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors cursor-pointer"
                            >
                              {post.user.profile?.name || post.user.email}
                            </button>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPostTypeColor(post.postType)}`}>
                              {getPostIcon(post.postType)}
                              {post.postType}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            {post.user.profile?.professionalType && (
                              <span>{post.user.profile.professionalType}</span>
                            )}
                            {post.user.profile?.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {post.user.profile.location}
                              </span>
                            )}
                            <span>
                              {post.createdAt && !isNaN(new Date(post.createdAt).getTime()) 
                                ? format(new Date(post.createdAt), 'MMM d')
                                : 'Recently'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                    
                    {/* Delete Button */}
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this post?')) {
                            try {
                              const response = await fetch(`/api/posts/${post.id}`, {
                                method: 'DELETE',
                              })
                              
                              if (response.ok) {
                                // Remove from local state
                                setPosts(posts.filter(p => p.id !== post.id))
                                console.log('Post deleted successfully!')
                              } else {
                                console.error('Failed to delete post')
                              }
                            } catch (error) {
                              console.error('Error deleting post:', error)
                            }
                          }
                        }}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    
                    {/* Post Details */}
                    {(post.serviceType || post.location || post.date || post.compensation) && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
                        {post.serviceType && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-600">Service:</span>
                            <span className="text-gray-800">{post.serviceType.replace(/_/g, ' ')}</span>
                          </div>
                        )}
                        {post.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-800">{post.location}</span>
                          </div>
                        )}
                        {post.date && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-800">{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                          </div>
                        )}
                        {post.compensation && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-800">{post.compensation}</span>
                          </div>
                        )}
                        {post.requirements && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-600">Requirements:</span>
                            <p className="text-gray-800 mt-1">{post.requirements}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/posts/${post.id}/like`, {
                                method: 'PATCH',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json'
                                }
                              })
                              
                              if (response.ok) {
                                // Update local state to reflect the like
                                setPosts(posts.map(p => 
                                  p.id === post.id 
                                    ? { ...p, likes: (p.likes || 0) + 1, isLiked: true }
                                    : p
                                ))
                              }
                            } catch (error) {
                              console.error('Error liking post:', error)
                            }
                          }}
                          className={`flex items-center gap-2 transition-all duration-200 ${
                            post.isLiked 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-gray-600 hover:text-red-500'
                          }`}
                        >
                          <Heart 
                            className={`h-5 w-5 transition-all duration-200 ${
                              post.isLiked ? 'fill-current' : ''
                            }`}
                          />
                          <span className="text-sm font-medium">{post.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition">
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm">Comment</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition">
                          <Send className="h-5 w-5" />
                          <span className="text-sm">Send Proposal</span>
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">{post.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
            </div>

            {/* Right Sidebar - Quick Links */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/search')}
                    className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    🔍 Find Scholars
                  </button>
                  <button 
                    onClick={() => router.push('/proposals')}
                    className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    📋 My Proposals
                  </button>
                  <button 
                    onClick={() => router.push('/messages')}
                    className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    💬 Messages
                  </button>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Popular Services</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">🕌 Nikah Ceremonies</div>
                    <div className="text-xs text-gray-600">📖 Tajweed Classes</div>
                    <div className="text-xs text-gray-600">🎤 Friday Khutbah</div>
                    <div className="text-xs text-gray-600">💬 Islamic Counseling</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
