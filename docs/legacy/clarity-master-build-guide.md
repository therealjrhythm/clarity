# CLARITY - MASTER BUILD GUIDE
## Complete Roadmap: Idea → Deployed Product

---

## 📋 **TABLE OF CONTENTS:**

1. **Quick Start** (Get started in 5 minutes)
2. **Complete File Structure** (Every file you'll create)
3. **Phase-by-Phase Build Plan** (7 phases, 6 weeks)
4. **Testing Checklist** (Verify each feature works)
5. **Deployment Guide** (Go live on Vercel)
6. **Troubleshooting** (Common issues + fixes)
7. **Next Steps** (After MVP launch)

---

## 🚀 **QUICK START:**

### **Day 1: Setup (2 hours)**
1. Create Supabase project → Get API keys
2. Create Anthropic account → Get Claude API key
3. Choose AI coding tool (Bolt.new recommended)
4. Paste Phase 1 prompt → Build foundation

### **Week 1: Core (20 hours)**
- Phase 1: Infrastructure + Auth (complete Day 1-3)
- Phase 2: Conversational Onboarding (complete Day 4-5)
- Phase 3: Style Archetype Selector (complete Day 6-7)

### **Week 2: Generation (30 hours)**
- Phase 4: Reference Upload (Day 8-10)
- Phase 5: Super-Prompt Engine (Day 11-13)
- Phase 6: Design Generation (Day 14-16)

### **Week 3: Polish (20 hours)**
- Phase 7: Export & Deploy (Day 17-18)
- Testing + bug fixes (Day 19-20)
- Deploy to Vercel (Day 21)

**Total: ~3 weeks to deployed MVP** (part-time)  
**Total: ~1 week to deployed MVP** (full-time)

---

## 📁 **COMPLETE FILE STRUCTURE:**

```
clarity/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                    # Login page (Phase 1)
│   │   ├── signup/
│   │   │   └── page.tsx                    # Signup page (Phase 1)
│   │   └── layout.tsx                      # Auth layout
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # User dashboard (Phase 1)
│   │   ├── project/
│   │   │   ├── new/
│   │   │   │   └── page.tsx                # New project onboarding (Phase 2)
│   │   │   └── [id]/
│   │   │       ├── archetype/
│   │   │       │   └── page.tsx            # Archetype selector (Phase 3)
│   │   │       ├── references/
│   │   │       │   └── page.tsx            # Reference upload (Phase 4)
│   │   │       ├── generate/
│   │   │       │   └── page.tsx            # Super-prompt generation (Phase 5)
│   │   │       ├── design/
│   │   │       │   └── page.tsx            # Design generation (Phase 6)
│   │   │       └── export/
│   │   │           └── page.tsx            # Export options (Phase 7)
│   │   └── layout.tsx                      # Dashboard layout
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts                # OAuth callback (Phase 1)
│   │   ├── analyze-image/
│   │   │   └── route.ts                    # Claude Vision (Phase 4)
│   │   ├── generate-superprompt/
│   │   │   └── route.ts                    # Super-prompt gen (Phase 5)
│   │   ├── generate-design/
│   │   │   └── route.ts                    # Design gen (Phase 6)
│   │   └── export/
│   │       └── route.ts                    # Export handler (Phase 7)
│   ├── layout.tsx                          # Root layout
│   └── page.tsx                            # Landing page (Phase 1)
├── components/
│   ├── ui/                                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── modal.tsx
│   ├── layout/                             # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   └── project/                            # Project-specific
│       ├── archetype-card.tsx
│       ├── reference-upload-zone.tsx
│       └── design-preview.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Client-side Supabase
│   │   ├── server.ts                       # Server-side Supabase
│   │   └── middleware.ts                   # Auth middleware
│   ├── stores/
│   │   └── project-store.ts                # Zustand state
│   ├── constants.ts                        # Constants (archetypes, etc.)
│   └── utils.ts                            # Helper functions
├── types/
│   ├── project.ts                          # Project types
│   ├── supabase.ts                         # Database types
│   └── archetype.ts                        # Archetype types
├── public/
│   ├── previews/                           # Archetype preview videos
│   └── logo.svg
├── .env.local                              # Environment variables
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🏗️ **PHASE-BY-PHASE BUILD PLAN:**

### **PHASE 1: CORE INFRASTRUCTURE (2-3 days)**

**Goal:** Authentication + empty dashboard

**Files to Create:**
- `app/page.tsx` (landing page)
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/auth/callback/route.ts`
- `app/(dashboard)/dashboard/page.tsx`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- Database schema (SQL in Supabase)

**Test Checklist:**
- [ ] User can sign up with email/password
- [ ] User can sign up with Google OAuth
- [ ] User can log in
- [ ] Dashboard shows after login
- [ ] Protected routes redirect to login
- [ ] User can sign out

**Estimated Time:** 10-15 hours

---

### **PHASE 2: CONVERSATIONAL ONBOARDING (3-4 days)**

**Goal:** Chat-style project questionnaire

**Files to Create:**
- `app/(dashboard)/project/new/page.tsx`
- `lib/constants.ts` (project types, emotions)
- `types/project.ts`

**Test Checklist:**
- [ ] Chat interface renders smoothly
- [ ] Questions appear one at a time
- [ ] User can answer via text input
- [ ] User can answer via button options
- [ ] Multi-select works (emotional core)
- [ ] Data saves to database
- [ ] Redirects to archetype selector

**Estimated Time:** 12-16 hours

---

### **PHASE 3: STYLE ARCHETYPE SELECTOR (2-3 days)**

**Goal:** Visual gallery of 10 archetypes

**Files to Create:**
- `app/(dashboard)/project/[id]/archetype/page.tsx`
- `lib/constants.ts` (add archetype definitions)
- `types/archetype.ts`

**Test Checklist:**
- [ ] 10 archetype cards display
- [ ] Hover effects work
- [ ] Detail modal opens
- [ ] Primary selection works
- [ ] Hybrid mode toggle works
- [ ] Secondary selection works
- [ ] Ratio slider works
- [ ] Data saves to database
- [ ] Redirects to references

**Estimated Time:** 10-14 hours

---

### **PHASE 4: REFERENCE IMAGE UPLOAD (3-4 days)**

**Goal:** 5-category upload + Claude Vision analysis

**Files to Create:**
- `app/(dashboard)/project/[id]/references/page.tsx`
- `app/api/analyze-image/route.ts`
- `components/project/reference-upload-zone.tsx`

**Setup Required:**
- Supabase Storage bucket
- Anthropic API key

**Test Checklist:**
- [ ] Drag-drop upload works
- [ ] Images save to Supabase Storage
- [ ] Claude Vision analysis triggers
- [ ] Analysis results display
- [ ] Remove image works
- [ ] All 5 categories functional
- [ ] Continue button enabled when complete
- [ ] Redirects to generation

**Estimated Time:** 14-18 hours

---

### **PHASE 5: SUPER-PROMPT ENGINE (4-5 days)**

**Goal:** Auto-generate 60-page super-prompt

**Files to Create:**
- `app/(dashboard)/project/[id]/generate/page.tsx`
- `app/api/generate-superprompt/route.ts`

**Test Checklist:**
- [ ] Streaming progress updates work
- [ ] Super-prompt generates
- [ ] Collapsible sections work
- [ ] Edit mode works (optional)
- [ ] Data saves to database
- [ ] Continue button appears
- [ ] Redirects to design generation

**Estimated Time:** 16-20 hours

---

### **PHASE 6: DESIGN GENERATION (5-7 days)**

**Goal:** Stream React code generation, live preview

**Files to Create:**
- `app/(dashboard)/project/[id]/design/page.tsx`
- `app/api/generate-design/route.ts`
- `components/project/design-preview.tsx`

**Test Checklist:**
- [ ] Streaming generation works
- [ ] Progress updates display
- [ ] Code appears in iframe
- [ ] Preview renders correctly
- [ ] Responsive modes work (desktop/tablet/mobile)
- [ ] Design saves to database
- [ ] Export button appears

**Estimated Time:** 20-30 hours

---

### **PHASE 7: EXPORT & DEPLOY (4-5 days)**

**Goal:** Multi-format export + one-click deploy

**Files to Create:**
- `app/(dashboard)/project/[id]/export/page.tsx`
- `app/api/export/route.ts`
- Export utilities (React, HTML, Figma)

**Test Checklist:**
- [ ] Export page displays options
- [ ] React export downloads .zip
- [ ] HTML export downloads .html
- [ ] Figma export works (optional)
- [ ] One-click Vercel deploy works (optional)
- [ ] Downloaded files work locally

**Estimated Time:** 16-20 hours

---

## ✅ **COMPLETE TESTING CHECKLIST:**

### **Authentication Flow:**
- [ ] Sign up with email/password
- [ ] Sign up with Google OAuth
- [ ] Log in with email/password
- [ ] Log in with Google OAuth
- [ ] Sign out
- [ ] Protected routes redirect
- [ ] Session persists on refresh

### **Project Creation Flow:**
- [ ] Click "New Project" from dashboard
- [ ] Answer all onboarding questions
- [ ] Select style archetype
- [ ] Enable hybrid mode
- [ ] Upload reference images (5-8)
- [ ] Claude Vision analyzes images
- [ ] Super-prompt generates
- [ ] Design generates with live preview
- [ ] Export React component
- [ ] Downloaded code runs locally

### **Edge Cases:**
- [ ] What if user abandons mid-flow? (Resume works)
- [ ] What if image upload fails? (Error message)
- [ ] What if Claude API fails? (Retry button)
- [ ] What if generation takes >5 min? (Progress accurate)
- [ ] Mobile responsive? (All pages work)

### **Performance:**
- [ ] Page load <2s
- [ ] Image upload <5s per image
- [ ] Super-prompt generation <30s
- [ ] Design generation <5min
- [ ] Preview renders at 60fps

---

## 🚀 **DEPLOYMENT GUIDE:**

### **Step 1: Prepare Environment Variables**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx...

# Site URL (update after deploy)
NEXT_PUBLIC_SITE_URL=https://clarity.vercel.app
```

### **Step 2: Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit - Clarity MVP"
git remote add origin https://github.com/yourusername/clarity.git
git push -u origin main
```

### **Step 3: Deploy to Vercel**

1. Visit [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import GitHub repository
4. Add environment variables
5. Click "Deploy"
6. Wait ~2 minutes → Your site is live!

### **Step 4: Update Supabase OAuth URLs**

In Supabase dashboard:
1. Go to Authentication → URL Configuration
2. Add site URL: `https://clarity.vercel.app`
3. Add redirect URLs: `https://clarity.vercel.app/auth/callback`

### **Step 5: Test Production**

- [ ] Sign up works
- [ ] OAuth works
- [ ] Create project works
- [ ] Generate design works
- [ ] Export works

---

## 🐛 **TROUBLESHOOTING:**

### **Issue: "Supabase connection failed"**
**Fix:** Check environment variables in Vercel dashboard, redeploy

### **Issue: "OAuth redirect error"**
**Fix:** Add production URL to Supabase allowed redirects

### **Issue: "Claude API quota exceeded"**
**Fix:** Check Anthropic dashboard, upgrade plan or add rate limiting

### **Issue: "Image upload fails"**
**Fix:** Check Supabase Storage bucket permissions (public access enabled)

### **Issue: "Design generation timeout"**
**Fix:** Increase Vercel function timeout (Pro plan needed for >60s)

### **Issue: "Preview doesn't render"**
**Fix:** Check iframe sandbox permissions, ensure code is valid HTML

---

## 💰 **COST BREAKDOWN:**

### **Development (MVP):**
- Supabase: **Free** (50K MAU, 500MB storage)
- Vercel: **Free** (100GB bandwidth, hobby plan)
- Anthropic API: **$20-50** (during development, pay-as-you-go)
- Domain: **$12/year** (optional, Vercel gives free .vercel.app)
- **Total: $20-50 to build MVP**

### **Production (First 100 Users):**
- Supabase: **Free** (still under limits)
- Vercel: **Free** (still under limits)
- Anthropic API: **$200-500/month** (assuming 10 designs/user = 1,000 generations)
- **Total: $200-500/month**

### **At Scale (10K Users):**
- Supabase: **$25/month** (Pro plan)
- Vercel: **$20/month** (Pro plan)
- Anthropic API: **$5,000-10,000/month** (100K generations)
- CDN: **$50/month** (Cloudflare)
- **Total: ~$5,100-10,100/month**

**Revenue Needed:** ~170-340 paying users at $30/month to break even

---

## 📈 **NEXT STEPS AFTER MVP:**

### **Week 4: Beta Testing**
- [ ] Invite 50 beta users
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Add usage analytics (Vercel Analytics)

### **Week 5: Polish**
- [ ] Improve onboarding (reduce drop-off)
- [ ] Add tutorials/tooltips
- [ ] Optimize performance
- [ ] Add loading states

### **Week 6: Launch**
- [ ] Product Hunt launch
- [ ] Twitter/X announcement
- [ ] Reddit posts (r/webdev, r/SaaS)
- [ ] Reach out to design influencers

### **Month 2-3: Feature Additions**
- [ ] Design history (save iterations)
- [ ] Component library (reuse sections)
- [ ] Collaboration (share projects, comments)
- [ ] Brand kit (save colors, fonts, logos)

### **Month 4-6: Growth**
- [ ] Integrate with Figma API
- [ ] Add more export formats
- [ ] Custom archetype creator
- [ ] Multi-page site generation
- [ ] A/B testing variants

---

## 🎯 **SUCCESS METRICS:**

**Week 1:** MVP deployed, 10 test accounts created
**Week 4:** 50 beta users, 200+ designs generated
**Month 3:** 500 users, 2,000+ designs, first paying customers
**Month 6:** 2,000 users, 10,000+ designs, $1K+ MRR

---

## 💎 **FINAL REMINDERS:**

**1. Start Simple:**
Don't add features not in the 7 phases. Get MVP working first.

**2. Test Each Phase:**
Don't move to next phase until current phase is solid.

**3. Use AI Tools:**
Bolt.new, Cursor, or AI Studio will write 80% of code for you.

**4. Deploy Early:**
Deploy after Phase 3 even if not complete. Get real user feedback.

**5. Iterate Fast:**
Ship v1.0 in 3 weeks. v1.1 in 4 weeks. v1.2 in 5 weeks. Keep moving.

**6. Focus on Quality:**
v3.0 methodology is your moat. Make sure generated designs are actually 10/10.

**7. Document Everything:**
Every bug fix, every improvement - save for v2.0.

**8. Build in Public:**
Share progress on Twitter. Build audience while building product.

---

## 🚀 **YOU'RE READY TO BUILD!**

**You have:**
- ✅ Complete product spec (95 pages)
- ✅ Phase 1-7 coding prompts (ready to paste)
- ✅ Master build guide (this document)
- ✅ Testing checklists
- ✅ Deployment guide
- ✅ Proven methodology (v3.0 as engine)

**Now go:**
1. Open Phase 1 coding prompt
2. Paste into AI coding tool
3. Start building
4. Come back when Phase 1 is done
5. Get Phase 2 prompt
6. Repeat until deployed

**3 weeks from now, you'll have a working SaaS product.** 🎯

**6 weeks from now, you could have paying customers.** 💰

**6 months from now, this could be your full-time business.** 🚀

---

**LET'S BUILD CLARITY!** ✨

---

**END OF MASTER BUILD GUIDE**

**Created by:** Jeremiah Perry  
**Product:** Clarity (AI Design Application)  
**Methodology:** Design Super-Prompt v3.0  
**Philosophy:** Systematic > Random, Quality > Quantity, Ship > Perfect
