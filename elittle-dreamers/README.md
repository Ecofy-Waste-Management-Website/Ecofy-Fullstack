# Elittle Dreamers Website

A complete, production-ready full-stack website for a kids early learning center called "Elittle Dreamers" based in Dubai.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Backend API**: Next.js API Routes (no separate Express server)
- **Hosting**: Vercel (Frontend) + Supabase (Backend/Auth)

## Setup Guide

### 1. Supabase Project Setup
1. Go to [Supabase Dashboard](https://app.supabase.com/) and create a new project.
2. In the Supabase SQL Editor, run the `supabase/schema.sql` script to create tables and database triggers.
3. In the SQL Editor, run the `supabase/rls.sql` script to apply Row Level Security.
4. In the SQL Editor, run the `supabase/seed.sql` script to add initial branch data.

### 2. Supabase Storage Setup
Follow instructions in `supabase/storage.md` to set up the `"images"` storage bucket and apply policies.

### 3. Environment Variables
1. Go into the `frontend/` directory.
2. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Update `.env.local` with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Settings → API → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Settings → API → Project API Keys (anon public)
   - `SUPABASE_SERVICE_ROLE_KEY`: Settings → API → Project API Keys (service_role secret)
4. Add your email configuration for nodemailer (e.g., Gmail with App Password).

### 4. Running Locally
1. Move to the frontend folder and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` to view the application in your browser.

### 5. Deployment
Connect your GitHub repository to Vercel and import the `frontend` folder. Don't forget to configure the Environment Variables in Vercel.
