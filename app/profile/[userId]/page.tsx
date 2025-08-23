'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { 
  MapPin,
  Book,
  Award,
  Languages,
  Globe,
  Phone,
  Mail,
  CheckCircle,
  Star,
  MessageSquare,
  UserPlus,
  Send,
  ArrowLeft,
  Play
} from 'lucide-react'
import { format } from 'date-fns'

interface Credential {
  id: string
  title: string
  institution: string
  year: string
  description?: string
  isVerified: boolean
}

interface Experience {
  id: string
  title: string
  organization: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  location?: string
  description?: string
}

interface Video {
  id: string
  title: string
  videoType: string
  description?: string
  views: number
  createdAt: string
}

interface Endorsement {
  id: string
  endorserName: string
  endorserTitle?: string
  content: string
  qualities: string
}

interface Profile {
  id: string
  name: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  profileImage?: string
  professionalType?: string
  madhhab?: string
  languages: string[]
  specialties: string[]
  travelRadius?: number
  isAvailable: boolean
  hourlyRate?: number
  isHafiz: boolean
  hasIjazah: boolean
  ijazahDetails?: string
  seminary?: string
  yearsExperience?: number
  certifications: string[]
  organizationName?: string
  organizationType?: string
  user: {
    id: string
    email: string
    userType: string
  }
  credentials: Credential[]
  experiences: Experience[]
  videos: Video[]
  endorsements: Endorsement[]
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about')
  const [showProposalModal, setShowProposalModal] = useState(false)
  const [proposalData, setProposalData] = useState({
    serviceType: '',
    eventDate: '',
    location: '',
    description: '',
    budget: ''
  })

  const userId = params.userId as string
  const isOwnProfile = user?.id === userId

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(`/api/profile?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()

        // Ensure arrays are properly initialized
        const profileWithArrays = {
          ...data,
          credentials: Array.isArray(data.credentials) ? data.credentials : [],
          experiences: Array.isArray(data.experiences) ? data.experiences : [],
          videos: Array.isArray(data.videos) ? data.videos : [],
          endorsements: Array.isArray(data.endorsements) ? data.endorsements : [],
          certifications: Array.isArray(data.certifications) ? data.certifications : []
        }
        setProfile(profileWithArrays)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSendProposal = async () => {
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          toUserId: userId,
          ...proposalData
        })
      })

      if (response.ok) {
        alert('Proposal sent successfully!')
        setShowProposalModal(false)
        setProposalData({
          serviceType: '',
          eventDate: '',
          location: '',
          description: '',
          budget: ''
        })
      }
    } catch (error) {
      console.error('Error sending proposal:', error)
      alert('Failed to send proposal')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="relative h-16 bg-emerald-500 rounded-t-lg"></div>
            
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end space-x-4">
                  <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-3xl font-bold text-emerald-600">
                      {profile.name?.[0] || '?'}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      {profile.professionalType && (
                        <span>{profile.professionalType}</span>
                      )}
                      {profile.organizationType && (
                        <span>{profile.organizationType}</span>
                      )}
                      {profile.credentials.length > 0 && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>

                {!isOwnProfile && user && (
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      <UserPlus className="h-5 w-5" />
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      <MessageSquare className="h-5 w-5" />
                    </button>
                    {profile.user.userType === 'PROFESSIONAL' && (
                      <button
                        onClick={() => setShowProposalModal(true)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                      >
                        <Send className="h-5 w-5" />
                        Send Proposal
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </div>
                )}
                {profile.seminary && (
                  <div className="flex items-center gap-1">
                    <Book className="h-4 w-4" />
                    {profile.seminary}
                  </div>
                )}
                {profile.yearsExperience && (
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {profile.yearsExperience} years
                  </div>
                )}
                {profile.languages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Languages className="h-4 w-4" />
                    {profile.languages.join(', ')}
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.isHafiz && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">
                    Hafiz
                  </span>
                )}
                {profile.hasIjazah && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    Ijazah
                  </span>
                )}
                {profile.madhhab && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {profile.madhhab}
                  </span>
                )}
                {profile.isAvailable && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    Available
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-6">
                {['about', 'credentials', 'experience', 'videos', 'endorsements'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 border-b-2 font-medium text-sm capitalize transition ${
                      activeTab === tab
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  {profile.bio && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                      <p className="text-gray-600">{profile.bio}</p>
                    </div>
                  )}

                  {profile.specialties.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg"
                          >
                            {specialty.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.ijazahDetails && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Ijazah Details</h3>
                      <p className="text-gray-600">{profile.ijazahDetails}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      {profile.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          {profile.phone}
                        </div>
                      )}
                      {profile.user && profile.user.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          {profile.user.email}
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="h-4 w-4" />
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                            {profile.website}
                          </a>
                        </div>
                      )}
                      {!profile.phone && !profile.user?.email && !profile.website && (
                        <p className="text-gray-500">No contact information available</p>
                      )}

                    </div>
                  </div>
                </div>
              )}

              {/* Credentials Tab */}
              {activeTab === 'credentials' && (
                <div className="space-y-4">
                  {profile.credentials && profile.credentials.length > 0 ? (
                    profile.credentials.map((credential) => (
                      <div key={credential.id} className="border-l-4 border-emerald-600 pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{credential.title}</h4>
                            <p className="text-gray-600">{credential.institution}</p>
                            <p className="text-sm text-gray-500">{credential.year}</p>
                            {credential.description && (
                              <p className="text-gray-600 mt-2">{credential.description}</p>
                            )}
                          </div>
                          {credential.isVerified && (
                            <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No credentials added yet</p>
                  )}

                  {profile.certifications && profile.certifications.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Certifications</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {profile.certifications.map((cert, index) => (
                          <li key={index} className="text-gray-600">{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  {profile.experiences && profile.experiences.length > 0 ? (
                    profile.experiences.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-gray-300 pl-4">
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <p className="text-gray-600">{exp.organization}</p>
                        <p className="text-sm text-gray-500">
                          {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                        {exp.description && (
                          <p className="text-gray-600 mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No experience added yet</p>
                  )}
                </div>
              )}

              {/* Videos Tab */}
              {activeTab === 'videos' && (
                <div className="space-y-4">
                  {profile.videos && profile.videos.length > 0 ? (
                    profile.videos.map((video) => (
                      <div key={video.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{video.title}</h4>
                            <p className="text-sm text-gray-500">{video.videoType}</p>
                            {video.description && (
                              <p className="text-gray-600 mt-2">{video.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{video.views} views</span>
                              <span>{format(new Date(video.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                          <button className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200">
                            <Play className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No videos added yet</p>
                  )}
                </div>
              )}

              {/* Endorsements Tab */}
              {activeTab === 'endorsements' && (
                <div className="space-y-4">
                  {profile.endorsements.length > 0 ? (
                    profile.endorsements.map((endorsement) => (
                      <div key={endorsement.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{endorsement.endorserName}</h4>
                            {endorsement.endorserTitle && (
                              <p className="text-sm text-gray-500">{endorsement.endorserTitle}</p>
                            )}
                          </div>
                          <Star className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="text-gray-600 mb-3">{endorsement.content}</p>
                        {endorsement.qualities && JSON.parse(endorsement.qualities).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {JSON.parse(endorsement.qualities).map((quality: string) => (
                              <span
                                key={quality}
                                className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded"
                              >
                                {quality}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No endorsements yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Send Proposal to {profile.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={proposalData.serviceType}
                  onChange={(e) => setProposalData({ ...proposalData, serviceType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                >
                  <option value="">Select Service</option>
                  {profile.specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  value={proposalData.eventDate}
                  onChange={(e) => setProposalData({ ...proposalData, eventDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={proposalData.location}
                  onChange={(e) => setProposalData({ ...proposalData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  placeholder="Event location"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={proposalData.description}
                  onChange={(e) => setProposalData({ ...proposalData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  placeholder="Describe your event and requirements..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (optional)
                </label>
                <input
                  type="text"
                  value={proposalData.budget}
                  onChange={(e) => setProposalData({ ...proposalData, budget: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  placeholder="e.g., $200"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendProposal}
                  disabled={!proposalData.serviceType || !proposalData.eventDate || !proposalData.location || !proposalData.description}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
