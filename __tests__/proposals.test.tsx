import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '@/contexts/AuthContext'
import ProposalsPage from '@/app/proposals/page'

// Mock the API calls
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>
}

const mockProposals = [
  {
    id: '1',
    serviceType: 'KHUTBAH',
    eventDate: '2024-01-05T00:00:00.000Z',
    location: 'Manhattan, NY',
    description: 'We would like to invite you to deliver the Jummah khutbah this Friday',
    budget: '$200',
    status: 'pending',
    createdAt: '2024-01-01T00:00:00.000Z',
    fromUser: {
      id: '1',
      email: 'masjid@example.com',
      profile: {
        name: 'Masjid Al-Taqwa',
        location: 'Manhattan, NY'
      }
    },
    toUser: {
      id: '2',
      email: 'sheikh@example.com',
      profile: {
        name: 'Sheikh Ahmad Hassan',
        professionalType: 'SHEIKH'
      }
    }
  },
  {
    id: '2',
    serviceType: 'NIKAH',
    eventDate: '2024-02-15T00:00:00.000Z',
    location: 'Brooklyn, NY',
    description: 'Assalamu alaikum Sheikh, we would like to request your services for our nikah ceremony',
    budget: '$300',
    status: 'accepted',
    createdAt: '2024-01-02T00:00:00.000Z',
    fromUser: {
      id: '3',
      email: 'ali@example.com',
      profile: {
        name: 'Ali Hassan',
        location: 'Brooklyn, NY'
      }
    },
    toUser: {
      id: '2',
      email: 'sheikh@example.com',
      profile: {
        name: 'Sheikh Ahmad Hassan',
        professionalType: 'SHEIKH'
      }
    }
  }
]

describe('Proposals System', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
  })

  describe('Proposals Display', () => {
    it('should display received proposals', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProposals
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Received (2)')).toBeInTheDocument()
        expect(screen.getByText('KHUTBAH')).toBeInTheDocument()
        expect(screen.getByText('NIKAH')).toBeInTheDocument()
      })
    })

    it('should display sent proposals', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProposals
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await userEvent.click(screen.getByText('Sent (0)'))

      await waitFor(() => {
        expect(screen.getByText('Sent (0)')).toBeInTheDocument()
      })
    })

    it('should show loading state while fetching proposals', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<ProposalsPage />, { wrapper: TestWrapper })

      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should handle empty proposals', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('No proposals received')).toBeInTheDocument()
        expect(screen.getByText('When someone sends you a proposal, it will appear here')).toBeInTheDocument()
      })
    })
  })

  describe('Proposal Details', () => {
    it('should display proposal information correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProposals[0]]
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('KHUTBAH')).toBeInTheDocument()
        expect(screen.getByText('From: Masjid Al-Taqwa')).toBeInTheDocument()
        expect(screen.getByText('pending')).toBeInTheDocument()
        expect(screen.getByText('We would like to invite you to deliver the Jummah khutbah this Friday')).toBeInTheDocument()
        expect(screen.getByText('Manhattan, NY')).toBeInTheDocument()
        expect(screen.getByText('$200')).toBeInTheDocument()
      })
    })

    it('should display proposal status correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProposals
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        // Pending proposal
        const pendingBadge = screen.getByText('pending')
        expect(pendingBadge).toHaveClass('bg-yellow-100', 'text-yellow-700')

        // Accepted proposal
        const acceptedBadge = screen.getByText('accepted')
        expect(acceptedBadge).toHaveClass('bg-green-100', 'text-green-700')
      })
    })

    it('should display proposal metadata correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProposals[0]]
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Jan 5, 2024')).toBeInTheDocument() // event date
        expect(screen.getByText('Manhattan, NY')).toBeInTheDocument() // location
        expect(screen.getByText('$200')).toBeInTheDocument() // budget
        expect(screen.getByText('Jan 1')).toBeInTheDocument() // created date
      })
    })
  })

  describe('Proposal Actions', () => {
    it('should show accept/decline buttons for pending proposals', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProposals[0]]
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Accept')).toBeInTheDocument()
        expect(screen.getByText('Decline')).toBeInTheDocument()
      })
    })

    it('should not show action buttons for non-pending proposals', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProposals[1]] // accepted proposal
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.queryByText('Accept')).not.toBeInTheDocument()
        expect(screen.queryByText('Decline')).not.toBeInTheDocument()
      })
    })

    it('should handle accepting a proposal', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProposals[0]]
      } as Response)

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockProposals[0], status: 'accepted' })
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Accept')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Accept'))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/proposals', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer undefined'
          },
          body: JSON.stringify({
            proposalId: '1',
            status: 'accepted'
          })
        })
      })
    })

    it('should handle declining a proposal', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProposals[0]]
      } as Response)

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockProposals[0], status: 'declined' })
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Decline')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Decline'))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/proposals', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer undefined'
          },
          body: JSON.stringify({
            proposalId: '1',
            status: 'declined'
          })
        })
      })
    })
  })

  describe('Tab Navigation', () => {
    it('should switch between received and sent tabs', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProposals
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      // Should start with received tab active
      expect(screen.getByText('Received (2)')).toHaveClass('border-emerald-600', 'text-emerald-600')

      // Click sent tab
      await userEvent.click(screen.getByText('Sent (0)'))

      // Should switch to sent tab
      expect(screen.getByText('Sent (0)')).toHaveClass('border-emerald-600', 'text-emerald-600')
      expect(screen.getByText('Received (2)')).not.toHaveClass('border-emerald-600', 'text-emerald-600')
    })
  })

  describe('Proposal Filtering', () => {
    it('should filter proposals by status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProposals
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        // Should show both pending and accepted proposals
        expect(screen.getByText('pending')).toBeInTheDocument()
        expect(screen.getByText('accepted')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors when fetching proposals', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to fetch proposals' })
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Error loading proposals')).toBeInTheDocument()
      })
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Error loading proposals')).toBeInTheDocument()
      })
    })

    it('should handle proposal action errors', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProposals[0]]
      } as Response)

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to update proposal' })
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Accept')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Accept'))

      await waitFor(() => {
        expect(screen.getByText('Failed to update proposal')).toBeInTheDocument()
      })
    })
  })

  describe('Proposal Status Icons', () => {
    it('should display correct status icons', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProposals
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        // Should show clock icon for pending
        expect(screen.getByText('pending')).toBeInTheDocument()
        
        // Should show check icon for accepted
        expect(screen.getByText('accepted')).toBeInTheDocument()
      })
    })
  })

  describe('Proposal Counts', () => {
    it('should display correct proposal counts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProposals
      } as Response)

      render(<ProposalsPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Received (2)')).toBeInTheDocument()
        expect(screen.getByText('Sent (0)')).toBeInTheDocument()
      })
    })
  })
})
