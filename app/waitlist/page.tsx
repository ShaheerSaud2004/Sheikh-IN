'use client'

import { useState } from 'react'
import { 
  Building2, 
  Mail, 
  Users, 
  Clock, 
  CheckCircle, 
  Star,
  Heart,
  Globe,
  MessageSquare,
  Send,
  Calendar
} from 'lucide-react'

interface WaitlistForm {
  name: string
  email: string
  phone: string
  location: string
  interest: string
  message: string
}

export default function WaitlistPage() {
  const [formData, setFormData] = useState<WaitlistForm>({
    name: '',
    email: '',
    phone: '',
    location: '',
    interest: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to the Waitlist! 🎉
          </h2>
          
          <p className="text-gray-600 mb-6">
            Thank you for joining Sheikh-Din! We've sent you a confirmation email. 
            You'll be notified as soon as we launch and you can start connecting with Islamic scholars.
          </p>
          
          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-emerald-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Check your email for confirmation</li>
              <li>• We'll notify you when we launch</li>
              <li>• Get early access to premium features</li>
            </ul>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>You're now on the waitlist!</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-800">Sheikh-Din</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>Join the waitlist</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
            <Clock className="w-4 h-4 mr-2" />
            Coming Soon - Join the Waitlist
          </div>
          
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              <span className="text-emerald-600">Sheikh</span>-Din
            </h1>
            
            <p className="text-2xl text-emerald-600 mb-6 max-w-3xl mx-auto font-semibold">
              LinkedIn for Sheikhs
            </p>
            
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto font-medium">
              The Professional Network for Islamic Scholars & the Muslim Community
            </p>
            
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Connect with qualified sheikhs, imams, and Islamic educators for nikah ceremonies, 
              khutbahs, teaching, and spiritual guidance. Build meaningful connections in the Muslim community.
            </p>

          {/* Why Sheikh-Din Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why <span className="text-emerald-600">Sheikh-Din</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're solving a real problem in the Muslim community. Finding qualified Islamic scholars 
                for important life events and spiritual guidance shouldn't be difficult.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 font-bold text-sm">!</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">The Problem</h3>
                    <p className="text-gray-600 text-sm">
                      Muslims struggle to find qualified scholars for nikah ceremonies, Friday khutbahs, 
                      and Islamic counseling. Many rely on word-of-mouth or settle for less qualified individuals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-yellow-600 font-bold text-sm">?</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Current Challenges</h3>
                    <p className="text-gray-600 text-sm">
                      No centralized platform to verify credentials, check availability, 
                      or read reviews from community members who have used their services.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Our Solution</h3>
                    <p className="text-gray-600 text-sm">
                      A professional networking platform where verified Islamic scholars can showcase 
                      their credentials and community members can easily find and book their services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Trust & Quality</h3>
                    <p className="text-gray-600 text-sm">
                      Every scholar is verified with proper credentials, ijazahs, and community endorsements. 
                      Read reviews from real community members before booking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Find Qualified Scholars</h3>
              <p className="text-gray-600 text-center">Discover verified Islamic professionals with proper credentials, ijazahs, and community endorsements in your area</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Easy Booking</h3>
              <p className="text-gray-600 text-center">Schedule nikah ceremonies, Friday khutbahs, Islamic counseling, and Quran lessons with just a few clicks</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Build Community</h3>
              <p className="text-gray-600 text-center">Connect with like-minded Muslims, share Islamic knowledge, and strengthen community bonds</p>
            </div>
          </div>

          {/* Community Section */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 mb-12 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
              <p className="text-xl text-emerald-100 mb-6 max-w-2xl mx-auto">
                Be part of the first generation of Muslims connecting with qualified Islamic scholars through technology
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-emerald-100">
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verified Scholars
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Secure Platform
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  100% Halal
                </span>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-12 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              What People Are Saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-emerald-600 font-bold">D</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dawud R.</h4>
                    <p className="text-sm text-gray-500">Community Member</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                &quot;Finally! A platform where I can find qualified sheikhs for our community events. 
                No more asking around or settling for less qualified individuals.&quot;
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ashiyam A.</h4>
                    <p className="text-sm text-gray-500">Board Member, Darul Islah</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  &quot;Sheikh-Din is exactly what our community needs. Having verified credentials and 
                  reviews will help us make better decisions for our Islamic programs at Darul Islah.&quot;
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-bold">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Saud Asif</h4>
                    <p className="text-sm text-gray-500">ICEB Shura Member</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  &quot;As a member of the Islamic Center of East Bay Shura, I believe this platform 
                  will greatly benefit our community by connecting qualified scholars with those in need of guidance.&quot;
                </p>
              </div>
            </div>
          </div>

        {/* Waitlist Form */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Join the Waitlist
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Be the first to know when we launch!
              </p>
              <p className="text-sm text-gray-500">
                Get early access and exclusive updates about Sheikh-Din
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
                  What are you most interested in?
                </label>
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select an option</option>
                  <option value="nikah">Nikah Ceremonies</option>
                  <option value="khutbah">Friday Khutbah</option>
                  <option value="teaching">Islamic Teaching</option>
                  <option value="counseling">Islamic Counseling</option>
                  <option value="quran">Quran Learning</option>
                  <option value="community">Community Events</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us more (optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="What would you like to see on Sheikh-Din? Any specific needs or suggestions?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Joining Waitlist...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>Join the Waitlist Now</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                We respect your privacy and will never share your information.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="max-w-7xl mx-auto px-6 mt-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Islamic Community Connections?
            </h2>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of Muslims who are already waiting for Sheikh-Din. 
              Be part of the future of Islamic community networking.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                Free to join
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                Early access
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                Verified scholars
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                100% Halal
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto px-6 text-center mt-16 pb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold text-gray-800">Sheikh-Din</span>
          </div>
          <p className="text-gray-500 mb-4">
            Connecting the Muslim community with qualified Islamic scholars
          </p>
          <p className="text-sm text-gray-400">
            © 2024 Sheikh-Din. All rights reserved.
          </p>
        </div>
      </div>
    </div>
    </div>
  )
}
