# CLARITY - AI CODING INITIALIZATION PROMPT
## Build Clarity: AI Design Application Using v3.0 Methodology

---

## 🎯 **WHAT WE'RE BUILDING:**

**Product Name:** Clarity  
**Purpose:** AI-powered design application that guides users through Design Super-Prompt v3.0 methodology to generate 10/10 quality websites, landing pages, dashboards, and applications.

**Core Innovation:** First design tool using systematic methodology (reference-first, archetype-intelligent, 4-tier framework) instead of random AI generation.

**Complete Product Spec:** [ATTACH: clarity-product-spec-v1.md]

---

## 📦 **TECH STACK:**

**Frontend:**
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Zustand (state management)
- React Hook Form + Zod (forms/validation)

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL database + auth + storage)
- Anthropic Claude API (Sonnet 4 for design generation)
- Claude Vision API (reference image analysis)

**Deployment:**
- Vercel (hosting + serverless functions)

---

## 🏗️ **BUILD PHASES:**

### **PHASE 1: CORE INFRASTRUCTURE + AUTHENTICATION** (Build First)
Set up project foundation, database, and user authentication.

### **PHASE 2: CONVERSATIONAL ONBOARDING** (Build Second)
Guided questionnaire that asks users about their project (chat-style interface).

### **PHASE 3: STYLE ARCHETYPE SELECTOR** (Build Third)
Visual gallery of 10 design archetypes users can choose from.

### **PHASE 4: REFERENCE IMAGE UPLOAD** (Build Fourth)
Interface for users to upload 5-8 reference images across 5 categories.

### **PHASE 5: SUPER-PROMPT ENGINE** (Build Fifth)
Backend logic that converts user inputs → complete v3.0 super-prompt.

### **PHASE 6: DESIGN GENERATION** (Build Sixth)
Integration with Claude API to generate actual design code based on super-prompt.

### **PHASE 7: PREVIEW & EXPORT** (Build Seventh)
Live preview interface + export to multiple formats (React, HTML, Figma).

---

## 🚀 **START WITH PHASE 1: CORE INFRASTRUCTURE**

Build the foundation first. Here's exactly what to create:

---

## PHASE 1 REQUIREMENTS:

### **1. Next.js 14 Project Setup**

**Create new Next.js project:**
```bash
npx create-next-app@latest clarity --typescript --tailwind --app
cd clarity
```

**Install dependencies:**
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand
npm install framer-motion
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react
npm install clsx tailwind-merge
```

**Project structure:**
```
clarity/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── project/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── projects/
│   │   └── generate/
│   ├── layout.tsx
│   └── page.tsx (landing page)
├── components/
│   ├── ui/ (shadcn components)
│   ├── layout/ (nav, footer, sidebar)
│   └── project/ (project-specific components)
├── lib/
│   ├── supabase/ (client, server, middleware)
│   ├── stores/ (Zustand stores)
│   └── utils/ (helpers, constants)
├── public/
└── styles/
```

---

### **2. Supabase Setup**

**Environment variables (`.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

ANTHROPIC_API_KEY=your_claude_api_key
```

**Database schema (run in Supabase SQL editor):**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free', -- free, pro, agency
  api_credits INTEGER DEFAULT 3
);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- landing_page, saas_app, dashboard, ecommerce, portfolio, marketing_site
  status TEXT DEFAULT 'draft', -- draft, in_progress, complete
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Project inputs
  project_basics JSONB, -- {purpose, audience, goal, cta}
  emotional_core JSONB, -- {emotions: []}
  style_archetype JSONB, -- {primary, secondary, ratio}
  reference_images JSONB, -- [{url, category, annotations}]
  
  -- Generated outputs
  super_prompt JSONB, -- complete 4-tier super-prompt
  design_code TEXT, -- generated React/HTML code
  export_formats JSONB, -- {react: true, html: false}
  
  -- Metadata
  generation_time_seconds INTEGER,
  quality_score FLOAT,
  iteration_count INTEGER DEFAULT 0
);

-- Reference images table
CREATE TABLE public.reference_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL, -- hero, animation, layout, colors, vibe
  url TEXT NOT NULL, -- Supabase storage URL
  analysis JSONB, -- AI vision analysis
  annotations JSONB, -- user notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exports table
CREATE TABLE public.exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  format TEXT NOT NULL, -- react, html, figma, webflow
  file_url TEXT,
  deployed_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Reference images policies (same pattern)
CREATE POLICY "Users can view own references" ON public.reference_images FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own references" ON public.reference_images FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own references" ON public.reference_images FOR DELETE USING (auth.uid() = user_id);

-- Exports policies (same pattern)
CREATE POLICY "Users can view own exports" ON public.exports FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.projects WHERE id = project_id)
);
CREATE POLICY "Users can insert own exports" ON public.exports FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.projects WHERE id = project_id)
);

-- Storage bucket for reference images
INSERT INTO storage.buckets (id, name, public) VALUES ('reference-images', 'reference-images', true);

-- Storage policies
CREATE POLICY "Users can upload own references" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'reference-images' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can view own references" ON storage.objects FOR SELECT USING (
  bucket_id = 'reference-images' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete own references" ON storage.objects FOR DELETE USING (
  bucket_id = 'reference-images' AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Supabase client setup (`lib/supabase/client.ts`):**
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const supabase = createClientComponentClient<Database>()
```

**Supabase server setup (`lib/supabase/server.ts`):**
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}
```

---

### **3. Authentication System**

**Login page (`app/(auth)/login/page.tsx`):**
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Clarity</h1>
        <p className="text-gray-400 mb-8">Design with intention. Build with intelligence.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
```

**Auth callback route (`app/auth/callback/route.ts`):**
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
```

---

### **4. Landing Page**

**Homepage (`app/page.tsx`):**
```typescript
'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Palette, Code, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Powered by Design Super-Prompt v3.0</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Design with intention.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Build with intelligence.
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Create award-winning websites, landing pages, and dashboards in minutes.
              No design skills required. Just show us what you love, we'll handle the rest.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/signup"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                Start Creating
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#features"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl transition-all"
              >
                See How It Works
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Free forever. No credit card required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Clarity is Different
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Palette className="w-8 h-8" />,
                title: 'Reference-First Approach',
                description: 'Upload images of designs you love. We analyze patterns and create something uniquely yours—not generic templates.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Systematic Quality',
                description: 'Every design follows proven v3.0 methodology. No random generation. Consistent 10/10 results every time.',
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Production-Ready Code',
                description: 'Export clean React, HTML, or Figma files. Deploy to Vercel in one click. Code that developers actually want to use.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-3xl"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to build something incredible?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators who are designing smarter, not harder.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
```

---

### **5. Dashboard Page (Empty State)**

**Dashboard (`app/(dashboard)/dashboard/page.tsx`):**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Plus, FileText, LayoutDashboard } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-white">Clarity</h1>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <a href="/dashboard" className="text-white font-medium">Projects</a>
              <a href="/templates" className="text-gray-400 hover:text-white transition-colors">Templates</a>
              <a href="/settings" className="text-gray-400 hover:text-white transition-colors">Settings</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Projects</h2>
          <p className="text-gray-400">Create your first project to get started</p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">No projects yet</h3>
          <p className="text-gray-400 mb-8 text-center max-w-md">
            Start creating your first design project. We'll guide you through every step.
          </p>
          <button
            onClick={() => router.push('/project/new')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </main>
    </div>
  )
}
```

---

## ✅ **PHASE 1 CHECKLIST:**

When building Phase 1, ensure:

- [ ] Next.js 14 project created with TypeScript + Tailwind
- [ ] All dependencies installed
- [ ] Supabase project created, environment variables set
- [ ] Database schema executed (users, projects, reference_images, exports tables)
- [ ] Row Level Security policies enabled
- [ ] Storage bucket created for reference images
- [ ] Authentication working (email/password + Google OAuth)
- [ ] Login/signup pages functional
- [ ] Auth callback route handling OAuth
- [ ] Landing page deployed with hero + features
- [ ] Dashboard page showing empty state
- [ ] Protected routes (redirect to login if not authenticated)
- [ ] Sign out functionality working

---

## 🎨 **CODE QUALITY STANDARDS:**

**TypeScript:**
- Strict mode enabled
- All functions typed (no `any` unless absolutely necessary)
- Interfaces for all data structures

**Components:**
- Client components: `'use client'` directive at top
- Server components: Default (no directive)
- Props interfaces defined
- Consistent naming (PascalCase for components)

**Styling:**
- Tailwind utility classes (no inline styles)
- Dark theme default (gray-900 backgrounds)
- Glassmorphism style (backdrop-blur, white/5 backgrounds)
- Consistent spacing (padding, margins)
- Responsive (mobile-first)

**Performance:**
- Dynamic imports for heavy components
- Image optimization (Next.js Image component)
- API route caching where appropriate
- Database indexes on frequently queried columns

**Security:**
- Environment variables for secrets
- Row Level Security on all tables
- Validated inputs (Zod schemas)
- CSRF protection (built into Next.js)

---

## 🚀 **AFTER PHASE 1 IS COMPLETE:**

Test everything:
1. User can sign up with email/password
2. User can sign up with Google OAuth
3. User can log in
4. User sees dashboard (empty state)
5. User can sign out
6. Protected routes redirect to login

**Then proceed to PHASE 2: CONVERSATIONAL ONBOARDING**

I'll provide Phase 2 specifications once Phase 1 is complete and tested.

---

## 📝 **NOTES FOR AI CODING TOOLS:**

**For Google AI Studio / Bolt / Cursor:**
- Build one file at a time, test incrementally
- Start with simpler files (page.tsx) before complex logic
- Test authentication before moving to dashboard
- Use console.log liberally during development
- Ask questions if requirements unclear

**Common Pitfalls to Avoid:**
- Don't skip environment variables setup
- Don't forget `'use client'` on interactive components
- Don't use `any` type without good reason
- Don't hardcode URLs (use env vars)
- Don't skip Row Level Security policies

---

## ✨ **LET'S BUILD CLARITY!**

**YOUR FIRST TASK:**
Create the Next.js 14 project with TypeScript and Tailwind, install all dependencies listed above, and set up the basic project structure (folders: app, components, lib, public, styles).

**Once complete, report back and I'll guide you to the next step.**

---

**END OF PHASE 1 INITIALIZATION PROMPT**
