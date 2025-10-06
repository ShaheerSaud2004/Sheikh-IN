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
          madhhab: 'HANAFI',
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
    },
    {
      email: 'sheikh.nabhan@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Sheikh Nabhan Mazid',
          bio: 'Renowned Islamic scholar and community leader with expertise in contemporary Islamic issues and interfaith dialogue. Known for his engaging khutbahs and youth mentorship.',
          location: 'Los Angeles, CA',
          phone: '+1 (555) 567-8901',
          website: 'https://sheikhnabhan.org',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nabhan',
          professionalType: 'SHEIKH',
          madhhab: 'SHAFII',
          languages: JSON.stringify(['Arabic', 'English', 'Spanish']),
          specialties: JSON.stringify(['KHUTBAH', 'COUNSELING', 'YOUTH_PROGRAM', 'INTERFAITH']),
          travelRadius: 100,
          isAvailable: true,
          isHafiz: true,
          hasIjazah: true,
          ijazahDetails: 'Ijazah in Hadith and Tafseer from Al-Azhar',
          seminary: 'Al-Azhar University, Cairo',
          yearsExperience: 20,
          certifications: JSON.stringify(['Islamic Studies PhD', 'Interfaith Dialogue Certificate']),
          credentials: {
            create: [
              {
                title: 'PhD in Islamic Studies',
                institution: 'Al-Azhar University',
                year: '2005',
                description: 'Specialized in Contemporary Islamic Jurisprudence',
                isVerified: true
              },
              {
                title: 'Ijazah in Hadith',
                institution: 'Darul Uloom Al-Arabiyya',
                year: '2003',
                description: 'Complete chain of narration in major Hadith collections',
                isVerified: true
              }
            ]
          },
          experiences: {
            create: [
              {
                title: 'Senior Imam & Scholar',
                organization: 'Islamic Center of Greater Los Angeles',
                location: 'Los Angeles, CA',
                startDate: '2010',
                isCurrent: true,
                description: 'Leading community programs, interfaith initiatives, and youth mentorship'
              }
            ]
          }
        }
      }
    },
    {
      email: 'hafiz.omar@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Hafiz Omar Al-Rashid',
          bio: 'Distinguished Hafiz with ijazah in multiple Qiraat. Specializes in Quran memorization, Tajweed instruction, and Islamic education for all ages.',
          location: 'Miami, FL',
          phone: '+1 (555) 678-9012',
          website: 'https://hafizomar.com',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=omar',
          professionalType: 'QARI',
          madhhab: 'HANAFI',
          languages: JSON.stringify(['Arabic', 'English', 'French']),
          specialties: JSON.stringify(['TAJWEED', 'HIFZ', 'TEACHING', 'RAMADAN_PROGRAM']),
          travelRadius: 60,
          isAvailable: true,
          isHafiz: true,
          hasIjazah: true,
          ijazahDetails: 'Ijazah in 7 Qiraat from renowned Qaris',
          seminary: 'Darul Uloom Miami',
          yearsExperience: 15,
          certifications: JSON.stringify(['Hafiz Certification', 'Qiraat Certification', 'Tajweed Instructor'])
        }
      }
    },
    {
      email: 'sheikh.jummah@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Sheikh Jummah Abdullah',
          bio: 'Dynamic khateeb and Islamic educator known for his powerful Friday sermons and community engagement. Specializes in contemporary Islamic guidance and family counseling.',
          location: 'Atlanta, GA',
          phone: '+1 (555) 789-0123',
          website: 'https://sheikhjummah.com',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jummah',
          professionalType: 'KHATEEB',
          madhhab: 'MALIKI',
          languages: JSON.stringify(['Arabic', 'English', 'Swahili']),
          specialties: JSON.stringify(['KHUTBAH', 'COUNSELING', 'NIKAH', 'YOUTH_PROGRAM']),
          travelRadius: 80,
          isAvailable: true,
          isHafiz: true,
          hasIjazah: true,
          ijazahDetails: 'Ijazah in Islamic Jurisprudence',
          seminary: 'Islamic University of Medina',
          yearsExperience: 12,
          certifications: JSON.stringify(['Khateeb Certification', 'Marriage Counseling Certificate']),
          experiences: {
            create: [
              {
                title: 'Lead Khateeb',
                organization: 'Masjid Al-Huda',
                location: 'Atlanta, GA',
                startDate: '2015',
                isCurrent: true,
                description: 'Delivering weekly Friday khutbahs and leading community programs'
              }
            ]
          }
        }
      }
    },
    {
      email: 'sheikh.ibrahim@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Sheikh Ibrahim Hassan',
          bio: 'Experienced Islamic scholar and community leader specializing in Islamic finance, marriage counseling, and youth development programs.',
          location: 'Dallas, TX',
          phone: '+1 (555) 890-1234',
          website: 'https://sheikhibrahim.org',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ibrahim',
          professionalType: 'SHEIKH',
          madhhab: 'HANAFI',
          languages: JSON.stringify(['Arabic', 'English', 'Somali']),
          specialties: JSON.stringify(['COUNSELING', 'NIKAH', 'ISLAMIC_FINANCE', 'TEACHING']),
          travelRadius: 50,
          isAvailable: true,
          isHafiz: true,
          hasIjazah: true,
          ijazahDetails: 'Ijazah in Islamic Jurisprudence and Finance',
          seminary: 'Darul Uloom Karachi',
          yearsExperience: 18
        }
      }
    },
    {
      email: 'mufti.abdul@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Mufti Abdul Rahman',
          bio: 'Senior Mufti with extensive experience in issuing fatwas and Islamic legal guidance. Specializes in contemporary Islamic jurisprudence and family law.',
          location: 'Chicago, IL',
          phone: '+1 (555) 901-2345',
          website: 'https://muftiabdul.org',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=abdul',
          professionalType: 'MUFTI',
          madhhab: 'HANBALI',
          languages: JSON.stringify(['Arabic', 'English', 'Urdu']),
          specialties: JSON.stringify(['FIQH', 'COUNSELING', 'ISLAMIC_FINANCE']),
          travelRadius: 75,
          isAvailable: true,
          isHafiz: true,
          hasIjazah: true,
          ijazahDetails: 'Ifta certification from Darul Ifta Jordan',
          seminary: 'Darul Uloom Deoband',
          yearsExperience: 22
        }
      }
    },
    {
      email: 'qari.mohammed@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Qari Mohammed Ali',
          bio: 'Master Qari with beautiful recitation and extensive teaching experience. Offers online and in-person Quran classes for all levels.',
          location: 'Phoenix, AZ',
          phone: '+1 (555) 012-3456',
          website: 'https://qarimohammed.com',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed',
          professionalType: 'QARI',
          madhhab: 'SHAFII',
          languages: JSON.stringify(['Arabic', 'English', 'Bengali']),
          specialties: JSON.stringify(['TAJWEED', 'HIFZ', 'TEACHING', 'RECITATION']),
          travelRadius: 40,
          isAvailable: true,
          isHafiz: true,
          hasIjazah: true,
          ijazahDetails: 'Ijazah in 10 Qiraat and Tajweed',
          seminary: 'Al-Azhar University',
          yearsExperience: 14
        }
      }
    },
    {
      email: 'imam.hassan@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Imam Hassan Al-Mahmoud',
          bio: 'Dedicated Imam serving the community with prayers, khutbahs, and spiritual guidance. Known for his accessibility and compassionate approach.',
          location: 'Seattle, WA',
          phone: '+1 (555) 123-4567',
          website: 'https://imamhassan.org',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hassan',
          professionalType: 'IMAM',
          madhhab: 'MALIKI',
          languages: JSON.stringify(['Arabic', 'English', 'French']),
          specialties: JSON.stringify(['KHUTBAH', 'COUNSELING', 'JANAZAH', 'TEACHING']),
          travelRadius: 60,
          isAvailable: true,
          isHafiz: true,
          hasIjazah: true,
          ijazahDetails: 'Imam certification from Islamic University',
          seminary: 'Islamic University of Medina',
          yearsExperience: 16
        }
      }
    },
    {
      email: 'ustadha.aminah@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'PROFESSIONAL',
      profile: {
        create: {
          name: 'Ustadha Aminah Bint Yusuf',
          bio: 'Female Islamic scholar specializing in women\'s Islamic education, Quran teaching, and family counseling. Committed to empowering Muslim women through knowledge.',
          location: 'Detroit, MI',
          phone: '+1 (555) 234-5678',
          website: 'https://ustadhaaminah.com',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aminah',
          professionalType: 'SCHOLAR',
          madhhab: 'HANAFI',
          languages: JSON.stringify(['Arabic', 'English', 'Urdu']),
          specialties: JSON.stringify(['TEACHING', 'COUNSELING', 'YOUTH_PROGRAM', 'WOMENS_FIQH']),
          travelRadius: 45,
          isAvailable: true,
          isHafiz: false,
          hasIjazah: true,
          ijazahDetails: 'Alimah certification with specialization in women\'s fiqh',
          seminary: 'Darul Uloom Al-Banat',
          yearsExperience: 11
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
    },
    {
      email: 'omar.khan@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'SEEKER',
      profile: {
        create: {
          name: 'Omar Khan',
          bio: 'Looking for a sheikh to officiate my nikah ceremony next month',
          location: 'Chicago, IL',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=omar'
        }
      }
    },
    {
      email: 'fatima.ali@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'SEEKER',
      profile: {
        create: {
          name: 'Fatima Ali',
          bio: 'Seeking Islamic counseling and guidance for family matters',
          location: 'Houston, TX',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima'
        }
      }
    },
    {
      email: 'ahmed.hassan@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'SEEKER',
      profile: {
        create: {
          name: 'Ahmed Hassan',
          bio: 'Looking for tajweed classes for my children',
          location: 'Dallas, TX',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed'
        }
      }
    },
    {
      email: 'aisha.mohammed@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'SEEKER',
      profile: {
        create: {
          name: 'Aisha Mohammed',
          bio: 'Interested in learning more about Islamic finance and halal investments',
          location: 'Miami, FL',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aisha'
        }
      }
    },
    {
      email: 'yusuf.rahman@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'SEEKER',
      profile: {
        create: {
          name: 'Yusuf Rahman',
          bio: 'Looking for a hafiz to teach my son Quran memorization',
          location: 'Atlanta, GA',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yusuf'
        }
      }
    },
    {
      email: 'zainab.hassan@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'SEEKER',
      profile: {
        create: {
          name: 'Zainab Hassan',
          bio: 'Seeking a female Islamic scholar for women\'s education and counseling',
          location: 'Seattle, WA',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zainab'
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
    },
    {
      email: 'masjid.rahma@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'ORGANIZATION',
      profile: {
        create: {
          name: 'Masjid Ar-Rahma',
          bio: 'Community mosque in downtown area with daily prayers and weekend programs.',
          location: 'Chicago, IL',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahma',
          organizationName: 'Masjid Ar-Rahma',
          organizationType: 'Masjid'
        }
      }
    },
    {
      email: 'islamic.school@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'ORGANIZATION',
      profile: {
        create: {
          name: 'Al-Huda Islamic School',
          bio: 'K-12 Islamic school providing quality education with Islamic values.',
          location: 'Houston, TX',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alhuda',
          organizationName: 'Al-Huda Islamic School',
          organizationType: 'Islamic School'
        }
      }
    },
    {
      email: 'youth.center@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'ORGANIZATION',
      profile: {
        create: {
          name: 'Muslim Youth Center',
          bio: 'Dedicated to serving Muslim youth with educational and recreational programs.',
          location: 'Los Angeles, CA',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=youth',
          organizationName: 'Muslim Youth Center',
          organizationType: 'Youth Organization'
        }
      }
    },
    {
      email: 'charity.foundation@example.com',
      password: await bcrypt.hash('password123', 10),
      userType: 'ORGANIZATION',
      profile: {
        create: {
          name: 'Al-Khair Foundation',
          bio: 'Charitable organization providing relief and community support programs.',
          location: 'Dallas, TX',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alkhair',
          organizationName: 'Al-Khair Foundation',
          organizationType: 'Charity'
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

  // Create sample messages
  await prisma.message.create({
    data: {
      fromUserId: createdSeekers[0].id,
      toUserId: createdProfessionals[0].id,
      content: 'Assalamu alaikum Sheikh Ahmad, I hope you are well. I was wondering if you would be available to officiate a nikah ceremony next month?',
      isRead: true
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdProfessionals[0].id,
      toUserId: createdSeekers[0].id,
      content: 'Wa alaikum assalam! Yes, I would be honored to help with your nikah ceremony. Could you please provide more details about the date and location?',
      isRead: false
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdOrganizations[0].id,
      toUserId: createdProfessionals[0].id,
      content: 'Salam Sheikh Ahmad, we are looking for a khateeb for this Friday\'s Jummah. Are you available?',
      isRead: true
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdProfessionals[0].id,
      toUserId: createdOrganizations[0].id,
      content: 'Assalamu alaikum! Yes, I am available this Friday. What time would the khutbah be?',
      isRead: true
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdSeekers[1].id,
      toUserId: createdProfessionals[2].id,
      content: 'Assalamu alaikum Qari Yusuf, I am looking for a Quran teacher for my children. Do you offer online classes?',
      isRead: false
    }
  })

  // Add more sample messages with new users
  await prisma.message.create({
    data: {
      fromUserId: createdSeekers[2].id, // Omar Khan
      toUserId: createdProfessionals[0].id, // Sheikh Ahmad
      content: 'Assalamu alaikum Sheikh Ahmad, I am planning my nikah ceremony for next month in Chicago. Would you be available to officiate?',
      isRead: true
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdProfessionals[0].id,
      toUserId: createdSeekers[2].id,
      content: 'Wa alaikum assalam Omar! Congratulations on your upcoming nikah. I would be happy to help. What date are you considering?',
      isRead: false
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdSeekers[3].id, // Fatima Ali
      toUserId: createdProfessionals[4].id, // Ustadha Fatima
      content: 'Assalamu alaikum Ustadha Fatima, I need some guidance regarding family matters. Are you available for counseling?',
      isRead: true
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdSeekers[4].id, // Ahmed Hassan
      toUserId: createdProfessionals[2].id, // Qari Yusuf
      content: 'Assalamu alaikum Qari Yusuf, I want my children to learn proper tajweed. Do you offer group classes?',
      isRead: false
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdSeekers[5].id, // Aisha Mohammed
      toUserId: createdProfessionals[5].id, // Sheikh Ibrahim
      content: 'Assalamu alaikum Sheikh Ibrahim, I am interested in learning about Islamic finance. Do you provide consultations?',
      isRead: true
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdSeekers[6].id, // Yusuf Rahman
      toUserId: createdProfessionals[3].id, // Hafiz Omar
      content: 'Assalamu alaikum Hafiz Omar, I want my son to memorize the Quran. What is your teaching approach?',
      isRead: false
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdSeekers[7].id, // Zainab Hassan
      toUserId: createdProfessionals[9].id, // Ustadha Aminah
      content: 'Assalamu alaikum Ustadha Aminah, I am looking for Islamic education classes for women. Do you offer such programs?',
      isRead: true
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdOrganizations[2].id, // Masjid Ar-Rahma
      toUserId: createdProfessionals[6].id, // Sheikh Jummah
      content: 'Assalamu alaikum Sheikh Jummah, we are looking for a khateeb for our Friday prayers. Are you available?',
      isRead: false
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdOrganizations[3].id, // Al-Huda Islamic School
      toUserId: createdProfessionals[2].id, // Qari Yusuf
      content: 'Assalamu alaikum Qari Yusuf, we are looking for a Quran teacher for our school. Would you be interested?',
      isRead: true
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdOrganizations[4].id, // Muslim Youth Center
      toUserId: createdProfessionals[0].id, // Sheikh Ahmad
      content: 'Assalamu alaikum Sheikh Ahmad, we are organizing a youth program and would love your participation.',
      isRead: false
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdOrganizations[5].id, // Al-Khair Foundation
      toUserId: createdProfessionals[6].id, // Mufti Abdul Rahman
      content: 'Assalamu alaikum Mufti Abdul, we need guidance on zakat distribution. Could you help us?',
      isRead: true
    }
  })

  // Add some conversations between sheikhs
  await prisma.message.create({
    data: {
      fromUserId: createdProfessionals[1].id, // Mufti Niaz
      toUserId: createdProfessionals[0].id, // Sheikh Ahmad
      content: 'Assalamu alaikum Sheikh Ahmad, I wanted to discuss a fiqh question regarding contemporary issues.',
      isRead: true
    }
  })

  await prisma.message.create({
    data: {
      fromUserId: createdProfessionals[0].id,
      toUserId: createdProfessionals[1].id,
      content: 'Wa alaikum assalam Mufti Niaz, I would be happy to discuss. What is the specific issue?',
      isRead: false
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
