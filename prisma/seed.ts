import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.endorsement.deleteMany()
  await prisma.message.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.post.deleteMany()
  await prisma.video.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.credential.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  // Create Islamic Professionals
  const professionals = [
    {
      email: 'sheikh.ahmad@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Sheikh Ahmad Hassan',
          bio: 'Islamic scholar with 15+ years of experience in teaching and community leadership. Specialized in Islamic jurisprudence and youth counseling.',
          location: 'New York, NY',
          phone: '+1 (555) 123-4567',
          website: 'https://sheikhahmad.com',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad',
          professionalType: 'SHEIKH',
          madhhab: 'HANAFI',
          languages: JSON.stringify(['Arabic', 'English', 'Urdu']),
          specialties: JSON.stringify(['NIKAH', 'COUNSELING', 'YOUTH_PROGRAM', 'FIQH']),
          travelRadius: 50,
          isAvailable: true,
          isHafiz: true,
          hasIjazah: true,
          ijazahDetails: 'Ijazah in Hadith from Al-Azhar University',
          seminary: 'Al-Azhar University, Cairo',
          yearsExperience: 15,
          certifications: JSON.stringify(['Islamic Studies Degree', 'Marriage Counseling Certificate']),
          credentials: {
            create: [
              {
                title: 'Bachelor of Islamic Studies',
                institution: 'Al-Azhar University',
                year: '2008',
                description: 'Specialized in Fiqh and Hadith sciences',
                isVerified: true
              },
              {
                title: 'Ijazah in Hadith',
                institution: 'Darul Uloom Deoband',
                year: '2010',
                description: 'Complete chain of narration',
                isVerified: true
              }
            ]
          },
          experiences: {
            create: [
              {
                title: 'Head Imam',
                organization: 'Islamic Center of New York',
                location: 'New York, NY',
                startDate: '2015',
                isCurrent: true,
                description: 'Leading prayers, delivering khutbahs, and providing counseling services'
              }
            ]
          },
          videos: {
            create: [
              {
                title: 'The Importance of Family in Islam',
                url: 'https://example.com/video1',
                description: 'Khutbah on family values',
                videoType: 'Khutbah',
                views: 1250
              }
            ]
          }
        }
      }
    },
    {
      email: 'mufti.niaz@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Mufti Niaz Ahmed',
          bio: 'Certified Mufti with expertise in Islamic finance and modern fatwa issuance. Fluent in multiple languages.',
          location: 'New Jersey',
          phone: '+1 (555) 234-5678',
          website: 'https://muftiniaz.org',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=niaz',
          professionalType: 'MUFTI',
          madhhab: 'SHAFII',
          languages: JSON.stringify(['Arabic', 'English', 'Bengali']),
          specialties: JSON.stringify(['FIQH', 'COUNSELING', 'NIKAH']),
          travelRadius: 75,
          isAvailable: true,
          isHafiz: true,
          hasIjazah: true,
          ijazahDetails: 'Ifta certification from Darul Ifta',
          seminary: 'Darul Uloom Karachi',
          yearsExperience: 12,
          certifications: JSON.stringify(['Mufti Certification', 'Islamic Finance Certificate'])
        }
      }
    },
    {
      email: 'qari.yusuf@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Qari Yusuf Ali',
          bio: 'Master Qari with ijazah in 10 Qiraat. Teaching Tajweed and Hifz to students of all ages.',
          location: 'Chicago, IL',
          phone: '+1 (555) 345-6789',
          website: 'https://qariyusuf.com',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yusuf',
          professionalType: 'QARI',
          madhhab: 'MALIKI',
          languages: JSON.stringify(['Arabic', 'English', 'Somali']),
          specialties: JSON.stringify(['TAJWEED', 'HIFZ', 'RAMADAN_PROGRAM']),
          travelRadius: 30,
          isAvailable: true,
          isHafiz: true,
          hasIjazah: true,
          ijazahDetails: 'Ijazah in 10 Qiraat',
          seminary: 'Institute of Islamic Education',
          yearsExperience: 8
        }
      }
    },
    {
      email: 'ustadha.fatima@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Ustadha Fatima Khan',
          bio: 'Female Islamic educator specializing in women\'s fiqh and youth education. Passionate about empowering Muslim women.',
          location: 'Houston, TX',
          phone: '+1 (555) 456-7890',
          website: 'https://ustadhafatima.com',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima',
          professionalType: 'SCHOLAR',
          madhhab: 'HANBALI',
          languages: JSON.stringify(['English', 'Urdu', 'Arabic']),
          specialties: JSON.stringify(['TEACHING', 'YOUTH_PROGRAM', 'COUNSELING']),
          travelRadius: 40,
          isAvailable: true,
          isHafiz: false,
          hasIjazah: true,
          ijazahDetails: 'Alimah certification',
          seminary: 'Zaynab Academy',
          yearsExperience: 10
        }
      }
    }
  ]

  // Create Seekers
  const seekers = [
    {
      email: 'ali.hassan@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'SEEKER',
      profile: {
        create: {
          name: 'Ali Hassan',
          bio: 'Community member looking for Islamic services',
          location: 'Brooklyn, NY',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali'
        }
      }
    },
    {
      email: 'sarah.ahmed@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'SEEKER',
      profile: {
        create: {
          name: 'Sarah Ahmed',
          bio: 'Looking for Quran teacher for my children',
          location: 'Queens, NY',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
        }
      }
    }
  ]

  // Create Organizations
  const organizations = [
    {
      email: 'masjid.taqwa@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'ORGANIZATION',
      profile: {
        create: {
          name: 'Masjid Al-Taqwa',
          bio: 'Community mosque serving the greater NYC area. Regular programs and events for all ages.',
          location: 'Manhattan, NY',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taqwa',
          organizationName: 'Masjid Al-Taqwa',
          organizationType: 'Masjid'
        }
      }
    },
    {
      email: 'islamic.center@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'ORGANIZATION',
      profile: {
        create: {
          name: 'Islamic Center of New Jersey',
          bio: 'Full-service Islamic center with prayer facilities, school, and community programs.',
          location: 'Newark, NJ',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=icnj',
          organizationName: 'Islamic Center of New Jersey',
          organizationType: 'Islamic Center'
        }
      }
    }
  ]

  // Create all users
  const createdProfessionals = []
  const createdSeekers = []
  const createdOrganizations = []

  for (const prof of professionals) {
    const user = await prisma.user.create({
      data: prof as any,
      include: { profile: true }
    })
    createdProfessionals.push(user)
  }

  for (const seeker of seekers) {
    const user = await prisma.user.create({
      data: seeker as any,
      include: { profile: true }
    })
    createdSeekers.push(user)
  }

  for (const org of organizations) {
    const user = await prisma.user.create({
      data: org as any,
      include: { profile: true }
    })
    createdOrganizations.push(user)
  }

  // Create Posts
  const posts = [
    {
      userId: createdOrganizations[0].id,
      content: '🔍 Looking for Jummah Khateeb this Friday\n\nWe need a khateeb for this Friday\'s Jummah prayer. Topic: "The Importance of Community in Islam"\n\n📍 Location: Manhattan, NY\n⏰ Time: 1:00 PM\n💰 Compensation: $200\n\nRequirements:\n- Must be Hafiz\n- Fluent in English and Arabic\n- Experience with youth-focused khutbahs\n\nPlease send proposals through the platform.',
      postType: 'Opportunity',
      serviceType: 'KHUTBAH',
      location: 'Manhattan, NY',
      date: new Date('2024-01-05'),
      compensation: '$200',
      requirements: 'Hafiz, English/Arabic speaker',
      likes: 15,
      views: 230
    },
    {
      userId: createdProfessionals[0].id,
      content: '✨ Friday Reminder\n\n"The best of you are those who are best to their families, and I am the best of you to my family." - Prophet Muhammad ﷺ\n\nFamily is the foundation of our community. Let\'s strengthen our bonds with kindness, patience, and love.\n\n#JummahMubarak #IslamicReminders',
      postType: 'Reminder',
      likes: 45,
      views: 520
    },
    {
      userId: createdOrganizations[1].id,
      content: '📚 Ramadan Program Coordinator Needed\n\nWe\'re looking for an experienced scholar to lead our Ramadan programs:\n\n- Tarawih prayers (Hafiz required)\n- Daily Tafseer sessions\n- Youth iftars and programs\n- Qiyam ul-Layl coordination\n\n📅 Duration: Full month of Ramadan\n📍 Location: Newark, NJ\n💰 Compensation: $5000 for the month\n\nIdeal candidate should have experience with community programs and be fluent in English.',
      postType: 'Opportunity',
      serviceType: 'RAMADAN_PROGRAM',
      location: 'Newark, NJ',
      compensation: '$5000',
      requirements: 'Hafiz, Program experience',
      likes: 28,
      views: 450
    },
    {
      userId: createdSeekers[0].id,
      content: 'Looking for a Sheikh to officiate our nikah ceremony next month. Need someone who can conduct the ceremony in English and Arabic. Location: Brooklyn, NY. Please reach out if available.',
      postType: 'Request',
      serviceType: 'NIKAH',
      location: 'Brooklyn, NY',
      date: new Date('2024-02-15'),
      likes: 8,
      views: 95
    },
    {
      userId: createdProfessionals[2].id,
      content: '🎓 New Tajweed Course Starting!\n\nBeginner-friendly online Tajweed course starting next week. Learn proper Quran recitation from the comfort of your home.\n\n- 8 week program\n- 2 sessions per week\n- Small group classes (max 10 students)\n- Certificate upon completion\n\nRegister through my profile or send me a message for details.',
      postType: 'Announcement',
      likes: 32,
      views: 410
    }
  ]

  for (const post of posts) {
    await prisma.post.create({ data: post as any })
  }

  // Create some follows
  await prisma.follow.create({
    data: {
      followerId: createdSeekers[0].id,
      followingId: createdProfessionals[0].id
    }
  })

  await prisma.follow.create({
    data: {
      followerId: createdOrganizations[0].id,
      followingId: createdProfessionals[0].id
    }
  })

  await prisma.follow.create({
    data: {
      followerId: createdOrganizations[0].id,
      followingId: createdProfessionals[1].id
    }
  })

  // Create proposals
  await prisma.proposal.create({
    data: {
      fromUserId: createdOrganizations[0].id,
      toUserId: createdProfessionals[0].id,
      serviceType: 'KHUTBAH',
      eventDate: new Date('2024-01-05'),
      location: 'Manhattan, NY',
      description: 'We would like to invite you to deliver the Jummah khutbah this Friday. Topic: "The Importance of Community in Islam"',
      budget: '$200',
      status: 'pending'
    }
  })

  await prisma.proposal.create({
    data: {
      fromUserId: createdSeekers[0].id,
      toUserId: createdProfessionals[0].id,
      serviceType: 'NIKAH',
      eventDate: new Date('2024-02-15'),
      location: 'Brooklyn, NY',
      description: 'Assalamu alaikum Sheikh, we would like to request your services for our nikah ceremony.',
      budget: '$300',
      status: 'pending'
    }
  })

  // Create endorsements
  await prisma.endorsement.create({
    data: {
      profileId: createdProfessionals[0].profile!.id,
      endorserName: 'Dr. Abdullah Rahman',
      endorserTitle: 'Board Member, Islamic Center',
      content: 'Sheikh Ahmad is an exceptional scholar and community leader. His khutbahs are always relevant and inspiring. Highly recommended.',
      qualities: JSON.stringify(['Clear Communication', 'Knowledgeable', 'Youth-Friendly'])
    }
  })

  await prisma.endorsement.create({
    data: {
      profileId: createdProfessionals[0].profile!.id,
      endorserName: 'Sister Aisha',
      endorserTitle: 'Community Member',
      content: 'Sheikh Ahmad officiated our nikah beautifully. He made the ceremony meaningful and memorable for our families.',
      qualities: JSON.stringify(['Professional', 'Compassionate', 'Well-Prepared'])
    }
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
