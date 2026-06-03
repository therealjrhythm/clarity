# DESIGN.md — Aesthetic Engine v4.0

> **Purpose:** This file is a dynamic design intelligence system for AI agents and design applications. It helps an AI understand the brand, ask the right questions, infer a visual direction, propose creative options, get approval when needed, then generate beautiful interfaces that feel intentional, fresh, useful, accessible, and brand-specific.
>
> This file can also act as the design brain for an app such as **Clarity** — an all-in-one design direction tool that turns raw ideas into color stories, typography systems, layout directions, motion language, art direction, design tokens, and production-ready UI.

---

# 0. Prime Directive

The AI must not immediately generate brand-specific UI unless the user explicitly asks for immediate output.

The AI must first understand:

1. What is being designed?
2. Who is it for?
3. What should the user feel?
4. What action should the user take?
5. What category, industry, or cultural space does it belong to?
6. Does the brand already have colors, fonts, references, or a defined visual identity?
7. What should the design avoid?
8. What would make this design feel ownable rather than generic?

The AI must make design decisions before making visual decorations.

The goal is not simply to make something look polished.

The goal is to make something feel **appropriate, intentional, fresh, useful, and human-designed**.

---

# 1. Approval Gate

## 1.1 When to Activate the Approval Gate

Activate the Approval Gate when the request involves:

- Brand identity
- E-commerce
- Marketing site
- Landing page
- Public-facing website
- Campaign page
- Visual system
- Product design system
- Portfolio
- Lifestyle, fashion, beauty, wellness, food, media, gaming, music, or entertainment
- Any app or site where color, typography, mood, tone, and emotion matter

## 1.2 When Not to Slow Down

Do not slow the user down with excessive questions when the request is:

- A quick prototype
- An internal admin tool
- A wireframe
- A bug fix
- A simple component
- A technical demo
- A utility screen
- A low-stakes concept

In these cases, infer a thoughtful direction, briefly state the chosen direction, and proceed.

## 1.3 Approval Gate Process

For brand-sensitive projects, follow this sequence:

```yaml
approval_gate:
  step_1: "Interpret brand cues"
  step_2: "Ask whether existing colors, fonts, references, or brand guidelines exist"
  step_3: "If missing, propose 3 color story options"
  step_4: "If missing, propose 3 typography options using suitable Google Fonts"
  step_5: "Recommend one combined direction"
  step_6: "Ask the user to approve, modify, or choose another option"
  step_7: "Only after approval, generate the UI/design/code"
```

## 1.4 Fast Approval Variant

If the user says:

- "just make it"
- "you decide"
- "use your judgment"
- "give me options"
- "move fast"
- "proceed"

Then infer the design direction and provide a concise summary before generating.

Example:

```markdown
I’m proceeding with:
- Color Story: Heirloom Honey
- Typography: Fraunces + Nunito Sans
- Layout: Editorial commerce split hero
- Motion: Luxury fade with subtle playful spring
- Material: Soft paper editorial

Generating now.
```

---

# 2. Consultative Design Intake

## 2.1 Required Brand Questions

Before designing a brand-specific interface, ask:

1. Do you already have a color story, brand colors, or visual palette?
2. Do you already have preferred fonts or an existing typography system?
3. Do you have visual references you want interpreted for mood, color, layout, typography, or motion?
4. Who is the target audience?
5. What should the brand feel like?

Keep questions concise. Do not overwhelm the user.

## 2.2 Brand Personality Choices

If the user does not know how to describe the brand, offer options:

```yaml
brand_traits:
  - playful
  - high-end
  - nostalgic
  - modern
  - soft
  - bold
  - editorial
  - minimal
  - whimsical
  - premium
  - futuristic
  - warm
  - technical
  - rebellious
  - calm
  - trustworthy
  - cinematic
  - youthful
  - mature
  - artistic
  - utilitarian
```

## 2.3 Brand Cue Interpretation

Infer meaning from the brand name, product type, audience, category, and price positioning.

Example:

```yaml
brand_name: "Teddy Wear"
product: "upscale teddy bear clothing brand"
inferred_traits:
  - playful
  - soft
  - nostalgic
  - high-end
  - giftable
  - tactile
  - warm
design_risk:
  - "too childish"
  - "too generic luxury"
  - "too beige and lifeless"
  - "too much teddy iconography"
design_goal:
  - "playful luxury"
  - "soft premium"
  - "collectible charm"
  - "fashion-forward but emotionally warm"
```

---

# 3. AI Design Brief

For any substantial UI request, internally create a design brief before generating:

```yaml
design_brief:
  product_type: ""
  brand_name: ""
  audience: ""
  emotional_goal: ""
  primary_action: ""
  brand_archetype:
    primary: ""
    secondary: ""
  style_mode: ""
  palette_family: ""
  typography_mode: ""
  layout_composition: ""
  spacing_mode: ""
  motion_language: ""
  art_direction: ""
  shape_language: ""
  texture_direction: ""
  density: ""
  material_depth: ""
  voice: ""
  conversion_strategy: ""
  responsive_strategy: ""
  accessibility_notes: ""
  reference_interpretation: ""
  avoid: []
```

---

# 4. Brand Archetype System

The AI must identify the brand archetype before choosing visuals.

## 4.1 Archetypes

| Archetype | Feeling | Design Cues |
| :--- | :--- | :--- |
| The Atelier | refined, crafted, premium | serif type, muted color, generous spacing, tactile details |
| The Playground | joyful, creative, youthful | rounded forms, playful color, springy motion |
| The Operator | efficient, precise, powerful | dense layouts, mono type, sharp hierarchy |
| The Sanctuary | calm, wellness, soft | organic colors, low contrast, airy spacing |
| The Stage | bold, expressive, cultural | dramatic typography, contrast, editorial layouts |
| The Lab | futuristic, experimental | grids, glass, glow, technical details |
| The Heritage House | timeless, established | classic type, restrained palette, formal rhythm |
| The Club | nightlife, music, social | dark color, neon accents, rhythm, motion |
| The Studio | creative, polished, thoughtful | neutral base, expressive accents, flexible layouts |
| The Utility | simple, functional, clear | minimal styling, direct hierarchy, accessible controls |

## 4.2 Archetype Blending

Most strong brands are a blend of two archetypes.

Example:

```yaml
brand_archetype:
  primary: "The Atelier"
  secondary: "The Playground"
  emotional_balance:
    premium: 70
    playful: 30
```

Use the primary archetype to control restraint. Use the secondary archetype to add personality.

---

# 5. Dynamic Color Story Picker

The AI must not reuse a single default palette. It must create a color story based on brand meaning, audience, product category, emotional goal, and references.

## 5.1 Color Story Inputs

```yaml
color_story_inputs:
  brand_name: ""
  product_category: ""
  audience: ""
  price_positioning: "budget | mid-market | premium | luxury"
  emotional_traits: []
  brand_archetype: ""
  cultural_cues: []
  seasonal_cues: []
  material_cues: []
  references: []
  accessibility_needs: []
```

## 5.2 Color Theory Rules

- Use warm palettes for softness, comfort, nostalgia, food, wellness, childhood, and tactility.
- Use cool palettes for trust, technology, focus, calm, security, and precision.
- Use high contrast for performance, gaming, finance, accessibility, and dramatic luxury.
- Use low contrast for softness, wellness, editorial calm, and premium minimalism.
- Use muted saturation for luxury, heritage, editorial, and refined brands.
- Use higher saturation for youth, play, entertainment, games, creator tools, and social apps.
- Use one dominant neutral, one emotional support color, one primary accent, one secondary accent, and one functional set.
- Avoid using more than two saturated colors as major brand colors unless the brand is intentionally playful or maximalist.
- Luxury does not always mean black and gold.
- Playful does not always mean bright primary colors.
- Technical does not always mean blue and purple.
- Wellness does not always mean sage green.
- Premium children’s or teddy-themed brands should feel soft, tactile, warm, and collectible without becoming cartoonish.

## 5.3 Required Palette Output Format

When color direction is unclear, provide three options:

```yaml
palette_option:
  name: ""
  best_for: ""
  emotional_read: ""
  color_roles:
    background: ""
    surface: ""
    surface_elevated: ""
    primary_text: ""
    secondary_text: ""
    muted_text: ""
    primary_accent: ""
    secondary_accent: ""
    highlight: ""
    border: ""
    success: ""
    warning: ""
    danger: ""
  why_it_works: ""
  watch_out: ""
```

## 5.4 Palette Variation Rule

If generating multiple projects, do not reuse the same palette family unless the user asks for consistency.

Vary at least two of:

- Color temperature
- Accent hue
- Background lightness
- Saturation level
- Material opacity
- Glow color
- Border color
- Typography pairing

---

# 6. Dynamic Typography Picker

The AI must ask if the user has fonts. If not, propose font systems based on brand personality.

## 6.1 Required Font Question

Ask:

> Do you already have brand fonts, or would you like me to suggest Google Fonts that fit the direction?

## 6.2 Google Fonts Rule

The AI may suggest any suitable Google Font, not only a small fixed list.

Select fonts based on:

- Brand personality
- Product category
- Audience
- Price positioning
- Readability needs
- Visual references
- Language support
- UI density
- Emotional tone

## 6.3 Typography Direction Output Format

```yaml
typography_option:
  name: ""
  heading_font: ""
  body_font: ""
  accent_font: ""
  mono_font: ""
  best_for: ""
  emotional_read: ""
  why_it_works: ""
  watch_out: ""
```

## 6.4 Type System Rules

- Display headings carry personality.
- Body text must remain readable.
- Data-heavy UIs may use mono fonts for metrics, timestamps, and labels.
- Luxury interfaces should use fewer weights and more restraint.
- Playful interfaces may use rounded or expressive type, but not at the cost of readability.
- Editorial interfaces can use dramatic type contrast.
- Dashboards should prioritize clarity over personality.
- Do not default to Inter for every project.

---

# 7. Visual Hierarchy System

The AI must define what matters most before laying out the interface.

## 7.1 Hierarchy Model

```yaml
visual_hierarchy:
  primary_focus: ""
  secondary_focus: ""
  tertiary_focus: ""
  supporting_elements: []
  quiet_elements: []
  repeated_elements: []
  conversion_elements: []
```

## 7.2 Hierarchy Rules

- One element should clearly dominate each screen or section.
- CTAs should be visually obvious but not always loud.
- Supporting content should not compete with the hero message.
- Navigation should usually be quieter than the main action.
- Data-heavy screens should use size, weight, color, and spacing to create scanability.
- Avoid making every card, button, and label equally prominent.
- Use contrast intentionally: scale, color, spacing, depth, motion, and typography.

---

# 8. Layout Composition System

Choose layout based on purpose, not habit.

## 8.1 Core Layout Modes

| Layout Mode | Use For | Characteristics |
| :--- | :--- | :--- |
| Centered Launch | SaaS launches, simple tools | centered headline, subtext, CTA, product visual below |
| Split Product | apps, commerce, product sites | left copy, right product visual |
| Editorial Left | luxury, fashion, thought leadership | left-aligned, wide whitespace, strong type |
| Immersive Full-Canvas | games, AI tools, creative products | full-screen atmosphere, layered UI |
| Dashboard Proof | SaaS and analytics | interface shown immediately as proof |
| Commerce Feature | retail/product | product image first, concise copy, strong visual story |
| Magazine Grid | editorial/culture | asymmetry, strong image/type rhythm |
| Command Center | operations/data tools | dense but organized, status-driven |
| Spatial Workspace | design/AI/creative apps | floating panels, canvas, docks, inspectors |

## 8.2 Hero Alignment Rules

- Centered heroes are not always appropriate.
- Split heroes are strong for commerce and app products.
- Editorial left heroes are strong for luxury and thought leadership.
- Dashboard-first heroes are strong when the product UI is the proof.
- Immersive full-canvas heroes are strong for games, AI, creative tools, and cinematic launches.
- The hero should make the product, promise, and action clear quickly.

---

# 9. Spacing and Rhythm System

Spacing is a core design decision, not a finishing detail.

## 9.1 Spacing Modes

| Spacing Mode | Feeling | Use For |
| :--- | :--- | :--- |
| Airy Editorial | premium, calm, confident | luxury, fashion, beauty, wellness |
| Balanced Product | clear, commercial, usable | SaaS, e-commerce, apps |
| Dense Operational | powerful, efficient, data-heavy | dashboards, finance, admin |
| Playful Modular | friendly, energetic | kids, creator tools, social |
| Cinematic Wide | immersive, dramatic | games, launches, film/music |
| Magazine Rhythm | expressive, cultural | editorial, art, music |

## 9.2 Spacing Rules

- Large margins can signal confidence and luxury.
- Tight spacing can signal utility, speed, or density.
- Repetition creates system.
- Intentional breaks create emphasis.
- Section rhythm should vary enough to avoid monotony.
- Cards and grids should use consistent internal padding.
- Mobile spacing should be tighter but still breathable.

---

# 10. Art Direction System

The AI must decide how visuals should feel, not only where they go.

## 10.1 Art Direction Inputs

```yaml
art_direction:
  photography_style: ""
  illustration_style: ""
  lighting: ""
  composition: ""
  product_visualization: ""
  human_presence: ""
  background_style: ""
  props: []
  avoid: []
```

## 10.2 Image Direction Choices

Consider:

- Photography vs illustration vs 3D render vs abstract graphics
- Studio vs lifestyle
- Bright vs moody
- Editorial crop vs catalog clarity
- Product-only vs human presence
- Close-up texture vs full object silhouette
- Natural light vs dramatic artificial light
- Flat lay vs model shot vs environment

## 10.3 Art Direction Example

```yaml
brand: "Teddy Wear"
photography_style: "warm editorial product photography"
lighting: "soft natural window light"
background: "cream paper, honey-toned textiles, wooden props"
composition: "close-up tactile details plus centered product moments"
avoid:
  - "cartoon teddy overload"
  - "cheap nursery stock imagery"
  - "overly saturated children’s colors"
```

---

# 11. Shape Language

Every brand should have a shape language.

## 11.1 Shape Modes

| Shape Language | Feeling |
| :--- | :--- |
| Soft Rounded | friendly, warm, approachable |
| Sharp Technical | precise, serious, advanced |
| Organic | natural, wellness, handmade |
| Geometric | modern, structured, clean |
| Pill-Based | app-like, friendly, accessible |
| Hard Editorial | bold, serious, cultural |
| Ornamental | heritage, luxury, crafted |
| Tactile Soft-Solid | premium, touchable, product-like |

## 11.2 Shape Rules

- Rounded does not always mean playful; it can also mean premium softness.
- Sharp does not always mean luxury; it can also feel cold or technical.
- Shape language should match typography and color.
- Avoid mixing too many radius styles without purpose.
- Buttons, cards, inputs, badges, and modals should feel related.

---

# 12. Texture and Material Direction

Texture gives digital design emotional depth.

## 12.1 Texture Modes

| Texture | Use For |
| :--- | :--- |
| Paper Grain | editorial, luxury, warm commerce |
| Fabric / Knit | fashion, tactile products, cozy brands |
| Glass | futuristic, cinematic, AI, HUDs |
| Metal / Chrome | music, performance, luxury tech |
| Clay / Soft Matte | wellness, friendly apps, education |
| Halftone / Print | editorial, culture, music |
| CRT / Scanline | retro, gaming, technical |
| Gradient Mesh | AI, creator tools, expressive SaaS |
| Ink / Letterpress | heritage, craft, publishing |
| None / Flat | utility, brutalism, performance |

## 12.2 Material Modes

| Material Mode | Use For | Treatment |
| :--- | :--- | :--- |
| Glassmorphism | futuristic, cinematic, HUDs | blur, transparency, light borders |
| Soft Solid | SaaS, productivity, commerce | solid surfaces, subtle borders, gentle shadows |
| Paper Editorial | editorial, luxury, blogs | warm backgrounds, ink-like type, minimal shadow |
| Tactile Neumorphic | controls, creative tools | raised/inset dual shadows |
| Holographic | games, AI, sci-fi | scanlines, glow, transparent panels |
| Brutalist Flat | art, experimental, fashion | high contrast, hard edges |
| Warm Commerce | lifestyle retail | soft cards, warm shadows, product clarity |

---

# 13. Motion and Animation System

Motion must match the personality of the product.

## 13.1 Motion Modes

| Mode | Duration | Feeling | Use For |
| :--- | :--- | :--- | :--- |
| Luxury Fade | 400-700ms | calm, premium | luxury, wellness, editorial |
| SaaS Crisp | 150-250ms | quick, efficient | dashboards, productivity |
| Game Pulse | 80-180ms | reactive, energetic | games, HUDs |
| Playful Spring | 300-500ms | delightful, bouncy | social, kids, creator tools |
| Editorial Reveal | 600-900ms | cinematic, composed | storytelling pages |
| Technical Scan | 100-300ms | mechanical, precise | HUDs, security, AI systems |
| Ambient Drift | 8000ms+ | subtle, atmospheric | landing pages, immersive worlds |

## 13.2 Animation Types

Consider:

- Scroll-linked storytelling
- Micro-interaction feedback
- Morphing UI
- Physics-based movement
- Cinematic reveals
- Reactive/live interfaces
- Ambient background motion
- Loading states
- Success/error feedback
- Reduced-motion alternatives

## 13.3 Motion Rules

- Animation should support meaning, not distract.
- Hover states should be subtle for luxury and stronger for gaming/playful products.
- Dashboards should avoid excessive motion.
- Game interfaces may pulse, scan, flicker, or react quickly.
- Luxury interfaces should move slowly and quietly.
- Always respect reduced-motion preferences.

---

# 14. Interaction State System

Professional design includes all states, not only the default screen.

## 14.1 Required States

Define styles for:

- Default
- Hover
- Active/pressed
- Focus
- Disabled
- Loading
- Empty
- Error
- Success
- Selected
- Dragging
- Expanded/collapsed

## 14.2 Interaction Model

```yaml
interaction_model:
  hover: ""
  pressed: ""
  focus: ""
  loading: ""
  success: ""
  error: ""
  empty_state: ""
  selected_state: ""
```

Example:

```yaml
brand: "Teddy Wear"
hover: "soft lift with warm shadow"
pressed: "slight compression"
focus: "visible honey outline"
loading: "soft pulsing bear-paw motif"
success: "gentle checkmark with warm fade"
error: "calm terracotta message, not harsh red"
```

---

# 15. Voice and Copy Direction

Design includes language.

## 15.1 Voice Model

```yaml
voice:
  tone: ""
  sentence_style: ""
  words_to_use: []
  words_to_avoid: []
  headline_style: ""
  cta_style: ""
```

## 15.2 Voice Rules

- Luxury copy should be restrained and specific.
- Playful copy should be charming but not childish unless appropriate.
- Technical copy should be precise and clear.
- SaaS copy should state value quickly.
- Wellness copy should be calm, supportive, and non-alarmist.
- Commerce copy should reduce purchase anxiety.
- Avoid generic AI phrases and empty hype.

Example:

```yaml
brand: "Teddy Wear"
tone: "warm, premium, lightly whimsical"
sentence_style: "short emotional headlines with gentle supporting copy"
words_to_use:
  - "heirloom"
  - "soft"
  - "keepsake"
  - "little wardrobe"
  - "gift-ready"
  - "beloved"
words_to_avoid:
  - "cheap"
  - "toy store"
  - "adorbs"
  - "kidsy"
  - "revolutionary"
```

---

# 16. Conversion Strategy

For public-facing websites and commerce, design must support action.

## 16.1 Conversion Model

```yaml
conversion_strategy:
  primary_action: ""
  secondary_action: ""
  trust_builders: []
  possible_objections: []
  required_sections: []
  proof_points: []
  friction_reducers: []
```

## 16.2 Conversion Rules

- Make the primary action obvious.
- Repeat CTAs at natural decision points.
- Use trust builders near purchase or signup moments.
- Address likely objections before they block conversion.
- Show the product clearly before asking for commitment.
- Avoid vague CTAs when a specific action is better.
- Commerce should include product clarity, pricing, shipping/returns, size/fit, and social proof where appropriate.
- SaaS should include product proof, use cases, integrations, security, pricing, and testimonials where appropriate.

---

# 17. Responsive Behavior

Do not simply shrink desktop designs. Recompose them.

## 17.1 Responsive Model

```yaml
responsive_behavior:
  desktop: ""
  tablet: ""
  mobile:
    navigation: ""
    hero: ""
    cards: ""
    CTA: ""
    motion: ""
    density: ""
```

## 17.2 Responsive Rules

- Desktop can use multi-column storytelling.
- Tablet should simplify complex layouts.
- Mobile should prioritize content order and thumb-friendly actions.
- Minimum tap target should generally be 44px.
- Avoid tiny labels and crowded card grids on mobile.
- Consider sticky CTAs for commerce or conversion-heavy flows.
- Reduce decorative motion on smaller devices.
- Preserve hierarchy even when stacking.

---

# 18. Accessibility Requirements

Beautiful design must still be usable.

## 18.1 Required Accessibility Checks

The AI should consider:

- Color contrast
- Readable font sizes
- Keyboard focus states
- Screen reader labels
- Reduced-motion support
- Touch target size
- Avoiding color-only communication
- Form labels and errors
- Semantic HTML
- Responsive readability
- Localization and longer text support

## 18.2 Accessibility Rules

- Body text should generally be 16px or larger.
- Interactive elements should have visible focus states.
- Do not rely only on red/green for status.
- Use semantic buttons and links.
- Respect `prefers-reduced-motion`.
- Avoid low-contrast trendy gray text.
- Decorative visuals should not block comprehension.

---

# 19. Reference Interpretation Rules

References are allowed and encouraged, but must be interpreted intelligently.

## 19.1 Use References To Extract

- Mood
- Color temperature
- Material quality
- Typography personality
- Spacing density
- Composition rhythm
- Lighting direction
- Animation style
- Level of detail
- Emotional tone
- Interaction patterns

## 19.2 Do Not Blindly Copy

- Exact layout
- Exact color palette
- Exact assets
- Exact text
- Exact component arrangement
- Watermarked or proprietary UI
- Brand-specific identity elements

## 19.3 Reference Translation Prompt

Use this behavior:

> Extract the design principles from the reference — depth, rhythm, lighting, material, mood, typography, interaction, and spatial density. Do not clone the reference. Use it as mood direction, then generate an original interface appropriate to the product.

---

# 20. Anti-Repetition Rule

The AI must actively avoid making every project look the same.

## 20.1 Anti-Repetition Checklist

For every new project, vary at least three of:

- Palette family
- Background lightness
- Accent hue
- Typography mood
- Layout composition
- Spacing density
- Shape language
- Material mode
- Motion language
- Art direction
- Texture direction
- Icon style

## 20.2 Repetition Warnings

Avoid defaulting to:

- Dark glass UI
- Indigo/purple gradients
- Inter as the default font
- Centered SaaS heroes
- Generic Bento cards
- Floating orbs for every product
- Same card radius and shadow system
- Same nav/hero/feature/CTA structure
- Generic AI copy

Freshness comes from matching the design system to the brand and context.

---

# 21. Template Recipes

Templates are starting points, not final styles.

## 21.1 Bento

Use Bento when showcasing multiple features or product capabilities.

Rules:

- Vary card spans.
- Use hierarchy, not equal-weight boxes.
- Material and palette must follow the design brief.
- Avoid generic glass cards unless appropriate.

## 21.2 Dashboard

Use dashboards when the user needs clarity, monitoring, or decisions.

Rules:

- Prioritize hierarchy and scanability.
- Use color sparingly for status and change.
- Use precise data typography.
- Avoid decorative motion.
- Define empty, loading, success, and error states.

## 21.3 Game HUD

Use game HUDs when the user needs quick situational awareness.

Rules:

- Use dense but readable layout.
- Prioritize status, targeting, map, inventory, and controls.
- Motion can be reactive and energetic.
- Palette should match the game world, not generic SaaS.

## 21.4 Website / Landing Page

Use landing pages when persuasion and story matter.

Rules:

- Choose hero composition based on product.
- Use section rhythm: hero, proof, benefits, details, CTA.
- Typography carries brand personality.
- Motion should reveal hierarchy.

## 21.5 E-Commerce

Use e-commerce when product clarity and purchase confidence matter.

Rules:

- Show product clearly.
- Include pricing, variants, fit/size, shipping, returns, and reviews where appropriate.
- Use product imagery as a primary design element.
- Reduce purchase anxiety.
- Make add-to-cart and checkout actions obvious.

## 21.6 Calendar / Planning

Use calendars when time, scheduling, or planning are primary.

Rules:

- Use clear date hierarchy.
- Events should be scannable.
- Color should encode category, not decoration.
- Spacing must support quick comprehension.

## 21.7 Design / Creative App

Use spatial workspace layouts for design and AI creative tools.

Rules:

- Use canvas, panels, docks, and inspectors.
- Keep workspace controls accessible but not overwhelming.
- Support project states, exports, history, and previews.
- Make the user feel oriented and in control.

---

# 22. Design Tokens and Export Format

When a direction is approved, generate structured tokens.

## 22.1 Token Categories

```yaml
tokens:
  color:
    background: ""
    surface: ""
    surface_elevated: ""
    text_primary: ""
    text_secondary: ""
    text_muted: ""
    accent_primary: ""
    accent_secondary: ""
    border: ""
    success: ""
    warning: ""
    danger: ""
  typography:
    heading_font: ""
    body_font: ""
    mono_font: ""
    scale: {}
    weights: {}
  spacing:
    xs: ""
    sm: ""
    md: ""
    lg: ""
    xl: ""
    section: ""
  radius:
    sm: ""
    md: ""
    lg: ""
    xl: ""
    full: "999px"
  shadow:
    soft: ""
    lifted: ""
    inset: ""
  motion:
    fast: ""
    base: ""
    slow: ""
    easing: ""
  layout:
    max_width: ""
    grid_columns: ""
    gutter: ""
```

## 22.2 CSS Variable Example

```css
:root {
  --color-background: #F7EFE3;
  --color-surface: #FFF9F1;
  --color-text-primary: #2D241C;
  --color-text-secondary: #7D6A58;
  --color-accent-primary: #B9824A;

  --font-heading: "Fraunces", Georgia, serif;
  --font-body: "Nunito Sans", system-ui, sans-serif;

  --radius-card: 32px;
  --space-section: 96px;

  --motion-fast: 160ms;
  --motion-base: 240ms;
  --motion-slow: 600ms;
}
```

---

# 23. Clarity App Brain Format

This system can power an app called Clarity.

## 23.1 Clarity Purpose

Clarity helps users move from vague idea to clear design direction.

```text
Prompt
  ↓
Brand Understanding
  ↓
Approval Gate
  ↓
Color Stories
  ↓
Typography Systems
  ↓
Layout Direction
  ↓
Art Direction
  ↓
Motion + Interaction
  ↓
Design Tokens
  ↓
UI Generation
  ↓
Export
```

## 23.2 Clarity Project Object

```json
{
  "project": {
    "name": "",
    "type": "",
    "audience": "",
    "goal": "",
    "primaryAction": "",
    "status": "intake | options | approved | generated | exported"
  },
  "brand": {
    "traits": [],
    "archetype": {
      "primary": "",
      "secondary": ""
    },
    "avoid": []
  },
  "colorStory": {
    "selected": "",
    "options": []
  },
  "typography": {
    "selected": "",
    "options": []
  },
  "layout": {
    "mode": "",
    "spacing": "",
    "density": ""
  },
  "artDirection": {
    "photography": "",
    "illustration": "",
    "texture": "",
    "shapeLanguage": ""
  },
  "motion": {
    "mode": "",
    "interactionModel": {}
  },
  "conversion": {
    "primaryAction": "",
    "trustBuilders": [],
    "objections": []
  },
  "tokens": {},
  "exports": {
    "designMd": true,
    "cssVariables": true,
    "tokensJson": true,
    "tailwindConfig": false,
    "htmlPrototype": false,
    "reactPrototype": false
  }
}
```

## 23.3 Clarity MVP Flow

1. User creates a project.
2. Clarity asks brand intake questions.
3. Clarity generates three color stories.
4. Clarity generates three typography systems.
5. Clarity recommends a direction.
6. User approves or edits.
7. Clarity generates design tokens.
8. Clarity generates a landing page, app screen, dashboard, or design system preview.
9. User exports `DESIGN.md`, CSS variables, JSON tokens, or code.

---

# 24. Master Prompt for AI Agents

Use this instruction when generating UI:

> Before designing, infer the product type, audience, emotional goal, primary action, brand archetype, style mode, palette family, typography mode, layout composition, spacing rhythm, art direction, motion language, interaction model, conversion strategy, responsive behavior, and accessibility needs. If this is brand-sensitive work, activate the Approval Gate: ask whether colors, fonts, or references exist; if missing, propose three color stories and three typography directions, recommend one, and get approval before generating. Do not default to the same palette, typography, layout, or glass style. Use references only to extract principles, not to copy. Generate a design that feels appropriate, fresh, intentional, accessible, and human-designed.