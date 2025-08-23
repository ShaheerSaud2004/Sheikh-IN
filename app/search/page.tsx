'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { 
  Search as SearchIcon,
  MapPin,
  Book,
  Award,
  Languages,
  Filter,
  X,
  User,
  CheckCircle
} from 'lucide-react'
import { PROFESSIONAL_TYPES, MADHHABS, SERVICE_TYPES, LANGUAGES } from '@/lib/constants'

interface Profile {
  id: string
  name: string
  bio?: string
  location?: string
  profileImage?: string
  professionalType?: string
  madhhab?: string
  languages: string[]
  specialties: string[]
  isHafiz: boolean
  hasIjazah: boolean
  seminary?: string
  yearsExperience?: number
  user: {
    id: string
    userType: string
  }
  credentials: any[]
  endorsements: any[]
}

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState({
    professionalType: '',
    madhhab: '',
    serviceType: '',
    language: '',
    location: '',
    isHafiz: false,
    hasIjazah: false
  })

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchQuery, filters, profiles])

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        const professionals = data.filter((p: Profile) => p.user.userType === 'PROFESSIONAL')
        setProfiles(professionals)
        setFilteredProfiles(professionals)
      }
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...profiles]

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(profile => 
        profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.seminary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply filters
    if (filters.professionalType) {
      filtered = filtered.filter(p => p.professionalType === filters.professionalType)
    }
    
    if (filters.madhhab) {
      filtered = filtered.filter(p => p.madhhab === filters.madhhab)
    }
    
    if (filters.serviceType) {
      filtered = filtered.filter(p => p.specialties.includes(filters.serviceType))
    }
    
    if (filters.language) {
      filtered = filtered.filter(p => p.languages.includes(filters.language))
    }
    
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location?.toLowerCase().includes(filters.location.toLowerCase())
      )
    }
    
    if (filters.isHafiz) {
      filtered = filtered.filter(p => p.isHafiz)
    }
    
    if (filters.hasIjazah) {
      filtered = filtered.filter(p => p.hasIjazah)
    }

    setFilteredProfiles(filtered)
  }

  const clearFilters = () => {
    setFilters({
      professionalType: '',
      madhhab: '',
      serviceType: '',
      language: '',
      location: '',
      isHafiz: false,
      hasIjazah: false
    })
    setSearchQuery('')
  }

  const handleProfileClick = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Search Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for sheikhs, imams, scholars..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
              >
                <Filter className="h-5 w-5" />
                Filters
                {Object.values(filters).filter(v => v).length > 0 && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {Object.values(filters).filter(v => v).length}
                  </span>
                )}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Type
                    </label>
                    <select
                      value={filters.professionalType}
                      onChange={(e) => setFilters({ ...filters, professionalType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">All Types</option>
                      {Object.entries(PROFESSIONAL_TYPES).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type
                    </label>
                    <select
                      value={filters.serviceType}
                      onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">All Services</option>
                      {Object.entries(SERVICE_TYPES).map(([key, value]) => (
                        <option key={key} value={value}>{value.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={filters.language}
                      onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">All Languages</option>
                      {LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Madhhab
                    </label>
                    <select
                      value={filters.madhhab}
                      onChange={(e) => setFilters({ ...filters, madhhab: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">All Madhhabs</option>
                      {Object.entries(MADHHABS).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      placeholder="City or State"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-end gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.isHafiz}
                        onChange={(e) => setFilters({ ...filters, isHafiz: e.target.checked })}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Hafiz Only</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.hasIjazah}
                        onChange={(e) => setFilters({ ...filters, hasIjazah: e.target.checked })}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Has Ijazah</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Found {filteredProfiles.length} {filteredProfiles.length === 1 ? 'professional' : 'professionals'}
          </div>

          {/* Search Results */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleProfileClick(profile.user.id)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div className="p-6">
                    {/* Profile Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-600 font-semibold text-lg">
                            {profile.name?.[0] || '?'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                          {profile.professionalType && (
                            <span className="text-sm text-emerald-600">{profile.professionalType}</span>
                          )}
                        </div>
                      </div>
                      {profile.credentials.length > 0 && (
                        <CheckCircle className="h-5 w-5 text-blue-500" title="Verified Credentials" />
                      )}
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{profile.bio}</p>
                    )}

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      {profile.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      
                      {profile.seminary && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Book className="h-4 w-4" />
                          <span>{profile.seminary}</span>
                        </div>
                      )}

                      {profile.yearsExperience && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="h-4 w-4" />
                          <span>{profile.yearsExperience} years experience</span>
                        </div>
                      )}

                      {profile.languages.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Languages className="h-4 w-4" />
                          <span>{profile.languages.slice(0, 3).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.isHafiz && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                          Hafiz
                        </span>
                      )}
                      {profile.hasIjazah && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          Ijazah
                        </span>
                      )}
                      {profile.madhhab && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {profile.madhhab}
                        </span>
                      )}
                    </div>

                    {/* Specialties */}
                    {profile.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {profile.specialties.slice(0, 3).map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {specialty.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {profile.specialties.length > 3 && (
                          <span className="px-2 py-1 text-gray-500 text-xs">
                            +{profile.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    {profile.endorsements.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-600">
                          {profile.endorsements.length} endorsements
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProfiles.length === 0 && !loading && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
