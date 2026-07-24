# ADYSRE

The most complete **React UI component library** for **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**.

Build modern websites, SaaS products, dashboards, landing pages, admin panels, AI applications, eCommerce stores, startup websites, and business applications faster with hundreds of production-ready UI components, icons, design assets, and developer utilities.

ADYSRE combines a powerful design system with reusable React components, beautiful icons, CSS gradients, patterns, textures, color palettes, and UI primitives—all designed for speed, accessibility, and developer experience.

> ⚡ Build beautiful interfaces in minutes, not days.

---

## Why ADYSRE?

- 🚀 780+ production-ready React sections & page blocks
- 🎨 448 handcrafted SVG icons
- 🌈 102 professionally curated color palettes
- ✨ 78 modern CSS gradients
- 🔲 50 pure CSS patterns
- 🧩 28 SVG textures
- ⚙️ 9 reusable UI primitives
- 💯 TypeScript-first
- 🌳 Tree-shakeable ESM
- ♿ Accessible components
- 📱 Responsive by default
- ⚡ Optimized for Next.js, Vite, Remix & Astro
- 🎯 React 18 & React 19 compatible

---

## What's Included?

| Category | Count | Description |
|----------|------:|------------|
| UI Sections & Blocks | **780** | Hero, Navbar, Footer, CTA, Features, Pricing, FAQ, Team, Testimonials, Contact, Dashboard, Authentication, Tables, Calendars, Carousels, Blogs, Statistics, Marketing, SaaS, AI Landing Pages and more |
| Icons | **448** | Original SVG icons with customizable size, stroke and color |
| Color Palettes | **102** | Beautiful color systems with accessibility helpers |
| CSS Gradients | **78** | Linear, Radial and Conic gradients |
| CSS Patterns | **50** | Dots, Grid, Waves, Blueprint, Lines, Checkerboard, Crosshatch and more |
| SVG Textures | **28** | Grain, Paper, Noise, Carbon, Fabric, Mesh and more |
| UI Components | **9** | Button, Card, Input, Badge, Dialog, Tooltip, Select, Label, Textarea |

---

## Perfect For

ADYSRE is built for developers creating:

- Landing Pages
- SaaS Applications
- AI Platforms
- Startup Websites
- Dashboards
- CRM Systems
- Admin Panels
- Portfolio Websites
- Agency Websites
- Blogs
- Marketing Websites
- Authentication Pages
- eCommerce Stores
- Business Applications
- Internal Tools
- Design Systems

---

# Installation

```bash
npm install adysre
```

or

```bash
pnpm add adysre
```

or

```bash
yarn add adysre
```

---

# Tailwind CSS Setup

## Tailwind CSS v4 (Recommended)

Import ADYSRE into your global stylesheet.

```css
@import "tailwindcss";
@import "adysre/styles.css";
```

This automatically:

- loads ADYSRE design tokens
- registers utility classes
- enables all component styles
- configures Tailwind scanning

---

## Without Tailwind

Import the precompiled stylesheet once.

```tsx
import "adysre/dist.css";
```

---

Dark mode follows the standard `.dark` class and works perfectly with:

- next-themes
- shadcn/ui
- Tailwind Dark Mode
- custom implementations

---

# Quick Start

```tsx
import {
  Button,
  Card,
  cn
} from "adysre";

import {
  ArrowUpRight,
  Search
} from "adysre/icons";

import {
  GradientSurface
} from "adysre/gradients";

import {
  PatternSurface
} from "adysre/patterns";

import {
  TextureSurface
} from "adysre/textures";

import {
  AboutStats,
  PricingThreeTier
} from "adysre/blocks";
```

---

# UI Blocks

ADYSRE includes hundreds of reusable website sections.

Examples include:

- Hero Sections
- Pricing Sections
- Testimonials
- Team Sections
- FAQ
- Contact Forms
- Feature Grids
- Statistics
- Logos
- Blog Layouts
- Authentication
- Dashboards
- Admin Components
- Tables
- Calendars
- Carousels
- Marketing Sections
- AI Landing Pages
- Startup Templates

Every block is:

- Fully typed
- Responsive
- Accessible
- Customizable
- Production ready

Example:

```tsx
import { AboutStats } from "adysre/blocks";

<AboutStats
  kicker="By the Numbers"
  title="Trusted by companies worldwide"
  stats={[
    {
      label: "Customers",
      value: "12K+"
    },
    {
      label: "Projects",
      value: "3,400"
    },
    {
      label: "Countries",
      value: "42"
    }
  ]}
/>
```

Need only one component?

```tsx
import { AboutStats } from "adysre/blocks/about-stats";
```

Deep imports reduce bundle size and improve development performance.

---

# Icons

ADYSRE includes 448 handcrafted SVG icons.

```tsx
import { ArrowUpRight } from "adysre/icons";

<ArrowUpRight />

<ArrowUpRight
  size={32}
  strokeWidth={2}
/>

<ArrowUpRight
  className="text-blue-600"
  aria-label="Open"
/>
```

Features:

- SVG
- Tree-shakeable
- Accessible
- currentColor support
- TypeScript
- Adjustable size
- Adjustable stroke width

Dynamic lookup:

```tsx
import {
  Icon,
  getIcon
} from "adysre/icons";

<Icon name="ArrowUpRight" />
```

---

# Gradients

Beautiful CSS gradients without images.

```tsx
import {
  GradientSurface
} from "adysre/gradients";

<GradientSurface
  gradient="warm-flame"
  className="rounded-xl h-64"
/>
```

Utilities:

- getGradient()
- gradientToCss()
- gradientToStyle()

---

# CSS Patterns

Create modern backgrounds using pure CSS.

```tsx
import {
  PatternSurface
} from "adysre/patterns";

<PatternSurface
  pattern="blueprint-grid"
/>
```

Includes:

- Grid
- Dot
- Wave
- Checkerboard
- Blueprint
- Crosshatch
- Diagonal Lines

---

# SVG Textures

Add subtle visual depth.

```tsx
import {
  TextureSurface
} from "adysre/textures";

<TextureSurface
  texture="ink-noise"
/>
```

Available textures:

- Noise
- Grain
- Carbon
- Paper
- Fabric
- Mesh
- Ink

---

# Color Utilities

```tsx
import {
  getPalette,
  readableText,
  harmony,
  contrastRatio
} from "adysre/palettes";

readableText("#2563eb");

contrastRatio("#111827", "#ffffff");

harmony("#2563eb", "triadic");
```

Perfect for:

- Theme generation
- Accessibility
- WCAG compliance
- Design systems

---

# Performance

ADYSRE is built for speed.

✔ Tree-shakeable

✔ ES Modules

✔ TypeScript

✔ Zero runtime configuration

✔ Deep imports

✔ Minimal bundle size

✔ Server Components compatible

✔ React Server Components friendly

✔ Optimized for production

---

# Optional Animation

Animated blocks use Framer Motion.

Install only if needed.

```bash
npm install framer-motion
```

```tsx
import { FadeInOnScroll } from "adysre/blocks/fade-in-on-scroll";
```

---

# Requirements

- React 18+
- React 19 Supported
- TypeScript
- Node.js 20+
- ES Modules

Compatible with:

- Next.js
- React
- Vite
- Remix
- Astro

---

# Documentation

Documentation includes:

- Installation Guide
- Component Examples
- API Reference
- Playground
- Blocks Gallery
- Icons Gallery
- Color Palettes
- Gradients
- Patterns
- Textures
- Accessibility Guide
- Migration Guides

---

# Roadmap

Upcoming releases include:

- Figma Plugin
- Theme Builder
- Visual Block Editor
- AI Page Generator
- Component Generator
- Motion Library
- Charts
- Advanced Forms
- Charts & Analytics
- CMS Blocks

---

# License

MIT License

© ADYSRE

All icons are original artwork created exclusively for ADYSRE and are not redistributed from any third-party icon library.

---

## Keywords

React UI Components • Next.js Components • React Component Library • Tailwind CSS Components • React Icons • UI Kit • Dashboard Components • Landing Page Components • SaaS Components • Admin Dashboard • TypeScript UI Library • CSS Gradients • SVG Icons • Design System • React Design System • Next.js UI Kit • Modern UI Components • Accessible Components • Responsive Components • AI Website Components • Startup UI Kit