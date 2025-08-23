import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '@/contexts/AuthContext'
import SearchPage from '@/app/search/page'

// Mock the API calls
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>
}

const mockProfiles = [
  {
    id: '1',
    name: 'Sheikh Ahmad Hassan',
    bio: 'Islamic scholar with 15+ years of experience',
    location: 'New York, NY',
    professionalType: 'SHEIKH',
    madhhab: 'HANAFI',
    languages: ['Arabic', 'English', 'Urdu'],
    specialties: ['NIKAH', 'KHUTBAH', 'COUNSELING'],
    isHafiz: true,
    hasIjazah: true,
    seminary: 'Al-Azhar University',
    yearsExperience: 15,
    user: {
      id: '1',
      userType: 'PROFESSIONAL'
    },
    credentials: [
      {
        id: '1',
        title: 'Bachelor of Islamic Studies',
        institution: 'Al-Azhar University',
        year: '2008',
        isVerified: true
      }
    ],
    endorsements: [
      {
        id: '1',
        endorserName: 'Dr. Abdullah Rahman',
        content: 'Excellent scholar and community leader',
        qualities: ['Clear Communication', 'Knowledgeable']
      }
    ]
  },
  {
    id: '2',
    name: 'Mufti Niaz Ahmed',
    bio: 'Certified Mufti with expertise in Islamic finance',
    location: 'New Jersey',
    professionalType: 'MUFTI',
    madhhab: 'SHAFII',
    languages: ['Arabic', 'English', 'Bengali'],
    specialties: ['FIQH', 'COUNSELING'],
    isHafiz: true,
    hasIjazah: true,
    seminary: 'Darul Uloom Karachi',
    yearsExperience: 12,
    user: {
      id: '2',
      userType: 'PROFESSIONAL'
    },
    credentials: [],
    endorsements: []
  }
]

describe('Search System', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
  })

  describe('Search Display', () => {
    it('should display search results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfiles
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Sheikh Ahmad Hassan')).toBeInTheDocument()
        expect(screen.getByText('Mufti Niaz Ahmed')).toBeInTheDocument()
        expect(screen.getByText('Found 2 professionals')).toBeInTheDocument()
      })
    })

    it('should show loading state while searching', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<SearchPage />, { wrapper: TestWrapper })

      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should handle empty search results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument()
        expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument()
      })
    })
  })

  describe('Search Functionality', () => {
    it('should allow searching by name', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      const searchInput = screen.getByPlaceholder('Search for sheikhs, imams, scholars...')
      await user.type(searchInput, 'Ahmad')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/search?q=Ahmad')
        )
      })
    })

    it('should allow searching by location', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      const searchInput = screen.getByPlaceholder('Search for sheikhs, imams, scholars...')
      await user.type(searchInput, 'New York')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/search?q=New York')
        )
      })
    })
  })

  describe('Filter System', () => {
    it('should allow filtering by professional type', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      // Open filters
      await user.click(screen.getByText('Filters'))

      // Select professional type
      await user.selectOptions(screen.getByDisplayValue('All Types'), 'SHEIKH')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/search?professionalType=SHEIKH')
        )
      })
    })

    it('should allow filtering by service type', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Filters'))
      await user.selectOptions(screen.getByDisplayValue('All Services'), 'NIKAH')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/search?serviceType=NIKAH')
        )
      })
    })

    it('should allow filtering by language', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Filters'))
      await user.selectOptions(screen.getByDisplayValue('All Languages'), 'Arabic')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/search?language=Arabic')
        )
      })
    })

    it('should allow filtering by madhhab', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Filters'))
      await user.selectOptions(screen.getByDisplayValue('All Madhhabs'), 'HANAFI')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/search?madhhab=HANAFI')
        )
      })
    })

    it('should allow filtering by location', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Filters'))
      await user.type(screen.getByPlaceholder('City or State'), 'New York')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/search?location=New York')
        )
      })
    })

    it('should allow filtering by Hafiz status', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Filters'))
      await user.click(screen.getByLabelText('Hafiz Only'))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/search')
        )
      })
    })

    it('should allow filtering by Ijazah status', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Filters'))
      await user.click(screen.getByLabelText('Has Ijazah'))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/search')
        )
      })
    })
  })

  describe('Profile Cards', () => {
    it('should display profile information correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Sheikh Ahmad Hassan')).toBeInTheDocument()
        expect(screen.getByText('SHEIKH')).toBeInTheDocument()
        expect(screen.getByText('New York, NY')).toBeInTheDocument()
        expect(screen.getByText('Al-Azhar University')).toBeInTheDocument()
        expect(screen.getByText('15 years')).toBeInTheDocument()
        expect(screen.getByText('Arabic, English, Urdu')).toBeInTheDocument()
      })
    })

    it('should display badges correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Hafiz')).toBeInTheDocument()
        expect(screen.getByText('Ijazah')).toBeInTheDocument()
        expect(screen.getByText('HANAFI')).toBeInTheDocument()
      })
    })

    it('should display specialties correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('NIKAH')).toBeInTheDocument()
        expect(screen.getByText('KHUTBAH')).toBeInTheDocument()
        expect(screen.getByText('COUNSELING')).toBeInTheDocument()
      })
    })

    it('should show verification badge for verified credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByTitle('Verified Credentials')).toBeInTheDocument()
      })
    })

    it('should display endorsement count', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProfiles[0]]
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('1 endorsements')).toBeInTheDocument()
      })
    })
  })

  describe('Filter Management', () => {
    it('should show filter count when filters are applied', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfiles
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Filters'))
      await user.selectOptions(screen.getByDisplayValue('All Types'), 'SHEIKH')

      // Should show filter count
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should allow clearing all filters', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfiles
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Filters'))
      await user.click(screen.getByText('Clear all filters'))

      // Should reset search
      expect(screen.getByPlaceholder('Search for sheikhs, imams, scholars...')).toHaveValue('')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Search failed' })
      } as Response)

      render(<SearchPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Error loading search results')).toBeInTheDocument()
      })
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(<SearchPage />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Error loading search results')).toBeInTheDocument()
      })
    })
  })
})
