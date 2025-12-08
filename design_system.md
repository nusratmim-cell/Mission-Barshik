# Shikho Design System

A comprehensive design system for building web platforms with the Shikho brand identity. This document provides all the specifications, components, and guidelines needed to create consistent user interfaces.

---

## 🎯 QUICK REFERENCE - DESIGN TOKENS

### Border Radius
| Element | Value | Tailwind Class |
|---------|-------|----------------|
| **Buttons** | 8px | `rounded-[8px]` |
| **Input fields** | 8px | `rounded-[8px]` |
| **Select dropdowns** | 8px | `rounded-[8px]` |
| **Cards** | 12px | `rounded-xl` |
| **Promo code box** | 12px | `rounded-xl` |
| **Toast notifications** | 9999px (pill) | `rounded-full` |
| **Background blobs** | 9999px | `rounded-full` |
| **Error alerts** | 8px | `rounded-lg` |

### Fonts
| Font Family | CSS Variable | Usage | Weights |
|-------------|--------------|-------|---------|
| **Baloo Da 2** | `font-baloo` | Headings, buttons, display text, card titles | 400, 500, 600, **700** |
| **Hind Siliguri** | `font-hind` | Body text, form inputs, labels, select items | 300, 400, **500**, 600, 700 |
| **Geist Sans** | `font-sans` | Fallback, system text | - |
| **Monospace** | `font-mono` | Promo codes, technical text | - |

### Component Heights
| Element | Height | Tailwind Class |
|---------|--------|----------------|
| **Input fields** | 48px | `h-12` |
| **Select trigger** | 48px | `h-12` |
| **Primary buttons** | 48px | `h-12` |
| **Small buttons** | 36px | `h-9` |
| **Large buttons** | 44px | `h-11` |
| **XL buttons** | 56px | `h-14` |
| **Default buttons** | 40px | `h-10` |

### Spacing System
| Spacing | Value | Common Usage |
|---------|-------|--------------|
| **Form field gap** | 8px | `gap-[8px]` - Between label and input |
| **Form item spacing** | 24px | `space-y-6` - Between form fields |
| **Card padding** | 24px | `p-6` - Internal card padding |
| **Section spacing** | 32px | `space-y-8` - Between page sections |
| **Footer top margin** | 48px | `mt-12` - Footer separation |
| **Logo gap** | 16px | `gap-4` - Between partner logos |
| **Button icon gap** | 8px | `mr-2` - Icon to text spacing |

### Container Widths
| Width | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| **Form/Card max** | 448px | `max-w-md` | Forms, cards, modals |
| **Small container** | 384px | `max-w-sm` | Compact content areas |
| **Partner logo** | 100px | `w-[100px]` | Logo containers |
| **Background blob** | 256px | `w-64 h-64` | Decorative elements |

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Installation & Setup](#installation--setup)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Border Radius](#border-radius)
7. [Shadows](#shadows)
8. [Components](#components)
9. [Animations](#animations)
10. [Form Patterns](#form-patterns)
11. [Page Layout Patterns](#page-layout-patterns)
12. [Icons](#icons)
13. [Responsive Design](#responsive-design)
14. [Accessibility](#accessibility)
15. [Code Examples](#code-examples)

---

## Tech Stack

### Core Framework
```json
{
  "next": "16.0.6",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "typescript": "^5"
}
```

### Styling
```json
{
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4",
  "tw-animate-css": "^1.4.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0"
}
```

### UI Components
```json
{
  "@radix-ui/react-label": "^2.1.8",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-slot": "^1.2.4"
}
```

### Animation
```json
{
  "framer-motion": "^12.23.25",
  "canvas-confetti": "^1.9.4"
}
```

### Form Handling
```json
{
  "react-hook-form": "^7.67.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.1.13"
}
```

### Icons
```json
{
  "lucide-react": "^0.555.0"
}
```

---

## Installation & Setup

### 1. Create Next.js Project
```bash
npx create-next-app@latest my-project --typescript --tailwind --eslint --app --src-dir=false
```

### 2. Install Dependencies
```bash
npm install @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge
npm install framer-motion canvas-confetti @types/canvas-confetti
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react
npm install tw-animate-css
```

### 3. Configure shadcn/ui
Create `components.json` in your project root:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### 4. Create Utility Function
Create `lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Color Palette

### Brand Colors (Shikho)

| Name | CSS Variable | RGB Value | Hex | Usage |
|------|--------------|-----------|-----|-------|
| Primary | `--color-shikho-primary` | rgb(71, 93, 255) | #475dff | Primary actions, links, focus states |
| Primary Hover | `--color-shikho-primary-hover` | rgb(84, 104, 255) | #5468ff | Hover state for primary |
| CTA | `--color-shikho-cta` | rgb(207, 39, 141) | #cf278d | Call-to-action buttons, highlights |
| CTA Light | `--color-shikho-cta-light` | rgb(255, 236, 250) | #ffecfa | Light backgrounds, subtle accents |
| Heading | `--color-shikho-heading` | rgb(45, 71, 151) | #2d4797 | Headings, important text |
| Dark | `--color-shikho-dark` | rgb(35, 44, 106) | #232c6a | Dark text, labels |
| Muted | `--color-shikho-muted` | rgb(69, 76, 126) | #454c7e | Placeholder text, secondary info |
| Secondary Text | `--color-shikho-secondary-text` | rgb(103, 110, 160) | #676ea0 | Footer text, captions |
| Border | `--color-shikho-border` | rgb(208, 222, 239) | #d0deef | Input borders, dividers |

### System Colors (Light Mode)

| Name | CSS Variable | Value | Usage |
|------|--------------|-------|-------|
| Background | `--background` | oklch(1 0 0) | Page background |
| Foreground | `--foreground` | oklch(0.145 0 0) | Default text |
| Card | `--card` | oklch(1 0 0) | Card backgrounds |
| Card Foreground | `--card-foreground` | oklch(0.145 0 0) | Card text |
| Primary | `--primary` | oklch(0.205 0 0) | Primary UI elements |
| Primary Foreground | `--primary-foreground` | oklch(0.985 0 0) | Text on primary |
| Secondary | `--secondary` | oklch(0.97 0 0) | Secondary backgrounds |
| Muted | `--muted` | oklch(0.97 0 0) | Muted backgrounds |
| Muted Foreground | `--muted-foreground` | oklch(0.556 0 0) | Muted text |
| Destructive | `--destructive` | oklch(0.577 0.245 27.325) | Error states |
| Border | `--border` | oklch(0.922 0 0) | Default borders |
| Input | `--input` | oklch(0.922 0 0) | Input borders |
| Ring | `--ring` | oklch(0.708 0 0) | Focus rings |

### CSS Variables Configuration
Add to `app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');

@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: 'Baloo Da 2', cursive, var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-baloo: 'Baloo Da 2', cursive;
  --font-hind: 'Hind Siliguri', sans-serif;
  --color-shikho-primary: rgb(71, 93, 255);
  --color-shikho-primary-hover: rgb(84, 104, 255);
  --color-shikho-cta: rgb(207, 39, 141);
  --color-shikho-cta-light: rgb(255, 236, 250);
  --color-shikho-heading: rgb(45, 71, 151);
  --color-shikho-dark: rgb(35, 44, 106);
  --color-shikho-muted: rgb(69, 76, 126);
  --color-shikho-secondary-text: rgb(103, 110, 160);
  --color-shikho-border: rgb(208, 222, 239);
  
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## Typography

### Font Families

| Font | CSS Variable | Usage |
|------|--------------|-------|
| Baloo Da 2 | `font-baloo` | Headings, buttons, display text |
| Hind Siliguri | `font-hind` | Body text, form inputs, paragraphs |
| Geist Sans | `font-sans` | Fallback sans-serif |
| Geist Mono | `font-mono` | Code, technical text |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Subtle text (Hind Siliguri only) |
| Regular | 400 | Body text |
| Medium | 500 | Labels, emphasis |
| Semibold | 600 | Subheadings |
| Bold | 700 | Headings, important CTAs |

### Font Sizes

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 0.75rem (12px) | Captions, fine print |
| `text-sm` | 0.875rem (14px) | Secondary text, labels |
| `text-base` | 1rem (16px) | Body text |
| `text-lg` | 1.125rem (18px) | Large body, button text |
| `text-xl` | 1.25rem (20px) | Card titles |
| `text-2xl` | 1.5rem (24px) | Section headings |
| `text-3xl` | 1.875rem (30px) | Page headings |

### Typography Examples
```tsx
// Heading
<h1 className="text-3xl font-bold text-shikho-heading font-baloo">
  Page Heading
</h1>

// Subheading
<h2 className="text-xl font-bold text-shikho-heading font-baloo">
  Section Title
</h2>

// Body text
<p className="text-base text-shikho-dark font-hind">
  Body paragraph text
</p>

// Muted text
<p className="text-sm text-shikho-muted">
  Secondary information
</p>

// Label
<label className="text-sm font-medium text-shikho-dark">
  Form Label
</label>
```

---

## Spacing & Layout

### Spacing Scale
Use Tailwind's default spacing scale:

| Class | Value | Pixels |
|-------|-------|--------|
| `p-1` / `m-1` | 0.25rem | 4px |
| `p-2` / `m-2` | 0.5rem | 8px |
| `p-3` / `m-3` | 0.75rem | 12px |
| `p-4` / `m-4` | 1rem | 16px |
| `p-6` / `m-6` | 1.5rem | 24px |
| `p-8` / `m-8` | 2rem | 32px |
| `p-12` / `m-12` | 3rem | 48px |

### Common Spacing Patterns

| Pattern | Classes | Usage |
|---------|---------|-------|
| Form field gap | `gap-[8px]` | Between label and input |
| Form spacing | `space-y-6` | Between form fields |
| Card padding | `p-6` | Internal card spacing |
| Card header | `p-6 pb-2` | Card header padding |
| Section spacing | `space-y-8` | Between page sections |
| Footer margin | `mt-12` | Footer top margin |
| Link gap | `gap-4` | Between footer links |

### Container Widths

| Class | Width | Usage |
|-------|-------|-------|
| `max-w-sm` | 24rem (384px) | Compact content areas |
| `max-w-md` | 28rem (448px) | Forms, cards |
| `w-full` | 100% | Full width elements |

---

## Border Radius

### Radius Scale

| Variable | Calculation | Pixels | Usage |
|----------|-------------|--------|-------|
| `--radius` | 0.625rem | 10px | Base radius |
| `--radius-sm` | calc(0.625rem - 4px) | 6px | Small elements |
| `--radius-md` | calc(0.625rem - 2px) | 8px | Inputs, buttons |
| `--radius-lg` | 0.625rem | 10px | Cards |
| `--radius-xl` | calc(0.625rem + 4px) | 14px | Large cards |

### Common Border Radius Classes

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-[8px]` | 8px | Inputs, buttons, select |
| `rounded-md` | 6px | Small buttons |
| `rounded-lg` | 10px | Cards, dropdowns |
| `rounded-xl` | 14px | Feature cards |
| `rounded-2xl` | 16px | Large decorative elements |
| `rounded-full` | 9999px | Pills, badges, avatars |

---

## Shadows

### Shadow Classes

| Class | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation |
| `shadow-card` | Card components (custom) |
| `shadow-md` | Dropdowns, popovers |
| `shadow-lg` | CTA buttons, modals |
| `shadow-xl` | CTA button hover state |

### Button Shadow Pattern
```tsx
// CTA button with shadow transition
<button className="shadow-lg hover:shadow-xl transition-all duration-300">
  Click me
</button>
```

---

## Components

### Button Component

Create `components/ui/button.tsx`:
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-baloo",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        cta: "bg-shikho-cta text-white hover:bg-shikho-cta/90 rounded-[8px] font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300",
        "cta-light": "bg-shikho-cta-light text-shikho-cta hover:bg-shikho-cta-light/80 rounded-[8px] font-medium text-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### Button Usage Examples
```tsx
// Primary CTA button
<Button variant="cta" size="xl" className="w-full">
  Submit Form
</Button>

// Light CTA button
<Button variant="cta-light">
  Secondary Action
</Button>

// Outline button with custom colors
<Button
  variant="outline"
  className="gap-2 hover:bg-shikho-primary/5 hover:text-shikho-primary border-shikho-primary/20"
>
  <Icon className="h-4 w-4" />
  Button with Icon
</Button>

// Loading state
<Button variant="cta" disabled>
  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
  Loading...
</Button>
```

### Input Component

Create `components/ui/input.tsx`:
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[8px] border border-shikho-border bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-shikho-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shikho-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-hind",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

#### Input Specifications
- Height: 48px (`h-12`)
- Border radius: 8px (`rounded-[8px]`)
- Border color: `border-shikho-border`
- Focus ring: `ring-shikho-primary`
- Placeholder color: `text-shikho-muted`
- Font: Hind Siliguri (`font-hind`)

### Select Component

Create `components/ui/select.tsx`:
```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-12 w-full items-center justify-between rounded-[8px] border border-shikho-border bg-white px-3 py-2 text-base ring-offset-background placeholder:text-shikho-muted focus:outline-none focus:ring-2 focus:ring-shikho-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 font-hind",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-hind",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
}
```

### Card Component

Create `components/ui/card.tsx`:
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

#### Card Usage Example
```tsx
<Card className="w-full max-w-md mx-auto border-shikho-border shadow-card">
  <CardHeader>
    <CardTitle className="text-xl font-bold text-center text-shikho-heading font-baloo">
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

### Label Component

Create `components/ui/label.tsx`:
```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-tight m-0 p-0 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

---

## Animations

### Framer Motion Patterns

#### Page Entry Animation
```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

#### Spring Animation (Cards, Modals)
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ 
    type: "spring",
    stiffness: 260,
    damping: 20,
    delay: 0.2 
  }}
>
  {/* Content */}
</motion.div>
```

#### Hover/Tap Interactions
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  {/* Interactive element */}
</motion.div>
```

#### Staggered Entry
```tsx
<motion.div
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.5 }}
>
  {/* Content */}
</motion.div>
```

#### AnimatePresence for Conditional Rendering
```tsx
import { AnimatePresence } from "framer-motion"

<AnimatePresence>
  {showElement && (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
    >
      {/* Conditional content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Confetti Animation

Create `components/ui/confetti.tsx`:
```tsx
"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

export function Confetti() {
  useEffect(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#475dff', '#cf278d', '#ff0000', '#ffd700']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#475dff', '#cf278d', '#ff0000', '#ffd700']
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return null
}
```

### CSS Gradient Animation
Add to your CSS:
```css
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}
```

Usage:
```tsx
<div className="h-2 bg-gradient-to-r from-shikho-primary via-shikho-cta to-shikho-primary animate-gradient-x" />
```

---

## Form Patterns

### Form Component with React Hook Form

Create `components/ui/form.tsx`:
```tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("flex flex-col gap-[8px]", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn("m-0 p-0", error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive m-0 p-0", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
}
```

### Zod Validation Schema Pattern
```typescript
import { z } from 'zod';

// Bangladesh phone number validation
const bangladeshPhoneRegex = /^01[3-9]\d{8}$/;

export const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters')
    .trim(),
  
  phone: z
    .string()
    .regex(bangladeshPhoneRegex, 'Enter a valid phone number (01XXXXXXXXX)')
    .transform(val => val.replace(/\s+/g, '')),
  
  // Enum field
  category: z
    .enum(['option1', 'option2', 'option3'], {
      message: 'Please select an option'
    }),

  // Optional field with conditional requirement
  optionalField: z.string().optional(),
}).superRefine((data, ctx) => {
  // Conditional validation
  if (data.category === 'option1' && !data.optionalField) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "This field is required when option1 is selected",
      path: ["optionalField"],
    });
  }
});

export type FormInput = z.infer<typeof formSchema>;
```

### Complete Form Example
```tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { formSchema, type FormInput } from "@/lib/validations/form"

export function MyForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    mode: 'onChange', // Enable instant validation
    defaultValues: {
      name: "",
      phone: "",
      category: undefined,
    },
  })

  async function onSubmit(data: FormInput) {
    setIsLoading(true)
    setError(null)

    try {
      // Submit logic here
      console.log(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto border-shikho-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center text-shikho-heading font-baloo">
            Form Title
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-shikho-dark font-medium">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-shikho-dark font-medium">Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="01XXXXXXXXX" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-shikho-dark font-medium">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="cta"
                className="w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

---

## Page Layout Patterns

### Main Page Layout
```tsx
export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-shikho-cta-light flex flex-col items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-shikho-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-shikho-cta rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-md space-y-8 z-10 relative">
        {/* Page content here */}
      </div>
      
      <footer className="mt-12 text-center text-sm text-shikho-muted z-10">
        <p>© {new Date().getFullYear()} Company Name</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/privacy" className="hover:text-shikho-primary transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="/terms" className="hover:text-shikho-primary transition-colors">Terms of Service</a>
        </div>
      </footer>
    </main>
  );
}
```

### Root Layout
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

### Partner Logos Component
```tsx
import Image from 'next/image';

export const PartnerLogos = () => {
  return (
    <div className="flex justify-center items-center gap-4 mb-4">
      <div className="flex items-center justify-center w-[100px]">
        <Image
          src="/logo1.png"
          alt="Partner 1 Logo"
          width={100}
          height={50}
          className="w-full h-auto object-contain"
        />
      </div>
      
      <div className="text-lg font-bold text-shikho-muted">x</div>
      
      <div className="flex items-center justify-center w-[100px]">
        <Image
          src="/logo2.png"
          alt="Partner 2 Logo"
          width={100}
          height={50}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};
```

---

## Icons

### Icon Library: Lucide React

Import icons from `lucide-react`:
```tsx
import { 
  Loader2,     // Loading spinner
  Check,       // Checkmark
  ChevronDown, // Dropdown arrow
  ChevronUp,   // Up arrow
  Copy,        // Copy action
  Sparkles,    // Celebration/highlight
  X,           // Close
  ArrowRight,  // Navigation
  AlertCircle, // Warning/Error
} from "lucide-react"
```

### Icon Sizes

| Size | Classes | Usage |
|------|---------|-------|
| Small | `h-3.5 w-3.5` | Select indicators |
| Default | `h-4 w-4` | Buttons, inline icons |
| Medium | `h-5 w-5` | Loading spinners |
| Large | `h-6 w-6` | Feature icons |

### Icon Usage Pattern
```tsx
// In button
<Button>
  <Icon className="mr-2 h-4 w-4" />
  Button Text
</Button>

// Loading state
<Loader2 className="h-5 w-5 animate-spin" />

// With opacity
<ChevronDown className="h-4 w-4 opacity-50" />
```

---

## Responsive Design

### Mobile-First Approach
This design system follows a mobile-first approach. All base styles are designed for mobile, with breakpoints used to enhance the layout for larger screens.

### Breakpoints

| Prefix | Min Width | Usage |
|--------|-----------|-------|
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

### Responsive Patterns
```tsx
// Container with max width
<div className="w-full max-w-md mx-auto">

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Hide on mobile, show on desktop
<div className="hidden md:block">

// Show on mobile, hide on desktop
<div className="md:hidden">
```

---

## Accessibility

### Focus States
All interactive elements have visible focus states:
```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

For brand-colored focus:
```css
focus-visible:ring-shikho-primary
```

### ARIA Attributes
Forms include proper ARIA attributes:
```tsx
aria-describedby={formDescriptionId}
aria-invalid={!!error}
```

### Disabled States
```css
disabled:pointer-events-none
disabled:opacity-50
disabled:cursor-not-allowed
```

### Color Contrast
- Primary text on white: `text-shikho-dark` (contrast ratio > 4.5:1)
- Secondary text: `text-shikho-muted` (contrast ratio > 4.5:1)
- Error text: `text-destructive` (contrast ratio > 4.5:1)

---

## Code Examples

### Complete Page Example
```tsx
"use client"

import { motion } from "framer-motion"
import { PartnerLogos } from "@/components/partner-logos"
import { MyForm } from "@/components/my-form"

export default function CampaignPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-shikho-cta-light flex flex-col items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-shikho-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-shikho-cta rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 z-10 relative"
      >
        <PartnerLogos />
        <MyForm />
      </motion.div>
      
      <footer className="mt-12 text-center text-sm text-shikho-muted z-10">
        <p>© {new Date().getFullYear()} Your Company</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/privacy" className="hover:text-shikho-primary transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-shikho-primary transition-colors">
            Terms of Service
          </a>
        </div>
      </footer>
    </main>
  )
}
```

### Success/Celebration Page Pattern
```tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Confetti } from "@/components/ui/confetti"

interface SuccessCardProps {
  code: string
  message: string
  validUntil: string
}

export function SuccessCard({ code, message, validUntil }: SuccessCardProps) {
  const [copied, setCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setShowToast(true)
      setTimeout(() => {
        setCopied(false)
        setShowToast(false)
      }, 2500)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Confetti />
      
      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span className="font-medium text-sm">Copied! ✨</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2 
        }}
      >
        <Card className="border-shikho-border shadow-card overflow-hidden relative">
          {/* Gradient decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-shikho-primary via-shikho-cta to-shikho-primary animate-gradient-x" />
          
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CardTitle className="text-3xl font-bold text-shikho-cta font-baloo mb-2">
                Congratulations! 🎉
              </CardTitle>
              <p className="text-shikho-muted font-medium">{message}</p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-shikho-primary to-shikho-cta rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200" />
              <div className="relative bg-white border-2 border-dashed border-shikho-primary/30 rounded-xl p-6 text-center">
                <p className="text-sm text-shikho-muted mb-1 font-medium">Your Code</p>
                <h2 className="text-3xl font-bold text-shikho-primary tracking-wider font-mono mb-4">
                  {code}
                </h2>
                
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="gap-2 hover:bg-shikho-primary/5 hover:text-shikho-primary border-shikho-primary/20"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center space-y-4"
            >
              <div className="bg-shikho-cta-light/50 rounded-lg p-4">
                <p className="text-sm text-shikho-dark">
                  Valid until <span className="font-bold">{validUntil}</span>
                </p>
              </div>

              <Button
                className="w-full bg-shikho-primary hover:bg-shikho-primary-hover text-white h-12 text-lg rounded-[8px] shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.open('https://example.com', '_blank')}
              >
                Continue to App
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
```

---

## Quick Reference

### Tailwind Class Cheatsheet

| Category | Classes |
|----------|---------|
| Background gradient | `bg-gradient-to-b from-white to-shikho-cta-light` |
| Card styling | `border-shikho-border shadow-card rounded-xl` |
| Form input | `h-12 rounded-[8px] border-shikho-border font-hind` |
| CTA button | `bg-shikho-cta text-white rounded-[8px] shadow-lg hover:shadow-xl` |
| Primary button | `bg-shikho-primary hover:bg-shikho-primary-hover text-white` |
| Heading text | `text-shikho-heading font-baloo font-bold` |
| Body text | `text-shikho-dark font-hind` |
| Muted text | `text-shikho-muted` |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-shikho-primary` |
| Center layout | `flex flex-col items-center justify-center` |
| Max width container | `w-full max-w-md mx-auto` |

### File Structure
```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── label.tsx
│   │   ├── form.tsx
│   │   └── confetti.tsx
│   └── [feature]/
│       └── [component].tsx
├── lib/
│   ├── utils.ts
│   ├── config/
│   │   └── [config].ts
│   └── validations/
│       └── [schema].ts
├── public/
│   └── [assets]
├── components.json
├── package.json
└── tsconfig.json
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial design system documentation |

---

This design system is optimized for Shikho brand web platforms. Use this document as a reference when building new features or pages to maintain consistency across the application.