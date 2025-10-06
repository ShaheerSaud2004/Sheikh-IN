'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Building2, 
  Users, 
  Calendar, 
  BookOpen, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

function HomeContent() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'SEEKER' as 'PROFESSIONAL' | 'SEEKER' | 'ORGANIZATION'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasAccess, setHasAccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { fetchUser } = useAuth()

  useEffect(() => {
    // Check if user has access via special URL parameter
    const accessKey = searchParams.get('access')
    if (accessKey === 'websitenowhaha') {
      setHasAccess(true)
    } else {
      // Redirect to waitlist if no access
      router.push('/waitlist')
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        // Handle sign up
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const data = await response.json()
          localStorage.setItem('token', data.token)
          router.push('/onboarding')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Sign up failed')
        }
      } else {
        // Handle sign in
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          localStorage.setItem('token', data.token)
          // Update auth context with the user data
          await fetchUser(data.token)
          router.push('/feed')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Sign in failed')
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Don't render the page if user doesn't have access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-800">Sheikh-Din</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              LinkedIn for <span className="text-emerald-600">Sheikhs</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with qualified Islamic scholars for nikah ceremonies, khutbahs, 
              teaching, and spiritual guidance. Build your professional network in the Muslim community.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-emerald-600" />
                <span className="text-gray-700">Find Qualified Scholars</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-emerald-600" />
                <span className="text-gray-700">Book Services</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-emerald-600" />
                <span className="text-gray-700">Share Knowledge</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-6 w-6 text-emerald-600" />
                <span className="text-gray-700">Build Reputation</span>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/50 backdrop-blur rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What you can do:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Find scholars for nikah ceremonies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Book Friday khutbah speakers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Get Islamic counseling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Learn Quran and Islamic studies</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Join Sheikh-Din' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {isSignUp ? 'Create your account to get started' : 'Sign in to continue'}
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !isSignUp 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isSignUp 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter your password"
                />
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                    I am a:
                  </label>
                  <select
                    id="userType"
                    value={formData.userType}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="SEEKER">Community Member</option>
                    <option value="PROFESSIONAL">Islamic Professional (Sheikh, Imam, Qari)</option>
                    <option value="ORGANIZATION">Organization (Masjid, School, Center)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !formData.email || !formData.password || (isSignUp && !formData.name)}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Try demo accounts:</p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Sheikh:</strong> sheikh.ahmad@example.com / password123
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Individual:</strong> ali.hassan@example.com / password123
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Masjid:</strong> masjid.taqwa@example.com / password123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}