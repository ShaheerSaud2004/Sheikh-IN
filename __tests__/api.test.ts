import { NextRequest } from 'next/server'
import { POST as signupHandler } from '../app/api/auth/signup/route'
import { POST as signinHandler } from '../app/api/auth/signin/route'
import { GET as meHandler } from '../app/api/auth/me/route'
import { POST as profileHandler, GET as profileGetHandler } from '../app/api/profile/route'
import { POST as postsHandler, GET as postsGetHandler } from '../app/api/posts/route'
import { GET as searchHandler } from '../app/api/search/route'
import { POST as proposalsHandler, GET as proposalsGetHandler, PATCH as proposalsPatchHandler } from '../app/api/proposals/route'

// Mock Prisma
jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    proposal: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

// Mock auth functions
jest.mock('../lib/auth', () => ({
  hashPassword: jest.fn(() => Promise.resolve('hashed-password')),
  verifyPassword: jest.fn(() => Promise.resolve(true)),
  generateToken: jest.fn(() => 'mock-token'),
  verifyToken: jest.fn(() => ({ userId: 'user-1' })),
  getUserFromToken: jest.fn(() => Promise.resolve({
    id: 'user-1',
    email: 'test@example.com',
    userType: 'PROFESSIONAL'
  })),
}))

const { prisma } = require('../lib/prisma')
const { hashPassword, verifyPassword, generateToken, verifyToken, getUserFromToken } = require('../lib/auth')

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication API', () => {
    describe('POST /api/auth/signup', () => {
      it('should create a new user successfully', async () => {
        const mockUser = {
          id: 'user-1',
          email: 'test@example.com',
          userType: 'PROFESSIONAL'
        }

        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
        ;(prisma.user.create as jest.Mock).mockResolvedValue(mockUser)
        ;(generateToken as jest.Mock).mockReturnValue('mock-token')

        const request = new NextRequest('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            userType: 'PROFESSIONAL'
          })
        })

        const response = await signupHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.user).toEqual(mockUser)
        expect(data.token).toBe('mock-token')
        expect(prisma.user.create).toHaveBeenCalledWith({
          data: {
            email: 'test@example.com',
            password: 'hashed-password',
            userType: 'PROFESSIONAL'
          }
        })
      })

      it('should return error for existing user', async () => {
        const existingUser = { id: 'user-1', email: 'test@example.com' }
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser)

        const request = new NextRequest('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            userType: 'PROFESSIONAL'
          })
        })

        const response = await signupHandler(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('User already exists')
      })

      it('should return error for missing fields', async () => {
        const request = new NextRequest('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com'
            // missing password and userType
          })
        })

        const response = await signupHandler(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Missing required fields')
      })
    })

    describe('POST /api/auth/signin', () => {
      it('should sign in user successfully', async () => {
        const mockUser = {
          id: 'user-1',
          email: 'test@example.com',
          password: 'hashed-password',
          userType: 'PROFESSIONAL',
          profile: null
        }

        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
        ;(verifyPassword as jest.Mock).mockResolvedValue(true)
        ;(generateToken as jest.Mock).mockReturnValue('mock-token')

        const request = new NextRequest('http://localhost:3000/api/auth/signin', {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        })

        const response = await signinHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.user.email).toBe('test@example.com')
        expect(data.token).toBe('mock-token')
      })

      it('should return error for invalid credentials', async () => {
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

        const request = new NextRequest('http://localhost:3000/api/auth/signin', {
          method: 'POST',
          body: JSON.stringify({
            email: 'wrong@example.com',
            password: 'wrongpassword'
          })
        })

        const response = await signinHandler(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe('Invalid credentials')
      })
    })

    describe('GET /api/auth/me', () => {
      it('should return user data for valid token', async () => {
        const mockUser = {
          id: 'user-1',
          email: 'test@example.com',
          userType: 'PROFESSIONAL',
          profile: null
        }

        ;(getUserFromToken as jest.Mock).mockResolvedValue(mockUser)

        const request = new NextRequest('http://localhost:3000/api/auth/me', {
          method: 'GET',
          headers: {
            'authorization': 'Bearer valid-token'
          }
        })

        const response = await meHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.user).toEqual(mockUser)
      })

      it('should return error for missing token', async () => {
        const request = new NextRequest('http://localhost:3000/api/auth/me', {
          method: 'GET'
        })

        const response = await meHandler(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe('No token provided')
      })
    })
  })

  describe('Profile API', () => {
    describe('POST /api/profile', () => {
      it('should create profile successfully', async () => {
        const mockProfile = {
          id: 'profile-1',
          name: 'Sheikh Ahmad',
          location: 'New York, NY'
        }

        ;(getUserFromToken as jest.Mock).mockResolvedValue({
          id: 'user-1',
          email: 'test@example.com'
        })
        ;(prisma.profile.findUnique as jest.Mock).mockResolvedValue(null)
        ;(prisma.profile.create as jest.Mock).mockResolvedValue(mockProfile)

        const request = new NextRequest('http://localhost:3000/api/profile', {
          method: 'POST',
          headers: {
            'authorization': 'Bearer valid-token',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            name: 'Sheikh Ahmad',
            location: 'New York, NY'
          })
        })

        const response = await profileHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockProfile)
      })
    })

    describe('GET /api/profile', () => {
      it('should return profiles list', async () => {
        const mockProfiles = [
          { id: 'profile-1', name: 'Sheikh Ahmad' },
          { id: 'profile-2', name: 'Mufti Niaz' }
        ]

        ;(prisma.profile.findMany as jest.Mock).mockResolvedValue(mockProfiles)

        const request = new NextRequest('http://localhost:3000/api/profile', {
          method: 'GET'
        })

        const response = await profileGetHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockProfiles)
      })
    })
  })

  describe('Posts API', () => {
    describe('GET /api/posts', () => {
      it('should return posts list', async () => {
        const mockPosts = [
          { id: 'post-1', content: 'Test post 1' },
          { id: 'post-2', content: 'Test post 2' }
        ]

        ;(prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts)

        const request = new NextRequest('http://localhost:3000/api/posts', {
          method: 'GET'
        })

        const response = await postsGetHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockPosts)
      })
    })

    describe('POST /api/posts', () => {
      it('should create post successfully', async () => {
        const mockPost = {
          id: 'post-1',
          content: 'Test post',
          userId: 'user-1'
        }

        ;(getUserFromToken as jest.Mock).mockResolvedValue({
          id: 'user-1',
          email: 'test@example.com'
        })
        ;(prisma.post.create as jest.Mock).mockResolvedValue(mockPost)

        const request = new NextRequest('http://localhost:3000/api/posts', {
          method: 'POST',
          headers: {
            'authorization': 'Bearer valid-token',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            content: 'Test post'
          })
        })

        const response = await postsHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockPost)
      })
    })
  })

  describe('Search API', () => {
    describe('GET /api/search', () => {
      it('should return search results', async () => {
        const mockProfiles = [
          { id: 'profile-1', name: 'Sheikh Ahmad' }
        ]

        ;(prisma.profile.findMany as jest.Mock).mockResolvedValue(mockProfiles)

        const request = new NextRequest('http://localhost:3000/api/search?q=ahmad', {
          method: 'GET'
        })

        const response = await searchHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockProfiles)
      })
    })
  })

  describe('Proposals API', () => {
    describe('GET /api/proposals', () => {
      it('should return user proposals', async () => {
        const mockProposals = [
          { id: 'proposal-1', serviceType: 'KHUTBAH' }
        ]

        ;(getUserFromToken as jest.Mock).mockResolvedValue({
          id: 'user-1',
          email: 'test@example.com'
        })
        ;(prisma.proposal.findMany as jest.Mock).mockResolvedValue(mockProposals)

        const request = new NextRequest('http://localhost:3000/api/proposals', {
          method: 'GET',
          headers: {
            'authorization': 'Bearer valid-token'
          }
        })

        const response = await proposalsGetHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockProposals)
      })
    })

    describe('POST /api/proposals', () => {
      it('should create proposal successfully', async () => {
        const mockProposal = {
          id: 'proposal-1',
          serviceType: 'KHUTBAH',
          fromUserId: 'user-1',
          toUserId: 'user-2'
        }

        ;(getUserFromToken as jest.Mock).mockResolvedValue({
          id: 'user-1',
          email: 'test@example.com'
        })
        ;(prisma.proposal.create as jest.Mock).mockResolvedValue(mockProposal)

        const request = new NextRequest('http://localhost:3000/api/proposals', {
          method: 'POST',
          headers: {
            'authorization': 'Bearer valid-token',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            toUserId: 'user-2',
            serviceType: 'KHUTBAH',
            eventDate: '2024-01-05',
            location: 'New York',
            description: 'Test proposal'
          })
        })

        const response = await proposalsHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockProposal)
      })
    })

    describe('PATCH /api/proposals', () => {
      it('should update proposal status successfully', async () => {
        const mockProposal = {
          id: 'proposal-1',
          status: 'accepted'
        }

        ;(getUserFromToken as jest.Mock).mockResolvedValue({
          id: 'user-1',
          email: 'test@example.com'
        })
        ;(prisma.proposal.findUnique as jest.Mock).mockResolvedValue({
          id: 'proposal-1',
          toUserId: 'user-1'
        })
        ;(prisma.proposal.update as jest.Mock).mockResolvedValue(mockProposal)

        const request = new NextRequest('http://localhost:3000/api/proposals', {
          method: 'PATCH',
          headers: {
            'authorization': 'Bearer valid-token',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            proposalId: 'proposal-1',
            status: 'accepted'
          })
        })

        const response = await proposalsPatchHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockProposal)
      })
    })
  })
})
