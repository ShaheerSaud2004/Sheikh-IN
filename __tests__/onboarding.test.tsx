import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '@/contexts/AuthContext'
import Onboarding from '@/app/onboarding/page'

// Mock the API calls
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>
}

describe('Onboarding Flow', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
  })

  describe('Professional User Onboarding', () => {
    it('should complete full onboarding flow for professional user', async () => {
      const user = userEvent.setup()
      
      // Mock successful profile creation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '1',
          name: 'Sheikh Ahmad',
          bio: 'Test bio',
          location: 'New York, NY'
        })
      } as Response)

      render(<Onboarding />, { wrapper: TestWrapper })

      // Step 1: Basic Information
      await user.type(screen.getByLabelText(/Full Name/), 'Sheikh Ahmad Hassan')
      await user.type(screen.getByLabelText(/Bio/), 'Islamic scholar with 15+ years of experience')
      await user.type(screen.getByLabelText(/Location/), 'New York, NY')
      await user.type(screen.getByLabelText(/Phone/), '+1-555-0123')
      await user.type(screen.getByLabelText(/Website/), 'https://sheikhahmad.com')

      // Navigate to next step
      await user.click(screen.getByText('Next'))

      // Step 2: Professional Information
      await user.selectOptions(screen.getByLabelText(/Professional Type/), 'SHEIKH')
      await user.selectOptions(screen.getByLabelText(/Madhhab/), 'HANAFI')
      
      // Select languages
      await user.click(screen.getByText('Arabic'))
      await user.click(screen.getByText('English'))
      await user.click(screen.getByText('Urdu'))

      // Select specialties
      await user.click(screen.getByText('NIKAH'))
      await user.click(screen.getByText('KHUTBAH'))
      await user.click(screen.getByText('COUNSELING'))

      await user.type(screen.getByLabelText(/Travel Radius/), '50')
      await user.type(screen.getByLabelText(/Hourly Rate/), '200')

      // Navigate to next step
      await user.click(screen.getByText('Next'))

      // Step 3: Qualifications
      await user.click(screen.getByLabelText(/Hafiz/))
      await user.click(screen.getByLabelText(/Has Ijazah/))
      
      await user.type(screen.getByLabelText(/Ijazah Details/), 'Ijazah in Hadith from Al-Azhar University')
      await user.type(screen.getByLabelText(/Seminary/), 'Al-Azhar University, Cairo')
      await user.type(screen.getByLabelText(/Years of Experience/), '15')

      // Add certification
      await user.click(screen.getByText('Add Certification'))
      // Note: This would need a more complex test to handle the prompt

      // Complete profile
      await user.click(screen.getByText('Complete Profile'))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer undefined'
          },
          body: expect.stringContaining('Sheikh Ahmad Hassan')
        })
      })
    })

    it('should validate required fields in step 1', async () => {
      const user = userEvent.setup()
      
      render(<Onboarding />, { wrapper: TestWrapper })

      // Try to proceed without required fields
      await user.click(screen.getByText('Next'))

      // Should stay on step 1
      expect(screen.getByText('Basic Information')).toBeInTheDocument()
    })

    it('should handle step navigation correctly', async () => {
      const user = userEvent.setup()
      
      render(<Onboarding />, { wrapper: TestWrapper })

      // Fill required fields
      await user.type(screen.getByLabelText(/Full Name/), 'Test User')
      await user.type(screen.getByLabelText(/Location/), 'Test City')

      // Go to step 2
      await user.click(screen.getByText('Next'))
      expect(screen.getByText('Professional Information')).toBeInTheDocument()

      // Go back to step 1
      await user.click(screen.getByText('Previous'))
      expect(screen.getByText('Basic Information')).toBeInTheDocument()

      // Go forward again
      await user.click(screen.getByText('Next'))
      expect(screen.getByText('Professional Information')).toBeInTheDocument()
    })
  })

  describe('Seeker User Onboarding', () => {
    it('should complete simplified onboarding for seeker user', async () => {
      const user = userEvent.setup()
      
      // Mock successful profile creation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '1',
          name: 'Ali Hassan',
          location: 'Brooklyn, NY'
        })
      } as Response)

      render(<Onboarding />, { wrapper: TestWrapper })

      // Step 1: Basic Information (only step for seekers)
      await user.type(screen.getByLabelText(/Full Name/), 'Ali Hassan')
      await user.type(screen.getByLabelText(/Bio/), 'Looking for Islamic services')
      await user.type(screen.getByLabelText(/Location/), 'Brooklyn, NY')

      // Complete profile (should redirect to feed)
      await user.click(screen.getByText('Complete Profile'))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer undefined'
          },
          body: expect.stringContaining('Ali Hassan')
        })
      })
    })
  })

  describe('Organization User Onboarding', () => {
    it('should include organization-specific fields', async () => {
      const user = userEvent.setup()
      
      render(<Onboarding />, { wrapper: TestWrapper })

      // Fill basic info
      await user.type(screen.getByLabelText(/Full Name/), 'Masjid Al-Taqwa')
      await user.type(screen.getByLabelText(/Location/), 'Manhattan, NY')

      // Organization fields should be visible
      expect(screen.getByLabelText(/Organization Name/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Organization Type/)).toBeInTheDocument()

      await user.type(screen.getByLabelText(/Organization Name/), 'Masjid Al-Taqwa')
      await user.selectOptions(screen.getByLabelText(/Organization Type/), 'Masjid')

      // Complete profile
      await user.click(screen.getByText('Complete Profile'))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer undefined'
          },
          body: expect.stringContaining('Masjid Al-Taqwa')
        })
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle profile creation errors', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to create profile' })
      } as Response)

      render(<Onboarding />, { wrapper: TestWrapper })

      // Fill required fields
      await user.type(screen.getByLabelText(/Full Name/), 'Test User')
      await user.type(screen.getByLabelText(/Location/), 'Test City')

      // Complete profile
      await user.click(screen.getByText('Complete Profile'))

      await waitFor(() => {
        expect(screen.getByText('Failed to create profile. Please try again.')).toBeInTheDocument()
      })
    })

    it('should handle network errors', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(<Onboarding />, { wrapper: TestWrapper })

      // Fill required fields
      await user.type(screen.getByLabelText(/Full Name/), 'Test User')
      await user.type(screen.getByLabelText(/Location/), 'Test City')

      // Complete profile
      await user.click(screen.getByText('Complete Profile'))

      await waitFor(() => {
        expect(screen.getByText('Failed to create profile. Please try again.')).toBeInTheDocument()
      })
    })
  })

  describe('Progress Indicator', () => {
    it('should show correct progress for different user types', async () => {
      const user = userEvent.setup()
      
      render(<Onboarding />, { wrapper: TestWrapper })

      // Should show "Step 1 of 1" for seekers/organizations
      expect(screen.getByText('Step 1 of 1')).toBeInTheDocument()

      // Fill required fields and complete
      await user.type(screen.getByLabelText(/Full Name/), 'Test User')
      await user.type(screen.getByLabelText(/Location/), 'Test City')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1' })
      } as Response)

      await user.click(screen.getByText('Complete Profile'))
    })
  })
})
