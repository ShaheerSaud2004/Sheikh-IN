# Fix 500 Internal Server Error - Database Setup

## The Problem
Your application is getting 500 errors because it's using a placeholder database URL that doesn't exist.

## Quick Fix - Set up Neon Database (Free)

### Step 1: Create Neon Database
1. Go to https://neon.tech
2. Sign up for a free account
3. Create a new project
4. Copy the connection string (it looks like: `postgresql://user:password@host/database`)

### Step 2: Update Vercel Environment Variables
Run these commands with your actual connection string:

```bash
# Replace YOUR_CONNECTION_STRING with the actual Neon connection string
vercel env add DATABASE_URL production
# When prompted, paste your Neon connection string

vercel env add DATABASE_URL preview  
# When prompted, paste your Neon connection string
```

### Step 3: Deploy and Migrate
```bash
# Deploy the updated environment
vercel --prod

# After deployment, run migrations
vercel env pull .env.production.local
npx prisma db push
npx prisma db seed
```

## Alternative: Use Supabase (Free)
1. Go to https://supabase.com
2. Create a free project
3. Go to Settings > Database
4. Copy the connection string
5. Follow steps 2-3 above

## Test the Fix
After setting up the database:
1. Visit your app: https://sheikh-a3hnm1t3t-shaheers-projects-02efc33d.vercel.app
2. Try to sign in with demo accounts
3. Check that the 500 errors are gone

## Demo Accounts (after database setup)
- Sheikh: sheikh.ahmad@example.com / password123
- Individual: ali.hassan@example.com / password123
- Masjid: masjid.taqwa@example.com / password123






