# 🕌 Sheikh-Din: LinkedIn for Sheikhs

A professional networking platform for Islamic scholars and the Muslim community. Connect with qualified sheikhs, imams, and Islamic educators for various services including nikah ceremonies, khutbahs, teaching, and spiritual guidance.

## ✨ Features

### For Islamic Professionals (Sheikhs/Imams/Scholars)
- **Professional Profiles**: Showcase credentials, ijazahs, and experience
- **Service Listings**: Specify specialties (nikah, khutbah, teaching, etc.)
- **Content Sharing**: Post khutbah snippets, Islamic reminders, and videos
- **Availability Management**: Set travel radius and availability status
- **Credential Verification**: Display verified badges for authentic qualifications

### For Individuals & Organizations
- **Smart Search**: Find scholars by location, language, madhhab, and specialty
- **Service Requests**: Post opportunities for khutbahs, events, and programs
- **Direct Proposals**: Send booking requests directly to scholars
- **Community Feed**: Stay updated with Islamic content and opportunities
- **Trusted Connections**: View endorsements and verified credentials

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd sheikh-din
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma db push
```

4. Seed the database with demo data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## 📱 Demo Accounts

Use these demo accounts to explore the platform:

| Account Type | Email | Password |
|-------------|-------|----------|
| **Sheikh** | sheikh.ahmad@example.com | password123 |
| **Individual** | ali.hassan@example.com | password123 |
| **Masjid** | masjid.taqwa@example.com | password123 |

## 🎯 User Flows

### For Islamic Professionals

1. **Sign Up** → Select "Islamic Professional"
2. **Profile Setup** → Add qualifications, languages, specialties
3. **Browse Feed** → View opportunities from organizations
4. **Receive Proposals** → Accept/decline booking requests
5. **Share Content** → Post Islamic reminders and announcements

### For Seekers/Organizations

1. **Sign Up** → Select "Individual" or "Organization"
2. **Basic Setup** → Add location and preferences
3. **Search Scholars** → Filter by service type, language, location
4. **View Profiles** → Check credentials and endorsements
5. **Send Proposals** → Book scholars for events

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT-based custom auth
- **PWA**: next-pwa for offline capability
- **UI Components**: Radix UI, Lucide Icons

## 📂 Project Structure

```
sheikh-din/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── feed/              # Feed page
│   ├── search/            # Search page
│   ├── profile/           # Profile pages
│   ├── proposals/         # Proposals management
│   └── onboarding/        # User onboarding
├── components/            # Reusable components
├── contexts/              # React contexts
├── lib/                   # Utilities and constants
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## 🔑 Key Features Explained

### Dynamic Onboarding
The onboarding flow adapts based on user type:
- **Professionals**: Multi-step process for qualifications
- **Seekers**: Simple profile setup
- **Organizations**: Organization-specific fields

### Smart Filtering
Search scholars by:
- Professional type (Sheikh, Mufti, Qari, etc.)
- Services (Nikah, Khutbah, Teaching, etc.)
- Languages (Arabic, English, Urdu, etc.)
- Madhhab (Hanafi, Shafi'i, Maliki, Hanbali)
- Location and travel radius
- Qualifications (Hafiz, Ijazah)

### Proposal System
- Send structured proposals with event details
- Accept/decline proposals
- Track proposal status
- Budget negotiation

## 🌙 Islamic-Specific Features

- **Madhhab Filtering**: Find scholars from specific schools of thought
- **Ijazah Verification**: Display authentic chains of transmission
- **Hafiz Badge**: Identify those who have memorized the Quran
- **Service Categories**: Islamic-specific services (Nikah, Janazah, Tarawih, etc.)
- **Multilingual Support**: Filter by language proficiency
- **Adab-Based Ratings**: Endorsements focused on Islamic values

## 📱 Progressive Web App (PWA)

This app is built as a PWA, meaning:
- Install directly to your phone's home screen
- Works offline (coming soon)
- Push notifications (coming soon)
- Native app-like experience

To install:
1. Open the app in your mobile browser
2. Click "Add to Home Screen" when prompted
3. Launch from your home screen like a native app

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run seed       # Seed database with demo data
npm run lint       # Run ESLint
```

### Database Management

```bash
npx prisma studio  # Open Prisma Studio (GUI for database)
npx prisma db push # Sync schema with database
npx prisma generate # Generate Prisma client
```

## 🤝 Contributing

This is a demo project showcasing the concept of a professional networking platform for Islamic scholars. Feel free to fork and extend!

## 📄 License

This project is for demonstration purposes.

## 🙏 Acknowledgments

Built with the intention of facilitating connections within the Muslim community and making it easier to find qualified Islamic scholars for various needs.

---

**Note**: This is a demo application with basic features. For production use, additional features like real-time messaging, payment processing, advanced verification, and enhanced security would be needed.