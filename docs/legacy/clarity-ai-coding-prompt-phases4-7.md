# CLARITY - PHASES 4-7: COMPLETE GENERATION SYSTEM
## Reference Upload → Super-Prompt → Design → Export

---

## 🎯 **OVERVIEW:**

These four phases work together as the core generation engine:

**PHASE 4:** Reference Image Upload (5-8 images, Claude Vision analysis)
**PHASE 5:** Super-Prompt Engine (auto-generate 60-page spec)
**PHASE 6:** Design Generation (Claude API streaming, live preview)
**PHASE 7:** Export & Deploy (React, HTML, Figma, Webflow, Vercel)

---

# PHASE 4: REFERENCE IMAGE UPLOAD

## **File:** `app/(dashboard)/project/[id]/references/page.tsx`

```typescript
'use client'

import { useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { Upload, X, Check, Eye, Sparkles } from 'lucide-react'

const CATEGORIES = [
  {
    id: 'hero',
    title: 'Hero Sections',
    description: 'Find 2-3 hero sections you love',
    required: 2,
    maxImages: 3
  },
  {
    id: 'animation',
    title: 'Animations/Motion',
    description: 'Show me motion you love (videos, GIFs, or live sites)',
    required: 1,
    maxImages: 2
  },
  {
    id: 'layout',
    title: 'Layouts',
    description: 'Find layouts that inspire you',
    required: 1,
    maxImages: 2
  },
  {
    id: 'colors',
    title: 'Color Palettes',
    description: 'Colors that resonate',
    required: 1,
    maxImages: 2
  },
  {
    id: 'vibe',
    title: 'Overall Vibe',
    description: 'Anything that captures the feeling (can be non-web)',
    required: 1,
    maxImages: 2
  },
]

type ReferenceImage = {
  id: string
  url: string
  category: string
  analysis?: any
  annotations?: string[]
}

export default function ReferenceUploadPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [images, setImages] = useState<ReferenceImage[]>([])
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const analyzeImage = async (imageUrl: string, imageId: string) => {
    setAnalyzing(imageId)
    
    try {
      // Call Claude Vision API
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      })

      const analysis = await response.json()

      // Update image with analysis
      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, analysis } : img
      ))
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setAnalyzing(null)
    }
  }

  const uploadImage = async (file: File, category: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${projectId}/${category}-${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('reference-images')
      .upload(fileName, file)

    if (error) {
      console.error('Upload error:', error)
      return
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('reference-images')
      .getPublicUrl(fileName)

    const newImage: ReferenceImage = {
      id: Date.now().toString(),
      url: publicUrl,
      category,
    }

    setImages(prev => [...prev, newImage])

    // Analyze image with Claude Vision
    analyzeImage(publicUrl, newImage.id)

    // Save to database
    await supabase.from('reference_images').insert({
      project_id: projectId,
      user_id: user.id,
      category,
      url: publicUrl,
    })
  }

  const removeImage = async (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    
    // Delete from database
    await supabase.from('reference_images')
      .delete()
      .eq('id', imageId)
  }

  const handleContinue = async () => {
    setSaving(true)
    
    // Save all reference images to project
    await supabase
      .from('projects')
      .update({
        reference_images: images.map(img => ({
          url: img.url,
          category: img.category,
          analysis: img.analysis,
          annotations: img.annotations
        })),
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    router.push(`/project/${projectId}/generate`)
  }

  const isComplete = CATEGORIES.every(cat => {
    const count = images.filter(img => img.category === cat.id).length
    return count >= cat.required
  })

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Show Us What You Love</h1>
            <p className="text-sm text-gray-400">
              Upload 5-8 reference images to guide your design
            </p>
          </div>
          
          {isComplete && (
            <button
              onClick={handleContinue}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-medium rounded-xl transition-colors"
            >
              {saving ? 'Processing...' : 'Continue to Generation'}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {CATEGORIES.map((category) => {
          const categoryImages = images.filter(img => img.category === category.id)
          const canUploadMore = categoryImages.length < category.maxImages

          return (
            <CategoryUploadZone
              key={category.id}
              category={category}
              images={categoryImages}
              analyzing={analyzing}
              canUploadMore={canUploadMore}
              onUpload={(file) => uploadImage(file, category.id)}
              onRemove={removeImage}
            />
          )
        })}
      </div>
    </div>
  )
}

function CategoryUploadZone({ category, images, analyzing, canUploadMore, onUpload, onRemove }) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => onUpload(file))
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxFiles: category.maxImages - images.length,
    disabled: !canUploadMore
  })

  return (
    <div className="mb-12">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          {category.title}
          <span className="text-sm font-normal text-gray-400 ml-2">
            ({images.length}/{category.maxImages})
          </span>
        </h3>
        <p className="text-sm text-gray-400">{category.description}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Uploaded Images */}
        {images.map(image => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden group"
          >
            <img
              src={image.url}
              alt="Reference"
              className="w-full h-full object-cover"
            />

            {/* Analyzing overlay */}
            {analyzing === image.id && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-blue-400 animate-pulse mx-auto mb-2" />
                  <p className="text-sm text-white">Analyzing...</p>
                </div>
              </div>
            )}

            {/* Remove button */}
            <button
              onClick={() => onRemove(image.id)}
              className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Analysis complete indicator */}
            {image.analysis && (
              <div className="absolute bottom-2 left-2 px-3 py-1 bg-green-600 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-white" />
                <span className="text-xs text-white">Analyzed</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Upload zone */}
        {canUploadMore && (
          <div
            {...getRootProps()}
            className={`aspect-[4/3] border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/10 hover:border-white/30 bg-white/5'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center p-6">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                {isDragActive ? 'Drop here' : 'Drop image or click to upload'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## **API Route:** `/api/analyze-image/route.ts`

```typescript
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    // Fetch image as base64
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const mediaType = imageResponse.headers.get('content-type') || 'image/jpeg'

    // Analyze with Claude Vision
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: `Analyze this design reference image. Extract:
1. Color palette (hex codes)
2. Typography style (serif/sans-serif, size, weight)
3. Layout structure (grid, asymmetric, centered)
4. Visual techniques (glassmorphism, shadows, gradients, etc.)
5. Material language (what does it feel like? glass, metal, paper, fabric)
6. Motion hints (if any animation visible)
7. Key patterns (what makes this distinctive?)

Return as JSON with keys: colors, typography, layout, techniques, materials, motion, patterns`
          }
        ],
      }],
    })

    const analysisText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    // Parse JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
```

---

# PHASE 5: SUPER-PROMPT ENGINE

## **File:** `app/(dashboard)/project/[id]/generate/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react'

export default function GeneratePage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [superPrompt, setSuperPrompt] = useState<any>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  useEffect(() => {
    loadProject()
  }, [projectId])

  const loadProject = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    setProject(data)

    // Auto-generate if not already done
    if (!data.super_prompt) {
      generateSuperPrompt(data)
    } else {
      setSuperPrompt(data.super_prompt)
    }
  }

  const generateSuperPrompt = async (projectData: any) => {
    setGenerating(true)
    
    try {
      // Call API to generate super-prompt
      const response = await fetch('/api/generate-superprompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      let accumulated = ''

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            
            if (data.progress) {
              setProgress(data.progress)
              setCurrentStep(data.step)
            }

            if (data.superPrompt) {
              setSuperPrompt(data.superPrompt)
              
              // Save to database
              await supabase
                .from('projects')
                .update({ super_prompt: data.superPrompt })
                .eq('id', projectId)
            }
          }
        }
      }
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleContinue = () => {
    router.push(`/project/${projectId}/design`)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  if (!project) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Design Specification</h1>
            <p className="text-sm text-gray-400">
              {generating ? 'Generating your super-prompt...' : 'Review your complete design specification'}
            </p>
          </div>
          
          {superPrompt && !generating && (
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Generate Design
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {generating ? (
          /* Generation Progress */
          <div className="space-y-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{currentStep}</span>
                    <span className="text-blue-400 font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Analyzed references</span>
                </div>
                <div className="flex items-center gap-2">
                  {progress >= 30 ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-white/20 rounded-full" />
                  )}
                  <span>Defined emotional architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  {progress >= 60 ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-white/20 rounded-full" />
                  )}
                  <span>Created design system</span>
                </div>
                <div className="flex items-center gap-2">
                  {progress >= 90 ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-white/20 rounded-full" />
                  )}
                  <span>Finalized specifications</span>
                </div>
              </div>
            </div>
          </div>
        ) : superPrompt ? (
          /* Super-Prompt Display */
          <div className="space-y-4">
            {Object.entries(superPrompt).map(([sectionKey, sectionData]: [string, any]) => {
              const isExpanded = expandedSections.includes(sectionKey)

              return (
                <motion.div
                  key={sectionKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">
                        {sectionData.title || sectionKey}
                      </h3>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 space-y-4">
                      {Object.entries(sectionData).map(([key, value]: [string, any]) => {
                        if (key === 'title') return null

                        return (
                          <div key={key}>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h4>
                            <div className="text-sm text-gray-400 whitespace-pre-wrap">
                              {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
```

---

## **API Route:** `/api/generate-superprompt/route.ts`

```typescript
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  const { projectId } = await request.json()
  const supabase = createClient()

  // Get project data
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  // Get reference images with analysis
  const { data: references } = await supabase
    .from('reference_images')
    .select('*')
    .eq('project_id', projectId)

  // Create readable stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      // Send progress updates
      const sendProgress = (step: string, progress: number) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ step, progress })}\n\n`)
        )
      }

      sendProgress('Analyzing references...', 10)

      // Build super-prompt with Claude
      const prompt = `You are an expert design system architect. Generate a complete Design Super-Prompt v3.0 specification based on this project data:

PROJECT BASICS:
${JSON.stringify(project.project_basics, null, 2)}

EMOTIONAL CORE:
${JSON.stringify(project.emotional_core, null, 2)}

STYLE ARCHETYPE:
${JSON.stringify(project.style_archetype, null, 2)}

REFERENCE IMAGES ANALYSIS:
${JSON.stringify(references.map(r => r.analysis), null, 2)}

Generate a complete super-prompt with these sections:
1. Vision (project objective, emotional architecture, "The One Thing", style archetype)
2. Constraints (anti-patterns, hero animation, performance budgets)
3. Design System (typography, colors, materials, spacing, motion)
4. Creative Execution (section strategies, animation vocabulary)

Return as structured JSON.`

      sendProgress('Defining emotional architecture...', 30)

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      })

      sendProgress('Creating design system...', 60)

      const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      const superPrompt = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

      sendProgress('Finalizing specifications...', 90)

      // Send final super-prompt
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ superPrompt, progress: 100 })}\n\n`)
      )

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

---

# PHASE 6: DESIGN GENERATION

## **File:** `app/(dashboard)/project/[id]/design/page.tsx`

```typescript
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { Sparkles, Download, Eye, Code, Share2 } from 'lucide-react'

export default function DesignGenerationPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [generating, setGenerating] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [designCode, setDesignCode] = useState('')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    generateDesign()
  }, [])

  const generateDesign = async () => {
    setGenerating(true)

    const response = await fetch('/api/generate-design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId })
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader!.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))
          
          if (data.progress) {
            setProgress(data.progress)
            setCurrentStep(data.step)
          }

          if (data.code) {
            setDesignCode(prev => prev + data.code)
            
            // Update iframe
            if (iframeRef.current) {
              const doc = iframeRef.current.contentDocument
              if (doc) {
                doc.open()
                doc.write(data.code)
                doc.close()
              }
            }
          }

          if (data.complete) {
            // Save to database
            await supabase
              .from('projects')
              .update({
                design_code: data.code,
                status: 'complete',
                generation_time_seconds: data.time
              })
              .eq('id', projectId)

            setGenerating(false)
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {generating ? (
              <>
                <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                <div>
                  <h1 className="text-lg font-semibold text-white">{currentStep}</h1>
                  <p className="text-sm text-gray-400">{progress}% complete</p>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-lg font-semibold text-white">Your Design is Ready!</h1>
                <div className="flex items-center gap-2">
                  {['desktop', 'tablet', 'mobile'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setPreviewMode(mode as any)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        previewMode === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {!generating && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/project/${projectId}/export`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          )}
        </div>

        {generating && (
          <div className="px-6 pb-4">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          className={`bg-white shadow-2xl transition-all ${
            previewMode === 'desktop' ? 'w-full max-w-7xl h-full' :
            previewMode === 'tablet' ? 'w-[768px] h-[1024px]' :
            'w-[375px] h-[812px]'
          }`}
          style={{ borderRadius: previewMode !== 'desktop' ? '24px' : '0' }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            style={{ border: 'none', borderRadius: 'inherit' }}
          />
        </div>
      </div>
    </div>
  )
}
```

---

# PHASE 7: EXPORT & DEPLOY

## **File:** `app/(dashboard)/project/[id]/export/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Download, ExternalLink, FileCode, Figma } from 'lucide-react'

export default function ExportPage() {
  const params = useParams()
  const projectId = params.id as string

  const [exporting, setExporting] = useState<string | null>(null)

  const handleExport = async (format: string) => {
    setExporting(format)

    const response = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, format })
    })

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clarity-${projectId}.${format === 'react' ? 'zip' : format}`
    a.click()

    setExporting(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Export Your Design</h1>
        <p className="text-gray-400 mb-12">Choose your preferred format</p>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              format: 'react',
              title: 'React Component',
              description: 'Clean JSX with Tailwind CSS, ready for Next.js or Vite',
              icon: <FileCode className="w-6 h-6" />
            },
            {
              format: 'html',
              title: 'HTML Bundle',
              description: 'Self-contained HTML/CSS/JS, deploy anywhere',
              icon: <FileCode className="w-6 h-6" />
            },
            {
              format: 'figma',
              title: 'Figma Design',
              description: 'Import to Figma, continue editing visually',
              icon: <Figma className="w-6 h-6" />
            },
          ].map(option => (
            <button
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={exporting === option.format}
              className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-left transition-all disabled:opacity-50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                  {option.icon}
                </div>
                <Download className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
              <p className="text-sm text-gray-400">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## ✅ **PHASES 4-7 CHECKLIST:**

**Phase 4:**
- [ ] Reference upload page with 5 categories
- [ ] Drag-drop upload works
- [ ] Images saved to Supabase Storage
- [ ] Claude Vision analysis triggered
- [ ] Analysis results displayed
- [ ] Continue button enabled when complete

**Phase 5:**
- [ ] Super-prompt generation page
- [ ] Streaming progress updates
- [ ] Super-prompt displays in collapsible sections
- [ ] Data saved to database
- [ ] Continue to design generation

**Phase 6:**
- [ ] Design generation with streaming
- [ ] Live preview in iframe
- [ ] Responsive preview modes (desktop/tablet/mobile)
- [ ] Progress indicator
- [ ] Design saved to database

**Phase 7:**
- [ ] Export page with format options
- [ ] React export works
- [ ] HTML export works
- [ ] Figma export works (optional)
- [ ] One-click deploy (optional)

---

## 🚀 **COMPLETE MVP READY!**

Once all 7 phases are complete and tested, you have a full working MVP of Clarity!

---

**END OF PHASES 4-7 PROMPT**
