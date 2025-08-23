import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../contexts/AuthContext'
import Feed from '../app/feed/page'

// Mock the API calls
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>
}

const mockPosts = [
  {
    id: '1',
    content: 'Looking for Jummah Khateeb this Friday',
    postType: 'Opportunity',
    serviceType: 'KHUTBAH',
    location: 'Manhattan, NY',
    date: '2024-01-05T00:00:00.000Z',
    compensation: '$200',
    requirements: 'Hafiz, English/Arabic speaker',
    likes: 15,
    views: 230,
    createdAt: '2024-01-01T00:00:00.000Z',
    user: {
      id: '1',
      email: 'masjid@example.com',
      userType: 'ORGANIZATION',
      profile: {
        name: 'Masjid Al-Taqwa',
        profileImage: null,
        professionalType: null,
        location: 'Manhattan, NY'
      }
    }
  },
  {
    id: '2',
    content: 'Friday Reminder: "The best of you are those who are best to their families"',
    postType: 'Reminder',
    likes: 45,
    views: 520,
    createdAt: '2024-01-01T00:00:00.000Z',
    user: {
      id: '2',
      email: 'sheikh@example.com',
      userType: 'PROFESSIONAL',
      profile: {
        name: 'Sheikh Ahmad Hassan',
        profileImage: null,
        professionalType: 'SHEIKH',
        location: 'New York, NY'
      }
    }
  }
]

describe('Feed System', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
  })

  describe('Feed Display', () => {
    it('should display posts from the feed', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Looking for Jummah Khateeb this Friday')).toBeInTheDocument()
        expect(screen.getByText('Friday Reminder: "The best of you are those who are best to their families"')).toBeInTheDocument()
      })
    })

    it('should show loading state while fetching posts', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<Feed />, { wrapper: TestWrapper })

      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should handle empty feed', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('No posts found')).toBeInTheDocument()
      })
    })

    it('should display post metadata correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPosts[0]]
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Masjid Al-Taqwa')).toBeInTheDocument()
        expect(screen.getByText('Manhattan, NY')).toBeInTheDocument()
        expect(screen.getByText('15')).toBeInTheDocument() // likes
        expect(screen.getByText('230 views')).toBeInTheDocument()
      })
    })
  })

  describe('Post Creation', () => {
    it('should allow creating a new post', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts
      } as Response)

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '3',
          content: 'New test post',
          postType: 'Reminder',
          user: {
            id: '1',
            profile: { name: 'Test User' }
          }
        })
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      // Click create post button
      await user.click(screen.getByText('Create Post'))

      // Fill in post form
      await user.type(screen.getByLabelText('Content'), 'New test post')
      
      // Submit post
      await user.click(screen.getByText('Post'))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer null'
          },
          body: JSON.stringify({
            content: 'New test post',
            postType: 'Reminder',
            serviceType: '',
            location: '',
            date: null,
            compensation: '',
            requirements: ''
          })
        })
      })
    })

    it('should handle different post types', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Create Post'))

      // Test opportunity post
      await user.selectOptions(screen.getByDisplayValue('Islamic Reminder'), 'Job Opportunity')
      
      expect(screen.getByLabelText('Service Type')).toBeInTheDocument()
      expect(screen.getByLabelText('Location')).toBeInTheDocument()
      expect(screen.getByLabelText('Date')).toBeInTheDocument()
      expect(screen.getByLabelText('Compensation')).toBeInTheDocument()
      expect(screen.getByLabelText('Requirements')).toBeInTheDocument()

      // Test request post
      await user.selectOptions(screen.getByDisplayValue('Job Opportunity'), 'Service Request')
      
      expect(screen.getByLabelText('Service Type')).toBeInTheDocument()
      expect(screen.getByLabelText('Location')).toBeInTheDocument()
    })

    it('should validate required fields when creating post', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Create Post'))

      // Try to submit without content
      const submitButton = screen.getByText('Post')
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Post Interactions', () => {
    it('should display post actions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPosts[0]]
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('15')).toBeInTheDocument() // likes
        expect(screen.getByText('Comment')).toBeInTheDocument()
        expect(screen.getByText('Send Proposal')).toBeInTheDocument()
      })
    })

    it('should show post type badges', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Opportunity')).toBeInTheDocument()
        expect(screen.getByText('Reminder')).toBeInTheDocument()
      })
    })

    it('should display opportunity details correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPosts[0]]
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Service: KHUTBAH')).toBeInTheDocument()
        expect(screen.getByText('Manhattan, NY')).toBeInTheDocument()
        expect(screen.getByText('$200')).toBeInTheDocument()
        expect(screen.getByText('Requirements: Hafiz, English/Arabic speaker')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors when fetching posts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to fetch posts' })
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Error loading posts')).toBeInTheDocument()
      })
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(<Feed />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Error loading posts')).toBeInTheDocument()
      })
    })

    it('should handle post creation errors', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts
      } as Response)

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to create post' })
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Create Post'))
      await user.type(screen.getByLabelText('Content'), 'Test post')
      await user.click(screen.getByText('Post'))

      await waitFor(() => {
        expect(screen.getByText('Failed to create post')).toBeInTheDocument()
      })
    })
  })

  describe('Post Types', () => {
    it('should display different post types with appropriate styling', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts
      } as Response)

      render(<Feed />, { wrapper: TestWrapper })

      await waitFor(() => {
        // Opportunity post should have blue styling
        const opportunityBadge = screen.getByText('Opportunity')
        expect(opportunityBadge).toHaveClass('bg-blue-100', 'text-blue-700')

        // Reminder post should have emerald styling
        const reminderBadge = screen.getByText('Reminder')
        expect(reminderBadge).toHaveClass('bg-emerald-100', 'text-emerald-700')
      })
    })
  })
})
