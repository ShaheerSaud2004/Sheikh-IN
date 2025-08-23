import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get proposals where user is either sender or receiver
    const proposals = await prisma.proposal.findMany({
      where: {
        OR: [
          { fromUserId: user.id },
          { toUserId: user.id }
        ]
      },
      include: {
        fromUser: {
          include: {
            profile: true
          }
        },
        toUser: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(proposals)
  } catch (error) {
    console.error('Proposals fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { toUserId, serviceType, eventDate, location, description, budget } = body

    const proposal = await prisma.proposal.create({
      data: {
        fromUserId: user.id,
        toUserId,
        serviceType,
        eventDate: new Date(eventDate),
        location,
        description,
        budget
      },
      include: {
        fromUser: {
          include: {
            profile: true
          }
        },
        toUser: {
          include: {
            profile: true
          }
        }
      }
    })

    return NextResponse.json(proposal)
  } catch (error) {
    console.error('Proposal creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { proposalId, status } = body

    // Verify user is the recipient of the proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId }
    })

    if (!proposal || proposal.toUserId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status },
      include: {
        fromUser: {
          include: {
            profile: true
          }
        },
        toUser: {
          include: {
            profile: true
          }
        }
      }
    })

    return NextResponse.json(updatedProposal)
  } catch (error) {
    console.error('Proposal update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
