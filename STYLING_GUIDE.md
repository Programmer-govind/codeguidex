# CodeGuideX Premium Styling - Quick Reference Guide

## 🎨 Color Palette

### Primary Colors
```css
Primary:   hsl(249, 75%, 60%)   /* Violet */
Secondary: hsl(217, 91%, 60%)   /* Blue */
Accent:    hsl(280, 80%, 60%)   /* Purple */
```

### Semantic Colors
```css
Success: hsl(142, 71%, 45%)     /* Green */
Warning: hsl(38, 92%, 50%)      /* Amber */
Error:   hsl(0, 84%, 60%)       /* Red */
```

## 🎭 Component Styling Guide

### 1. Buttons

```tsx
// Primary - Gradient with glow
<button className="btn-primary">
  Primary Action
</button>

// Secondary - Subtle with border
<button className="btn-secondary">
  Secondary Action
</button>

// Outline - Bordered, fills on hover
<button className="btn-outline">
  Optional Action
</button>

// Gradient - Shimmer effect
<button className="btn-gradient">
  Special Action
</button>
```

**Features:**
- ✨ Hover lift animation (2px up)
- 🌈 Gradient overlays
- 💫 Shadow expansion on hover
- ⚡ Ripple effect on click
- 🎯 Focus rings for accessibility

### 2. Cards

```tsx
// Basic glass card
<div className="glass-card p-6">
  Content
</div>

// Premium glass (enhanced blur)
<div className="glass-premium p-8">
  Premium Content
</div>

// Hover lift card
<div className="card-hover-lift glass-card">
  Liftable Content
</div>
```

**Features:**
- 🪟 Backdrop blur (12-20px)
- 💎 Semi-transparent backgrounds
- ✨ Layered shadows
- 🎪 Hover lift (-8px, scale 1.02)
- 🌓 Dark mode variants

### 3. Inputs

```tsx
// Premium input
<input className="input-field" placeholder="Enter text..." />

// Form group
<div className="form-group">
  <label className="form-label">Name</label>
  <input className="form-input" />
  <p className="form-error">Error message</p>
</div>
```

**Features:**
- 🎯 Focus ring (blue glow)
- 🌫️ Subtle glassmorphism
- 🔄 Smooth transitions
- 📱 Touch-friendly sizing

### 4. Badges

```tsx
import { Badge } from '@/components/ui/Badge';

<Badge label="New" variant="primary" size="sm" />
<Badge label="Success" variant="success" size="md" />
<Badge label="Warning" variant="warning" size="lg" />
<Badge label="Tag" variant="info" size="md" removable onRemove={() => {}} />
```

**Variants:** primary, secondary, success, warning, error, info  
**Sizes:** sm, md, lg

**Features:**
- 🌈 Gradient backgrounds
- 🔘 Rounded pill shape
- ❌ Optional remove button
- 🎭 Hover scale effect

### 5. Alerts/Messages

```tsx
import { ErrorMessage } from '@/components/common/ErrorMessage';

<ErrorMessage 
  type="success" 
  message="Operation completed!"
  onDismiss={() => {}}
/>
<ErrorMessage type="error" message="Something went wrong" />
<ErrorMessage type="warning" message="Please be careful" />
<ErrorMessage type="info" message="Did you know..." />
```

**Features:**
- 🎨 Type-specific colors
- 🖼️ Custom SVG icons
- 📦 Glassmorphism background
- ❌ Dismissible
- 🎬 Fade-in animation

### 6. Loading Spinners

```tsx
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Small inline
<LoadingSpinner size="sm" />

// Medium with message
<LoadingSpinner size="md" message="Loading data..." />

// Full page modal
<LoadingSpinner size="lg" message="Please wait..." fullPage />
```

**Features:**
- 🌈 Multi-color gradient spinner
- ✨ Inner glow effect
- 💫 Pulse animation
- 📱 Full-page modal variant
- 🌓 Dark mode support

## 🎬 Animation Classes

### Fade Animations
```tsx
<div className="animate-fade-in">           {/* Fades in */}
<div className="animate-fade-in-delay">     {/* Delayed 0.2s */}
<div className="animate-fade-in-delay-2">   {/* Delayed 0.4s */}
```

### Slide Animations
```tsx
<div className="animate-slide-in-up">      {/* Slides up */}
<div className="animate-slide-in-right">   {/* Slides from left */}
```

### Scale Animations
```tsx
<div className="animate-scale-up">         {/* Scales from 0.9 to 1 */}
```

### Infinite Animations
```tsx
<div className="animate-float">            {/* Floats up/down */}
<div className="animate-pulse-glow">       {/* Pulsing glow */}
<div className="shimmer">                  {/* Shimmer effect */}
```

## 🎨 Text Utilities

### Gradient Text
```tsx
<h1 className="text-gradient">Primary Gradient</h1>
<h1 className="text-gradient-blue">Blue Gradient</h1>
<h1 className="text-gradient-purple">Purple Gradient</h1>
<h1 className="text-gradient-pink">Pink Gradient</h1>
<h1 className="text-gradient-gold">Gold Gradient</h1>
```

### Neon Effect
```tsx
<h1 className="neon-glow">Glowing Text</h1>
```

## 📦 Layout Utilities

### Containers
```tsx
<div className="container">              {/* Max-width with padding */}
<div className="section-wrapper">        {/* Section spacing */}
```

### Auth Pages
```tsx
<div className="auth-container">         {/* Full-height centered */}
  <div className="auth-card">            {/* Premium auth card */}
    {/* Form content */}
  </div>
</div>
```

## 🌈 Background Utilities

### Gradient Backgrounds
```tsx
<div className="bg-gradient-radial">     {/* Radial gradient */}
<div className="bg-gradient-mesh">       {/* Mesh gradient */}
<div className="bg-grid-pattern">        {/* Grid pattern */}
```

## 🎯 Interactive States

### Transitions
```tsx
<div className="transition-smooth">      {/* Smooth all transitions */}
```

### Focus
```tsx
<input className="focus-ring" />         {/* Premium focus ring */}
```

### Hover Effects
```tsx
<div className="card-hover-lift">        {/* Lifts on hover */}
```

## 💡 Usage Tips

### Combining Classes
```tsx
// Glassmorphism card with animation
<div className="glass-card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-smooth animate-fade-in">
  Content here
</div>

// Premium button with icon
<button className="btn-primary px-6 py-3 flex items-center gap-2">
  <svg className="w-5 h-5">...</svg>
  Click Me
</button>

// Gradient heading with animation
<h1 className="text-4xl font-bold text-gradient animate-slide-in-up">
  Welcome
</h1>
```

### Dark Mode
All utilities support dark mode via the `.dark` class:
```tsx
<div className="bg-white dark:bg-gray-800">
  <p className="text-gray-900 dark:text-white">Text</p>
</div>
```

### Responsive Design
Use Tailwind breakpoints:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

## 🎨 Component Composition Examples

### Premium Feature Card
```tsx
<div className="glass-card p-8 rounded-2xl group hover:shadow-2xl transition-all">
  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
    <svg className="w-8 h-8 text-white">...</svg>
  </div>
  <h3 className="text-2xl font-bold text-gray-900 mb-3">Title</h3>
  <p className="text-gray-600 mb-6">Description text here.</p>
  <button className="btn-primary">Learn More</button>
</div>
```

### Stats Card with Icon
```tsx
<div className="glass-card p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
      <svg className="w-6 h-6 text-white">...</svg>
    </div>
    <span className="text-2xl">📊</span>
  </div>
  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Label</p>
  <p className="text-2xl font-bold text-gray-900">1,234</p>
</div>
```

### Premium Form Field
```tsx
<div className="form-group">
  <label htmlFor="email" className="form-label">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    className="input-field"
    placeholder="you@example.com"
  />
  <p className="text-xs text-gray-500 mt-1">
    We'll never share your email.
  </p>
</div>
```

---

## 🚀 Quick Start Checklist

✅ Import components from `@/components/ui/`  
✅ Use utility classes from `globals.css`  
✅ Add animations for better UX  
✅ Include dark mode variants  
✅ Test on multiple screen sizes  
✅ Ensure accessibility (focus states, ARIA labels)  

**Happy Coding! 🎉**
