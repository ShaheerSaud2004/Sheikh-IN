'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Building2, Users, Calendar, BookOpen, Star } from 'lucide-react'

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('SEEKER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, userType)
      } else {
        await signIn(email, password)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
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
              <h3 className="font-semibold text-gray-800 mb-3">For Islamic Professionals:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Create professional profiles with credentials</li>
                <li>✓ Showcase khutbahs, lectures, and expertise</li>
                <li>✓ Connect with organizations and individuals</li>
              </ul>
              
              <h3 className="font-semibold text-gray-800 mt-4 mb-3">For Communities:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Find sheikhs for events and programs</li>
                <li>✓ Post opportunities and requests</li>
                <li>✓ Build trusted connections</li>
              </ul>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                    I am a...
                  </label>
                  <select
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                  >
                    <option value="PROFESSIONAL">Islamic Professional (Sheikh/Imam/Scholar)</option>
                    <option value="SEEKER">Individual Seeking Services</option>
                    <option value="ORGANIZATION">Organization/Masjid</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Demo Accounts (Password: password123):</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Qari:</span>
                  <span className="font-mono text-gray-700">qari.yusuf@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mufti:</span>
                  <span className="font-mono text-gray-700">sheikh.niaz@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Imam:</span>
                  <span className="font-mono text-gray-700">imam.khalid@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Scholar:</span>
                  <span className="font-mono text-gray-700">scholar.malik@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Seeker:</span>
                  <span className="font-mono text-gray-700">user.ahmed@example.com</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                All accounts use: <span className="font-mono">password123</span>
              </p>
              <div className="mt-3 p-2 bg-emerald-50 rounded text-xs text-emerald-700">
                <strong>Available Professional Types:</strong> QARI, SHEIKH, IMAM, SCHOLAR, MUFTI, KHATEEB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}