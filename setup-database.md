# Database Setup for Vercel Deployment

## Option 1: Neon (Recommended - Free PostgreSQL)

1. Go to https://neon.tech
2. Sign up for a free account
3. Create a new project
4. Copy the connection string from your dashboard
5. Update the DATABASE_URL environment variable in Vercel

## Option 2: Supabase (Free PostgreSQL)

1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string
6. Update the DATABASE_URL environment variable in Vercel

## Option 3: Railway (Free PostgreSQL)

1. Go to https://railway.app
2. Sign up for a free account
3. Create a new PostgreSQL database
4. Copy the connection string
5. Update the DATABASE_URL environment variable in Vercel

## Update Vercel Environment Variables

Once you have your database connection string, run:

```bash
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
```

## Deploy to Vercel

After setting up the database:

```bash
vercel --prod
```

## Database Migration

After deployment, you'll need to run migrations:

```bash
vercel env pull .env.production.local
npx prisma db push
npx prisma db seed
```







