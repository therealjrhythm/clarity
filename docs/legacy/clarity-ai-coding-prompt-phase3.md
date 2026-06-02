# CLARITY - PHASE 3: STYLE ARCHETYPE SELECTOR
## AI Coding Prompt for Visual Archetype Gallery

---

## 🎯 **WHAT WE'RE BUILDING:**

**Feature:** Visual gallery of 10 design archetypes users can choose from, with hybrid mode for blending two archetypes.

**Why:** Instead of describing style in vague terms ("modern", "clean"), users pick from systematically defined visual languages.

**User Flow:**
1. User arrives from conversational onboarding (Phase 2)
2. Sees grid of 10 archetype cards with animated previews
3. Clicks archetype → Detailed view with examples
4. Can choose single archetype OR hybrid (blend two)
5. If hybrid: Slider to set ratio (70/30, 60/40, 50/50)
6. Confirmation → Saves to database → Proceeds to reference upload (Phase 4)

---

## 📋 **PHASE 3 REQUIREMENTS:**

### **1. Archetype Selector Page**

**File:** `app/(dashboard)/project/[id]/archetype/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { STYLE_ARCHETYPES } from '@/lib/constants'
import { Check, X, ArrowRight, Info } from 'lucide-react'

type Archetype = {
  id: string
  name: string
  description: string
  characteristics: string[]
  whenToUse: string
  examples: string[]
  colors: string[]
  preview: string // URL to preview image/video
}

export default function ArchetypeSelector() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null)
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null)
  const [ratio, setRatio] = useState(70) // Primary percentage
  const [isHybrid, setIsHybrid] = useState(false)
  const [showDetail, setShowDetail] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handlePrimarySelect = (archetypeId: string) => {
    setSelectedPrimary(archetypeId)
    setShowDetail(archetypeId)
  }

  const handleSecondarySelect = (archetypeId: string) => {
    if (archetypeId === selectedPrimary) return // Can't select same
    setSelectedSecondary(archetypeId)
  }

  const handleConfirm = async () => {
    if (!selectedPrimary) return

    setSaving(true)

    const styleData = {
      primary: selectedPrimary,
      secondary: selectedSecondary,
      ratio: isHybrid && selectedSecondary ? ratio : 100,
      isHybrid: isHybrid && !!selectedSecondary
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          style_archetype: styleData,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (error) throw error

      router.push(`/project/${projectId}/references`)
    } catch (error) {
      console.error('Error saving archetype:', error)
      setSaving(false)
    }
  }

  const primaryArchetype = STYLE_ARCHETYPES.find(a => a.id === selectedPrimary)
  const secondaryArchetype = STYLE_ARCHETYPES.find(a => a.id === selectedSecondary)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Choose Your Visual Style</h1>
            <p className="text-sm text-gray-400">Select an archetype that matches your vision</p>
          </div>
          
          {selectedPrimary && (
            <button
              onClick={handleConfirm}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-medium rounded-xl transition-colors"
            >
              {saving ? 'Saving...' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Archetype Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {STYLE_ARCHETYPES.map((archetype) => (
            <motion.div
              key={archetype.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              onClick={() => handlePrimarySelect(archetype.id)}
              className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all ${
                selectedPrimary === archetype.id
                  ? 'ring-4 ring-blue-500'
                  : 'hover:ring-2 hover:ring-white/20'
              }`}
            >
              {/* Preview Image/Video */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                {/* Placeholder preview - replace with actual previews */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">{archetype.icon}</div>
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Selection indicator */}
                {selectedPrimary === archetype.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 bg-white/5 backdrop-blur-sm border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {archetype.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {archetype.description}
                </p>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDetail(archetype.id)
                  }}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Info className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hybrid Mode Toggle */}
        {selectedPrimary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Want to blend two styles?
                  </h3>
                  <p className="text-sm text-gray-400">
                    Create a hybrid by mixing {primaryArchetype?.name} with another archetype
                  </p>
                </div>
                
                <button
                  onClick={() => setIsHybrid(!isHybrid)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    isHybrid
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 border border-white/10 text-gray-300'
                  }`}
                >
                  {isHybrid ? 'Hybrid Mode' : 'Single Style'}
                </button>
              </div>

              {/* Secondary Archetype Selection */}
              {isHybrid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-sm text-gray-400 mb-4">Select secondary archetype:</p>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
                    {STYLE_ARCHETYPES.filter(a => a.id !== selectedPrimary).map((archetype) => (
                      <button
                        key={archetype.id}
                        onClick={() => handleSecondarySelect(archetype.id)}
                        className={`p-4 rounded-xl border transition-all ${
                          selectedSecondary === archetype.id
                            ? 'bg-blue-600/20 border-blue-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-3xl mb-2">{archetype.icon}</div>
                        <div className="text-xs text-white">{archetype.name}</div>
                      </button>
                    ))}
                  </div>

                  {/* Ratio Slider */}
                  {selectedSecondary && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="pt-6 border-t border-white/10"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-white">
                          {primaryArchetype?.name}: {ratio}%
                        </span>
                        <span className="text-sm font-medium text-white">
                          {secondaryArchetype?.name}: {100 - ratio}%
                        </span>
                      </div>

                      <input
                        type="range"
                        min="50"
                        max="90"
                        step="10"
                        value={ratio}
                        onChange={(e) => setRatio(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                      />

                      <div className="mt-2 text-center text-sm text-gray-400">
                        Blend ratio: {ratio}/{100 - ratio}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Selection Summary */}
        {selectedPrimary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl"
          >
            <h4 className="text-white font-medium mb-2">Your Style Selection:</h4>
            <p className="text-gray-300">
              {isHybrid && selectedSecondary ? (
                <>
                  {ratio}% {primaryArchetype?.name} + {100 - ratio}% {secondaryArchetype?.name}
                </>
              ) : (
                <>
                  100% {primaryArchetype?.name}
                </>
              )}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {primaryArchetype?.description}
            </p>
          </motion.div>
        )}
      </div>

      {/* Archetype Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetail(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 rounded-3xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            >
              {(() => {
                const archetype = STYLE_ARCHETYPES.find(a => a.id === showDetail)
                if (!archetype) return null

                return (
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="text-5xl mb-4">{archetype.icon}</div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {archetype.name}
                        </h2>
                        <p className="text-gray-400">{archetype.description}</p>
                      </div>
                      
                      <button
                        onClick={() => setShowDetail(null)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-6 h-6 text-gray-400" />
                      </button>
                    </div>

                    {/* Characteristics */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Characteristics</h3>
                      <div className="space-y-2">
                        {archetype.characteristics.map((char, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{char}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* When to Use */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Best For</h3>
                      <p className="text-gray-300">{archetype.whenToUse}</p>
                    </div>

                    {/* Examples */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Inspired By</h3>
                      <div className="flex flex-wrap gap-2">
                        {archetype.examples.map((example, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Typical Colors</h3>
                      <div className="flex gap-2">
                        {archetype.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-12 h-12 rounded-lg border-2 border-white/20"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handlePrimarySelect(archetype.id)
                        setShowDetail(null)
                      }}
                      className="mt-8 w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                    >
                      Use This Archetype
                    </button>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

---

### **2. Archetype Constants**

**File:** `lib/constants.ts` (add to existing file)

```typescript
export const STYLE_ARCHETYPES = [
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    icon: '🔮',
    description: 'Apple-style modern depth with frosted glass effects and layered transparency',
    characteristics: [
      'Frosted glass surfaces with backdrop blur',
      'Soft shadows and subtle depth',
      'Light, airy color palettes',
      'Smooth rounded corners (16-24px)',
      'Delicate borders and overlays'
    ],
    whenToUse: 'SaaS products, productivity tools, fintech apps, modern startups wanting sophisticated tech aesthetic',
    examples: ['Apple macOS', 'iOS design', 'Linear', 'Notion', 'Figma UI'],
    colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#3B82F6', '#8B5CF6'],
    preview: '/previews/glassmorphism.mp4'
  },
  {
    id: 'bold_minimalism',
    name: 'Bold Minimalism',
    icon: '⚡',
    description: 'Stripe-style high contrast with generous white space and confident typography',
    characteristics: [
      'Pure white backgrounds (#FFFFFF)',
      'High contrast text (black on white)',
      'Large bold typography (48-84px headlines)',
      'Generous spacing (80-160px margins)',
      'Minimal color accent (single brand color)'
    ],
    whenToUse: 'Payment processors, financial services, B2B SaaS, enterprise software, brands wanting authority and trust',
    examples: ['Stripe', 'Vercel', 'Linear', 'Apple website', 'Coinbase'],
    colors: ['#FFFFFF', '#000000', '#635BFF', '#F6F9FC', '#0A2540'],
    preview: '/previews/bold-minimalism.mp4'
  },
  {
    id: 'dark_energetic',
    name: 'Dark Energetic',
    icon: '🌌',
    description: 'Cyberpunk tech energy with black backgrounds and neon accent lighting',
    characteristics: [
      'Pure black backgrounds (#000000)',
      'Neon accent colors (cyan, purple, gold)',
      'Edge lighting and rim glow effects',
      '3D elements with dramatic lighting',
      'Particle systems and ambient motion'
    ],
    whenToUse: 'Gaming, music production, tech startups, crypto/web3, developer tools, creative industries',
    examples: ['Stripe Sessions', 'Raycast', 'Arc Browser', 'Blade Runner aesthetic'],
    colors: ['#000000', '#00FFFF', '#9D00FF', '#FFD700', '#FF0040'],
    preview: '/previews/dark-energetic.mp4'
  },
  {
    id: '3d_product',
    name: '3D Product Showcase',
    icon: '📦',
    description: 'Premium 3D rendered products with cinematic lighting and dramatic shadows',
    characteristics: [
      'Photorealistic 3D renders',
      'Cinematic lighting (three-point setup)',
      'Dramatic shadows and depth',
      'Smooth camera rotations',
      'Premium materials (metal, glass, fabric)'
    ],
    whenToUse: 'Physical products, hardware, luxury goods, fashion, consumer electronics',
    examples: ['Apple product pages', 'finguard.com', 'Sonos', 'Dyson'],
    colors: ['#F5F5F5', '#2C2C2C', '#E0E0E0', '#1A1A1A', '#FFD700'],
    preview: '/previews/3d-product.mp4'
  },
  {
    id: 'soft_organic',
    name: 'Soft Organic',
    icon: '🌸',
    description: 'Cozy warmth with curved shapes, muted colors, and gentle textures',
    characteristics: [
      'Soft curved corners (24-40px)',
      'Muted warm color palettes',
      'Fabric and paper textures',
      'Gentle shadows (soft blur)',
      'Rounded, friendly shapes'
    ],
    whenToUse: 'Kids products, wellness, family services, handmade goods, cozy consumer brands',
    examples: ['Jellycat', 'Teddy Wear', 'Maileg', 'Sunday morning aesthetic'],
    colors: ['#FAF8F3', '#E0A899', '#B8C5B0', '#4A4238', '#F2E8D5'],
    preview: '/previews/soft-organic.mp4'
  },
  {
    id: 'editorial_luxury',
    name: 'Editorial Luxury',
    icon: '📰',
    description: 'Vogue-style sophisticated layouts with generous space and refined typography',
    characteristics: [
      'Generous white space (30-50% empty)',
      'Editorial serif typography',
      'Asymmetric layouts with intention',
      'High-quality photography (full-bleed)',
      'Restrained color (black, white, single accent)'
    ],
    whenToUse: 'Fashion, luxury brands, architecture, design studios, high-end services, art galleries',
    examples: ['Vogue', 'Kinfolk', 'Another Escape', 'COS', 'Ssense'],
    colors: ['#FFFFFF', '#000000', '#F5F5F5', '#8B7355', '#2C2C2C'],
    preview: '/previews/editorial-luxury.mp4'
  },
  {
    id: 'brutalism',
    name: 'Brutalism',
    icon: '🏗️',
    description: 'Raw anti-design with exposed structure and intentional roughness',
    characteristics: [
      'Visible grid systems',
      'Raw HTML aesthetics',
      'Monospace typography',
      'Intentional "ugliness"',
      'No gradients or rounded corners'
    ],
    whenToUse: 'Avant-garde brands, art projects, anti-establishment messaging, experimental studios',
    examples: ['Balenciaga early 2020s', 'Bloomberg', 'Craigslist aesthetic intentionally'],
    colors: ['#FFFFFF', '#000000', '#FF0000', '#0000FF', '#FFFF00'],
    preview: '/previews/brutalism.mp4'
  },
  {
    id: 'bento_box',
    name: 'Bento Box',
    icon: '🍱',
    description: 'Apple features-style cards arranged in grid with contained sections',
    characteristics: [
      'Grid-based card layouts',
      'Rounded cards (20-32px)',
      'Each card is self-contained feature',
      'Soft shadows and subtle depth',
      'Clean hierarchy within cards'
    ],
    whenToUse: 'Feature showcases, comparison pages, service listings, product catalogs',
    examples: ['Apple iPhone features', 'iOS App Store', 'Notion templates'],
    colors: ['#F5F5F5', '#FFFFFF', '#007AFF', '#34C759', '#FF3B30'],
    preview: '/previews/bento-box.mp4'
  },
  {
    id: 'maximalism',
    name: 'Maximalism',
    icon: '🎨',
    description: 'Abundant layered richness with bold colors and decorative elements',
    characteristics: [
      'Rich, saturated color palettes',
      'Layered textures and patterns',
      'Decorative illustrations',
      'Abundant visual details',
      'Playful, expressive typography'
    ],
    whenToUse: 'Entertainment, festivals, food & beverage, creative agencies, youth brands',
    examples: ['Spotify Wrapped', 'Mailchimp rebrand', 'Dropbox creative'],
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8DADC', '#F4A261'],
    preview: '/previews/maximalism.mp4'
  },
  {
    id: 'neumorphism',
    name: 'Neumorphism',
    icon: '🎚️',
    description: 'Tactile embossed interfaces with soft shadows simulating depth',
    characteristics: [
      'Soft extruded elements',
      'Subtle shadow combinations (light + dark)',
      'Minimal color variation',
      'Tactile, pressable appearance',
      'Soft, matte finish'
    ],
    whenToUse: 'Smart home interfaces, IoT dashboards, audio/music apps, settings panels',
    examples: ['Smart home apps', 'Audio mixing interfaces', 'iOS calculator aesthetic'],
    colors: ['#E0E5EC', '#A3B1C6', '#FFFFFF', '#D1D9E6', '#F0F0F3'],
    preview: '/previews/neumorphism.mp4'
  },
]
```

---

## ✅ **PHASE 3 CHECKLIST:**

- [ ] Archetype selector page created
- [ ] Grid of 10 archetypes displays
- [ ] Each card shows preview (icon placeholder for now)
- [ ] Hover effects work (card lifts)
- [ ] Clicking card selects it (blue ring)
- [ ] Detail modal opens on "View Details"
- [ ] Hybrid mode toggle works
- [ ] Secondary archetype selection works
- [ ] Ratio slider works (50-90 range)
- [ ] Selection summary displays correctly
- [ ] Data saves to database
- [ ] Redirects to reference upload page
- [ ] Mobile responsive

---

## 🎨 **OPTIONAL ENHANCEMENTS:**

**1. Animated Previews:**
Replace icon placeholders with actual preview videos:
```typescript
<video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src={archetype.preview} type="video/mp4" />
</video>
```

**2. Smart Hybrid Suggestions:**
Recommend good hybrid combinations:
```typescript
const RECOMMENDED_HYBRIDS = {
  'dark_energetic': ['editorial_luxury', '3d_product'],
  'soft_organic': ['editorial_luxury', 'bento_box'],
  // ...
}
```

---

## 🚀 **AFTER PHASE 3 IS COMPLETE:**

Test:
1. User can select primary archetype
2. User can enable hybrid mode
3. User can select secondary archetype
4. User can adjust ratio slider
5. Data saves correctly to database
6. Redirects to `/project/[id]/references`

**Then proceed to PHASE 4: REFERENCE IMAGE UPLOAD**

---

**END OF PHASE 3 PROMPT**
