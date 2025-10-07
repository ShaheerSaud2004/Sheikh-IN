'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { 
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Eye,
  MessageSquare,
  FileText,
  Clock,
  Award
} from 'lucide-react'

interface AnalyticsData {
  summary: {
    totalBookings: number
    completedBookings: number
    totalRevenue: number
    totalProfileViews: number
    totalContentViews: number
    totalContentLikes: number
    sentProposals: number
    receivedProposals: number
    acceptedProposals: number
    sentMessages: number
    receivedMessages: number
  }
  trends: {
    monthlyData: Array<{
      date: string
      bookings: number
      revenue: number
      profileViews: number
    }>
    topContent: Array<{
      id: string
      title: string
      views: number
      likes: number
      category: string
    }>
    serviceBreakdown: Record<string, number>
    contentBreakdown: Record<string, number>
  }
}

export default function AnalyticsPage() {
  const { user, token } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    fetchAnalytics()
  }, [period, token])

  const fetchAnalytics = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?period=${period}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string
    value: string | number
    icon: any
    color: string
    subtitle?: string
  }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-emerald-600" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Track your performance and engagement metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={analytics.summary.totalBookings}
            icon={Calendar}
            color="bg-blue-500"
            subtitle={`${analytics.summary.completedBookings} completed`}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(analytics.summary.totalRevenue)}
            icon={DollarSign}
            color="bg-green-500"
          />
          <StatCard
            title="Profile Views"
            value={analytics.summary.totalProfileViews}
            icon={Eye}
            color="bg-purple-500"
          />
          <StatCard
            title="Content Views"
            value={analytics.summary.totalContentViews}
            icon={FileText}
            color="bg-orange-500"
          />
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Messages Sent"
            value={analytics.summary.sentMessages}
            icon={MessageSquare}
            color="bg-indigo-500"
          />
          <StatCard
            title="Proposals Sent"
            value={analytics.summary.sentProposals}
            icon={TrendingUp}
            color="bg-teal-500"
          />
          <StatCard
            title="Proposals Received"
            value={analytics.summary.receivedProposals}
            icon={Users}
            color="bg-pink-500"
          />
          <StatCard
            title="Content Likes"
            value={analytics.summary.totalContentLikes}
            icon={Award}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Activity Trends</h3>
            <div className="space-y-4">
              {analytics.trends.monthlyData.slice(-7).map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {formatDate(day.date)}
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{day.bookings} bookings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{formatCurrency(day.revenue)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">{day.profileViews} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Content */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
            <div className="space-y-3">
              {analytics.trends.topContent.map((content, index) => (
                <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{content.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{content.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{content.views} views</p>
                    <p className="text-xs text-gray-500">{content.likes} likes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Service Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Service Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(analytics.trends.serviceBreakdown).map(([service, count]) => (
                <div key={service} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{service.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{ width: `${(count / analytics.summary.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Category Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Content Categories</h3>
            <div className="space-y-3">
              {Object.entries(analytics.trends.contentBreakdown).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{category.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(count / Object.values(analytics.trends.contentBreakdown).reduce((a, b) => a + b, 0)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {analytics.summary.totalBookings > 0 
                  ? Math.round((analytics.summary.completedBookings / analytics.summary.totalBookings) * 100)
                  : 0}%
              </div>
              <p className="text-sm text-gray-600">Booking Completion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.summary.receivedProposals > 0
                  ? Math.round((analytics.summary.acceptedProposals / analytics.summary.receivedProposals) * 100)
                  : 0}%
              </div>
              <p className="text-sm text-gray-600">Proposal Acceptance Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.summary.totalContentViews > 0
                  ? Math.round((analytics.summary.totalContentLikes / analytics.summary.totalContentViews) * 100)
                  : 0}%
              </div>
              <p className="text-sm text-gray-600">Content Engagement Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


