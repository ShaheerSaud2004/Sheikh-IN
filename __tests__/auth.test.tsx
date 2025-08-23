import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import Home from '../app/page'

// Mock the API calls
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>
}

// Test component to access auth context
const TestComponent = () => {
  const { user, signIn, signUp, signOut } = useAuth()
  return (
    <div>
      <div data-testid="user-status">
        {user ? `Logged in as ${user.email}` : 'Not logged in'}
      </div>
      <button onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={() => signUp('test@example.com', 'password', 'PROFESSIONAL')}>
        Sign Up
      </button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}

describe('Authentication System', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
  })

  describe('Sign Up Flow', () => {
    it('should allow users to sign up with valid credentials', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: {
            id: '1',
            email: 'test@example.com',
            userType: 'PROFESSIONAL'
          },
          token: 'mock-token'
        })
      } as Response)

      render(<Home />, { wrapper: TestWrapper })

      // Click sign up
      const signUpButton = screen.getByText("Don't have an account? Sign Up")
      await user.click(signUpButton)

      // Fill in form
      await user.type(screen.getByLabelText('Email'), 'test@example.com')
      await user.type(screen.getByLabelText('Password'), 'password123')
      
      // Select user type
      const userTypeSelect = screen.getByLabelText('I am a...')
      await user.selectOptions(userTypeSelect, 'PROFESSIONAL')

      // Submit form
      const submitButton = screen.getByRole('button', { name: 'Create Account' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            userType: 'PROFESSIONAL'
          })
        })
      })
    })

    it('should show error for invalid sign up', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'User already exists' })
      } as Response)

      render(<Home />, { wrapper: TestWrapper })

      // Click sign up
      const signUpButton = screen.getByText("Don't have an account? Sign Up")
      await user.click(signUpButton)

      // Fill in form
      await user.type(screen.getByLabelText('Email'), 'existing@example.com')
      await user.type(screen.getByLabelText('Password'), 'password123')
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: 'Create Account' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('User already exists')).toBeInTheDocument()
      })
    })

    it('should validate required fields', async () => {
      const user = userEvent.setup()
      
      render(<Home />, { wrapper: TestWrapper })

      // Click sign up
      const signUpButton = screen.getByText("Don't have an account? Sign Up")
      await user.click(signUpButton)

      // Try to submit without filling fields
      const submitButton = screen.getByRole('button', { name: 'Create Account' })
      await user.click(submitButton)

      // Check that form validation prevents submission
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Sign In Flow', () => {
    it('should allow users to sign in with valid credentials', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: {
            id: '1',
            email: 'test@example.com',
            userType: 'PROFESSIONAL',
            profile: null
          },
          token: 'mock-token'
        })
      } as Response)

      render(<Home />, { wrapper: TestWrapper })

      // Fill in form
      await user.type(screen.getByLabelText('Email'), 'test@example.com')
      await user.type(screen.getByLabelText('Password'), 'password123')

      // Submit form
      const submitButton = screen.getByText('Sign In')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        })
      })
    })

    it('should show error for invalid credentials', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' })
      } as Response)

      render(<Home />, { wrapper: TestWrapper })

      // Fill in form
      await user.type(screen.getByLabelText('Email'), 'wrong@example.com')
      await user.type(screen.getByLabelText('Password'), 'wrongpassword')

      // Submit form
      const submitButton = screen.getByText('Sign In')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })
    })

    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(<Home />, { wrapper: TestWrapper })

      // Fill in form
      await user.type(screen.getByLabelText('Email'), 'test@example.com')
      await user.type(screen.getByLabelText('Password'), 'password123')

      // Submit form
      const submitButton = screen.getByText('Sign In')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })
  })

  describe('Auth Context', () => {
    it('should provide authentication state', () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in')
    })

    it('should handle sign out', async () => {
      const user = userEvent.setup()
      
      // Mock successful sign in first
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: '1', email: 'test@example.com', userType: 'PROFESSIONAL' },
          token: 'mock-token'
        })
      } as Response)

      render(<TestComponent />, { wrapper: TestWrapper })

      // Sign in
      await user.click(screen.getByText('Sign In'))
      
      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com')
      })

      // Sign out
      await user.click(screen.getByText('Sign Out'))
      
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in')
    })

    it('should persist token in localStorage', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: '1', email: 'test@example.com', userType: 'PROFESSIONAL' },
          token: 'mock-token'
        })
      } as Response)

      render(<TestComponent />, { wrapper: TestWrapper })

      await user.click(screen.getByText('Sign In'))

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token')
      })
    })
  })

  describe('Demo Accounts', () => {
    it('should display demo account information', () => {
      render(<Home />, { wrapper: TestWrapper })
      
      expect(screen.getByText('Demo Accounts:')).toBeInTheDocument()
      expect(screen.getByText(/sheikh\.ahmad@example\.com/)).toBeInTheDocument()
      expect(screen.getByText(/ali\.hassan@example\.com/)).toBeInTheDocument()
      expect(screen.getByText(/masjid\.taqwa@example\.com/)).toBeInTheDocument()
    })
  })
})
