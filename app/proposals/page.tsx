'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { 
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Inbox
} from 'lucide-react'
import { format } from 'date-fns'

interface Proposal {
  id: string
  serviceType: string
  eventDate: string
  location: string
  description: string
  budget?: string
  status: string
  createdAt: string
  fromUser: {
    id: string
    email: string
    profile: {
      name: string
      location?: string
    }
  }
  toUser: {
    id: string
    email: string
    profile: {
      name: string
      professionalType?: string
    }
  }
}

export default function ProposalsPage() {
  const { user, token } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProposals(data)
      }
    } catch (error) {
      console.error('Error fetching proposals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProposalAction = async (proposalId: string, status: 'accepted' | 'declined') => {
    try {
      const response = await fetch('/api/proposals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ proposalId, status })
      })

      if (response.ok) {
        const updatedProposal = await response.json()
        setProposals(proposals.map(p => 
          p.id === proposalId ? updatedProposal : p
        ))
      }
    } catch (error) {
      console.error('Error updating proposal:', error)
    }
  }

  const receivedProposals = proposals.filter(p => p.toUser.id === user?.id)
  const sentProposals = proposals.filter(p => p.fromUser.id === user?.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'declined':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />
      case 'declined':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Proposals</h1>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('received')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition ${
                    activeTab === 'received'
                      ? 'border-b-2 border-emerald-600 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Inbox className="h-5 w-5" />
                    <span>Received ({receivedProposals.length})</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition ${
                    activeTab === 'sent'
                      ? 'border-b-2 border-emerald-600 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Send className="h-5 w-5" />
                    <span>Sent ({sentProposals.length})</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Proposals List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'received' ? (
                receivedProposals.length > 0 ? (
                  receivedProposals.map((proposal) => (
                    <div key={proposal.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {proposal.serviceType.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            From: {proposal.fromUser.profile.name}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
                          {getStatusIcon(proposal.status)}
                          {proposal.status}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{proposal.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(proposal.eventDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{proposal.location}</span>
                        </div>
                        {proposal.budget && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{proposal.budget}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(proposal.createdAt), 'MMM d')}</span>
                        </div>
                      </div>

                      {proposal.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleProposalAction(proposal.id, 'accepted')}
                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleProposalAction(proposal.id, 'declined')}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals received</h3>
                    <p className="text-gray-600">When someone sends you a proposal, it will appear here</p>
                  </div>
                )
              ) : (
                sentProposals.length > 0 ? (
                  sentProposals.map((proposal) => (
                    <div key={proposal.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {proposal.serviceType.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            To: {proposal.toUser.profile.name}
                            {proposal.toUser.profile.professionalType && (
                              <span className="text-gray-500"> • {proposal.toUser.profile.professionalType}</span>
                            )}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
                          {getStatusIcon(proposal.status)}
                          {proposal.status}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{proposal.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(proposal.eventDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{proposal.location}</span>
                        </div>
                        {proposal.budget && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{proposal.budget}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(proposal.createdAt), 'MMM d')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals sent</h3>
                    <p className="text-gray-600">Find professionals and send them proposals for your events</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
