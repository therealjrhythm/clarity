# CLARITY - PHASE 2: CONVERSATIONAL ONBOARDING
## AI Coding Prompt for Chat-Style Project Questionnaire

---

## 🎯 **WHAT WE'RE BUILDING:**

**Feature:** Conversational onboarding interface that asks users strategic questions about their project.

**Why:** Instead of overwhelming users with a long form, we guide them through project definition one question at a time, like a conversation with a design consultant.

**User Flow:**
1. User clicks "New Project" from dashboard
2. Chat interface appears (like ChatGPT/Claude)
3. AI asks questions one by one
4. User answers (text, buttons, or selections)
5. AI validates answers, asks follow-ups if needed
6. Progress saved automatically
7. Proceeds to Style Archetype selection (Phase 3)

---

## 📋 **PHASE 2 REQUIREMENTS:**

### **1. Create New Project Route**

**File:** `app/(dashboard)/project/new/page.tsx`

```typescript
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { Send, Sparkles, Check } from 'lucide-react'

type Message = {
  id: string
  type: 'ai' | 'user'
  content: string
  options?: string[] // For button choices
  timestamp: Date
}

type ProjectData = {
  projectType?: string
  projectName?: string
  purpose?: string
  targetAudience?: string
  primaryGoal?: string
  emotionalCore?: string[]
}

const PROJECT_TYPES = [
  { value: 'landing_page', label: 'Landing Page', icon: '🚀' },
  { value: 'saas_app', label: 'SaaS Application', icon: '💼' },
  { value: 'dashboard', label: 'Dashboard/Admin', icon: '📊' },
  { value: 'ecommerce', label: 'E-commerce Store', icon: '🛒' },
  { value: 'portfolio', label: 'Portfolio Site', icon: '💼' },
  { value: 'marketing_site', label: 'Marketing Site', icon: '📢' },
]

const EMOTIONAL_CORE_OPTIONS = [
  'Energized & Inspired',
  'Calm & Sophisticated',
  'Playful & Fun',
  'Serious & Professional',
  'Luxurious & Exclusive',
  'Innovative & Cutting-Edge',
  'Warm & Welcoming',
  'Bold & Confident',
]

export default function NewProjectPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [projectData, setProjectData] = useState<ProjectData>({})
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUserId(user.id)
        // Start conversation
        addAIMessage("Hi! I'm here to help you create something incredible. Let's start by understanding what you're building.", 0)
      }
    }
    getUser()
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addAIMessage = (content: string, delay: number = 500, options?: string[]) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content,
        options,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, delay)
  }

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }])
  }

  const handleNextQuestion = (answer: string, field: keyof ProjectData) => {
    // Save answer
    const newData = { ...projectData, [field]: answer }
    setProjectData(newData)
    
    // Add user message
    addUserMessage(answer)
    
    // Move to next step
    setCurrentStep(prev => prev + 1)
    
    // Ask next question based on step
    setTimeout(() => {
      askNextQuestion(currentStep + 1, newData)
    }, 800)
  }

  const askNextQuestion = (step: number, data: ProjectData) => {
    switch(step) {
      case 1:
        addAIMessage(
          "What type of project are we building?",
          500,
          PROJECT_TYPES.map(t => `${t.icon} ${t.label}`)
        )
        break
        
      case 2:
        addAIMessage(`Perfect! A ${data.projectType?.replace('_', ' ')} it is. What's the project name?`, 500)
        break
        
      case 3:
        addAIMessage("Great name! What's the main purpose of this project? (One sentence)", 500)
        break
        
      case 4:
        addAIMessage("Who's your target audience? (Age, profession, interests)", 500)
        break
        
      case 5:
        addAIMessage("What should visitors do when they land on your site? (Primary conversion action)", 500)
        break
        
      case 6:
        addAIMessage(
          "How should visitors feel when they see this?",
          500,
          EMOTIONAL_CORE_OPTIONS
        )
        break
        
      case 7:
        // Save to database and move to next phase
        saveProjectAndContinue(data)
        break
    }
  }

  const saveProjectAndContinue = async (data: ProjectData) => {
    if (!userId) return

    addAIMessage("Perfect! Give me a moment to process everything...", 300)

    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          name: data.projectName || 'Untitled Project',
          type: data.projectType || 'landing_page',
          status: 'draft',
          project_basics: {
            purpose: data.purpose,
            audience: data.targetAudience,
            goal: data.primaryGoal,
          },
          emotional_core: {
            emotions: data.emotionalCore
          }
        })
        .select()
        .single()

      if (error) throw error

      addAIMessage(
        "Excellent! I've captured all the basics. Now let's define your visual style...",
        800
      )

      setTimeout(() => {
        router.push(`/project/${project.id}/archetype`)
      }, 2000)

    } catch (error) {
      console.error('Error saving project:', error)
      addAIMessage("Oops! Something went wrong. Let's try that again.", 500)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const value = inputValue.trim()
    setInputValue('')

    // Determine which field we're currently filling
    const fieldMap: Record<number, keyof ProjectData> = {
      2: 'projectName',
      3: 'purpose',
      4: 'targetAudience',
      5: 'primaryGoal',
    }

    const field = fieldMap[currentStep]
    if (field) {
      handleNextQuestion(value, field)
    }
  }

  const handleOptionClick = (option: string) => {
    if (currentStep === 1) {
      // Project type selection
      const projectType = PROJECT_TYPES.find(t => option.includes(t.label))
      if (projectType) {
        handleNextQuestion(projectType.label, 'projectType')
      }
    } else if (currentStep === 6) {
      // Emotional core selection (can select multiple)
      const current = projectData.emotionalCore || []
      const newEmotions = current.includes(option)
        ? current.filter(e => e !== option)
        : [...current, option]
      
      setProjectData(prev => ({ ...prev, emotionalCore: newEmotions }))
      
      // Show confirmation button after selecting at least 1
      if (newEmotions.length > 0) {
        // User needs to confirm their selection
      }
    }
  }

  const confirmEmotionalCore = () => {
    if (projectData.emotionalCore && projectData.emotionalCore.length > 0) {
      addUserMessage(projectData.emotionalCore.join(', '))
      setCurrentStep(7)
      setTimeout(() => {
        askNextQuestion(7, projectData)
      }, 800)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <span className="text-white font-medium">New Project</span>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6 mb-32">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl px-6 py-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 border border-white/10 text-white'
                  }`}
                >
                  {message.content}
                  
                  {/* Option buttons */}
                  {message.options && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(option)}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            projectData.emotionalCore?.includes(option)
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Confirm button for emotional core */}
                  {currentStep === 6 && projectData.emotionalCore && projectData.emotionalCore.length > 0 && (
                    <button
                      onClick={confirmEmotionalCore}
                      className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Continue with {projectData.emotionalCore.length} emotion{projectData.emotionalCore.length > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex gap-2">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (fixed at bottom) */}
        {currentStep >= 2 && currentStep <= 5 && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent py-6">
            <div className="max-w-4xl mx-auto px-6">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-6 py-4 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### **2. Update Dashboard to Link to New Project**

**File:** `app/(dashboard)/dashboard/page.tsx`

Update the "New Project" button to link to `/project/new`:

```typescript
<button
  onClick={() => router.push('/project/new')}
  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
>
  <Plus className="w-5 h-5" />
  New Project
</button>
```

---

### **3. Add Project Type Constants**

**File:** `lib/constants.ts`

```typescript
export const PROJECT_TYPES = [
  { value: 'landing_page', label: 'Landing Page', icon: '🚀', description: 'Single page to convert visitors' },
  { value: 'saas_app', label: 'SaaS Application', icon: '💼', description: 'Multi-page app interface' },
  { value: 'dashboard', label: 'Dashboard/Admin', icon: '📊', description: 'Data visualization interface' },
  { value: 'ecommerce', label: 'E-commerce Store', icon: '🛒', description: 'Online shop with products' },
  { value: 'portfolio', label: 'Portfolio Site', icon: '🎨', description: 'Showcase your work' },
  { value: 'marketing_site', label: 'Marketing Site', icon: '📢', description: 'Multi-page marketing site' },
]

export const EMOTIONAL_CORE_OPTIONS = [
  { value: 'energized', label: 'Energized & Inspired', description: 'High energy, motivating' },
  { value: 'calm', label: 'Calm & Sophisticated', description: 'Peaceful, elegant' },
  { value: 'playful', label: 'Playful & Fun', description: 'Lighthearted, engaging' },
  { value: 'serious', label: 'Serious & Professional', description: 'Formal, authoritative' },
  { value: 'luxurious', label: 'Luxurious & Exclusive', description: 'Premium, high-end' },
  { value: 'innovative', label: 'Innovative & Cutting-Edge', description: 'Tech-forward, modern' },
  { value: 'warm', label: 'Warm & Welcoming', description: 'Friendly, approachable' },
  { value: 'bold', label: 'Bold & Confident', description: 'Strong, assertive' },
]
```

---

### **4. Add TypeScript Types**

**File:** `types/project.ts`

```typescript
export type ProjectType = 'landing_page' | 'saas_app' | 'dashboard' | 'ecommerce' | 'portfolio' | 'marketing_site'

export type ProjectBasics = {
  purpose: string
  audience: string
  goal: string
}

export type EmotionalCore = {
  emotions: string[]
}

export type Project = {
  id: string
  user_id: string
  name: string
  type: ProjectType
  status: 'draft' | 'in_progress' | 'complete'
  thumbnail_url?: string
  created_at: string
  updated_at: string
  project_basics?: ProjectBasics
  emotional_core?: EmotionalCore
  style_archetype?: any
  reference_images?: any
  super_prompt?: any
  design_code?: string
  export_formats?: any
  generation_time_seconds?: number
  quality_score?: number
  iteration_count?: number
}
```

---

## ✅ **PHASE 2 CHECKLIST:**

When building Phase 2, ensure:

- [ ] New project route created (`/project/new`)
- [ ] Chat interface renders messages smoothly
- [ ] AI messages appear with typing delay
- [ ] User messages appear instantly
- [ ] Project type selection works (button options)
- [ ] Text input works for open-ended questions
- [ ] Emotional core multi-select works
- [ ] Progress auto-saves to database
- [ ] Validation prevents empty submissions
- [ ] Smooth transitions between questions
- [ ] Mobile responsive (chat bubbles, input fixed at bottom)
- [ ] Redirects to archetype selector after completion

---

## 🎨 **UX ENHANCEMENTS:**

**1. Progress Indicator** (optional but nice):
Add at top of chat:
```typescript
<div className="flex items-center gap-2 mb-6">
  {[1,2,3,4,5,6].map(step => (
    <div
      key={step}
      className={`h-2 flex-1 rounded-full ${
        step <= currentStep ? 'bg-blue-600' : 'bg-white/10'
      }`}
    />
  ))}
</div>
```

**2. Smart Follow-ups**:
If user gives vague answer, AI asks clarifying question:
```typescript
if (answer.split(' ').length < 5) {
  addAIMessage("Can you tell me a bit more about that?", 500)
  return // Don't advance step
}
```

**3. Auto-complete Suggestions**:
For target audience field, show common examples:
```typescript
<div className="text-sm text-gray-400 mt-2">
  Examples: "Young professionals (25-35)", "Small business owners", "Tech-savvy millennials"
</div>
```

---

## 🚀 **AFTER PHASE 2 IS COMPLETE:**

Test the full flow:
1. User clicks "New Project" from dashboard
2. Chat conversation starts automatically
3. User answers all 6 questions
4. Data saves to database correctly
5. Redirects to `/project/[id]/archetype`

**Then proceed to PHASE 3: STYLE ARCHETYPE SELECTOR**

---

**END OF PHASE 2 PROMPT**
