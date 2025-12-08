# Shikho YouTube Lead Generation Platform - Technical Plan

## 📋 Overview

This document outlines the technical architecture and implementation plan for a lead generation platform that will be embedded under YouTube videos. The platform collects student information, verifies via OTP, and provides access to class-specific Google Drive resources.

---

## 🎯 User Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY                                   │
└─────────────────────────────────────────────────────────────────────────┘

   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │   YouTube    │───►│  Lead Form   │───►│    OTP       │───►│   Success    │
   │   Video      │    │  Collection  │    │ Verification │    │   + Links    │
   └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
         │                    │                   │                   │
         │                    │                   │                   │
         ▼                    ▼                   ▼                   ▼
   User clicks URL     Enters:              Receives SMS        Shows Drive
   under video         - Name               with 4-digit        link for
                       - Phone              OTP code            their class
                       - Class (C5/C8/C12)
                       - Group (C12 only)
```

---

## 🏗️ Architecture

### Route Structure

Each step in the flow is a separate page for better navigation and state management:

```
Lead Form Pages:
/class/c5              → Lead form for Class 5 students
/class/c8              → Lead form for Class 8 students
/class/c12             → Lead form for Class 12 students (includes batch selection)

OTP Verification Pages:
/class/c5/verify       → OTP verification for Class 5
/class/c8/verify       → OTP verification for Class 8
/class/c12/verify      → OTP verification for Class 12

Success Pages:
/class/c5/success      → Success + Drive links for Class 5
/class/c8/success      → Success + Drive links for Class 8
/class/c12/success     → Success + Drive links for Class 12
```

### Component Hierarchy

```
app/
├── layout.tsx                    # Root layout with Shikho fonts & styles
├── page.tsx                      # Redirect or landing page
├── globals.css                   # Shikho design system styles
│
├── class/
│   ├── layout.tsx                # Shared layout for all class pages
│   │
│   ├── [classId]/
│   │   ├── page.tsx              # Lead form page
│   │   ├── verify/
│   │   │   └── page.tsx          # OTP verification page
│   │   └── success/
│   │       └── page.tsx          # Success page with drive links
│
├── api/
│   └── otp/
│       ├── send/
│       │   └── route.ts          # API endpoint to send OTP
│       └── verify/
│           └── route.ts          # API endpoint to verify OTP
│
components/
├── ui/                           # Reusable UI components (Shikho design system)
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── card.tsx
│   ├── label.tsx
│   └── form.tsx
│
├── lead-form/
│   ├── lead-form.tsx             # Lead capture form component
│   ├── otp-input.tsx             # 4-digit OTP input component
│   └── otp-verification.tsx      # OTP verification form component
│
└── debug/
    └── debug-panel.tsx           # Debug mode controls

lib/
├── utils.ts                      # Utility functions (cn, etc.)
├── config/
│   ├── classes.ts                # Class configurations & drive URLs
│   └── groups.ts                 # Group/batch options
├── validations/
│   └── lead-form.ts              # Zod schemas for form validation
└── api/
    └── otp.ts                    # OTP API client functions
```

---

## 📱 UI/UX Specifications

### Mobile-First Design

The platform is designed with mobile as the primary target:

- **Max container width**: 448px (`max-w-md`)
- **Full-width inputs and buttons** on mobile
- **Touch-friendly** tap targets (min 48px height)
- **Responsive padding**: `p-4` on mobile

### Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text Input | Yes | Min 2 chars, max 255 chars |
| Phone | Tel Input | Yes | BD format: 01XXXXXXXXX |
| Class | Pre-filled | Yes | Determined by URL path |
| Group | Select | C12 only | Science/Humanities/Business |

### OTP Input

- **4 separate single-digit input boxes**
- Each box: 48px × 48px
- Border radius: 8px
- Auto-focus to next box on input
- Auto-submit when all 4 digits entered

### Design Tokens (from design_system.md)

| Element | Border Radius |
|---------|---------------|
| Input fields | 8px |
| Buttons | 8px |
| Cards | 12px |
| OTP boxes | 8px |

---

## 🔌 API Integration

### 1. Send OTP API

**Endpoint**: `POST https://api.shikho.com/public/activity/otp`

**Request**:
```json
{
  "phone": "01XXXXXXXXX",
  "intent": "free-class-resource-download"
}
```

**Response**:
```json
{
  "body": {
    "token": "JWT_TOKEN_HERE"
  },
  "code": 200
}
```

### 2. Verify OTP API

**Endpoint**: `POST https://api.shikho.com/public/activity/otp/verify`

**Headers**:
```
Authorization: Bearer JWT_TOKEN_HERE
```

**Request**:
```json
{
  "meta": {
    "class": "C12",
    "name": "Student Name",
    "group": "science"
  },
  "otp": "1234",
  "intent": "free-class-resource-download"
}
```

**Response**:
```json
{
  "message": "Success",
  "code": 200
}
```

---

## 📁 Class & Drive URL Configuration

```typescript
// lib/config/classes.ts

export const CLASS_CONFIG = {
  c5: {
    id: 'c5',
    label: 'Class 5',
    labelBn: 'ক্লাস ৫',
    driveUrl: 'https://drive.google.com/drive/folders/15MzujdWVDXAyBRpb_ITFFWSrF8QNuaxw?usp=sharing',
    resourceTitle: 'C5 Britti Exam Free Class',
    resourceTitleBn: 'ক্লাস ৫ বৃত্তি পরীক্ষা ফ্রি ক্লাস',
    hasGroup: false
  },
  c8: {
    id: 'c8',
    label: 'Class 8',
    labelBn: 'ক্লাস ৮',
    driveUrl: 'https://drive.google.com/drive/folders/1K7NM3BWuDNvu8bWHIHR1ZGyKXefD6buV?usp=sharing',
    resourceTitle: 'C8 Britti Exam Free Class',
    resourceTitleBn: 'ক্লাস ৮ বৃত্তি পরীক্ষা ফ্রি ক্লাস',
    hasGroup: false
  },
  c12: {
    id: 'c12',
    label: 'Admission',
    labelBn: 'এডমিশন',
    driveUrl: 'https://drive.google.com/drive/folders/1e5nx-u-RRDgkfLD8Si9HJb1nD-6pPyv6?usp=sharing',
    resourceTitle: "HSC'25 Admission Bounce Back",
    resourceTitleBn: "এইচএসসি'২৫ এডমিশন বাউন্স ব্যাক",
    hasGroup: true
  }
} as const;

export const GROUP_OPTIONS = [
  { value: 'science', label: 'বিজ্ঞান' },
  { value: 'humanities', label: 'মানবিক' },
  { value: 'business', label: 'ব্যবসায় শিক্ষা' }
] as const;
```

---

## 🧪 Debug Mode

For testing the flow without sending actual OTPs:

### Environment Variable
```env
NEXT_PUBLIC_DEBUG_MODE=true
```

### Debug Features

1. **Skip OTP Send**: Instead of calling the API, immediately proceed to OTP screen
2. **Auto-fill OTP**: Show a preset OTP code (e.g., "1234") 
3. **Skip Verification**: Any 4-digit code passes verification
4. **Debug Panel**: Shows current state, token, and manual controls

### Debug Panel UI

```
┌─────────────────────────────────────┐
│  🔧 DEBUG MODE                      │
├─────────────────────────────────────┤
│  Current Step: OTP Verification     │
│  Token: eyJhb...                    │
│  Form Data: {name, phone, class}    │
│                                     │
│  [Skip to Success]  [Reset Form]    │
└─────────────────────────────────────┘
```

---

## 🔄 State Management

### Form Flow States

```typescript
type FormStep = 'details' | 'otp' | 'success';

interface LeadFormState {
  step: FormStep;
  formData: {
    name: string;
    phone: string;
    classId: string;
    group?: string;
  };
  otpToken: string | null;
  error: string | null;
  isLoading: boolean;
}
```

### Page Navigation Flow

```
┌────────────────────┐
│  /class/[classId]  │ ──── onSubmit + OTP sent ────► ┌──────────────────────────┐
│   (Lead Form)      │         redirect               │  /class/[classId]/verify │
└────────────────────┘                                │   (OTP Verification)     │
                                                      └──────────────────────────┘
                                                                  │
                                                                  │ OTP verified
                                                                  │ redirect
                                                                  ▼
                                                      ┌───────────────────────────┐
                                                      │  /class/[classId]/success │
                                                      │   (Success + Drive Link)  │
                                                      └───────────────────────────┘
```

### Data Passing Between Pages

Form data and OTP token are passed via:
1. **URL Search Params**: For non-sensitive data (class, name)
2. **Session Storage**: For token and phone number (cleared on success)

```typescript
// After form submit, redirect with params:
router.push(`/class/${classId}/verify?name=${encodeURIComponent(name)}&phone=${phone}`);

// Store token in sessionStorage:
sessionStorage.setItem('otp_token', token);
sessionStorage.setItem('form_data', JSON.stringify({ name, phone, classId, group }));
```

---

## 📦 Dependencies to Install

```bash
# UI Components
npm install @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot

# Form Handling
npm install react-hook-form @hookform/resolvers zod

# Animations
npm install framer-motion
```

---

## 🎨 Styling Notes

### Fonts (from design_system.md)

- **Baloo Da 2**: Headings, buttons, display text
- **Hind Siliguri**: Body text, form inputs, labels (Bengali support)

### Color Palette

| Color | Variable | Usage |
|-------|----------|-------|
| Primary | `--color-shikho-primary` | #475dff | Primary actions |
| CTA | `--color-shikho-cta` | #cf278d | Call-to-action buttons |
| Heading | `--color-shikho-heading` | #2d4797 | Headings |
| Dark | `--color-shikho-dark` | #232c6a | Labels, text |
| Muted | `--color-shikho-muted` | #454c7e | Placeholders |
| Border | `--color-shikho-border` | #d0deef | Input borders |

---

## 🚀 Implementation Phases

### Phase 1: Setup & UI Components
- Install dependencies
- Set up Shikho design system (globals.css)
- Create UI components (Button, Input, Select, Card, Label, Form)

### Phase 2: Configuration & API Layer
- Create class configuration file
- Create group options configuration
- Implement API routes for OTP send/verify
- Create API client functions

### Phase 3: Lead Form Implementation
- Build LeadForm component with multi-step flow
- Implement form validation with Zod
- Create OTP input component with auto-focus behavior
- Build success screen with drive links

### Phase 4: Debug Mode
- Add environment variable check
- Create debug panel component
- Implement skip/mock functionality

### Phase 5: Testing & Polish
- Test on mobile devices
- Add animations with Framer Motion
- Error handling improvements
- Loading states

---

## 📝 Notes

1. **Bengali Language**: The platform primarily uses Bengali for user-facing text
2. **Phone Validation**: Must match Bangladesh format (01X-XXXXXXXX)
3. **OTP Intent**: Always use `free-class-resource-download` as the intent
4. **Token Storage**: The JWT token from OTP send must be stored and sent with verify request
5. **Mobile First**: All styling decisions should prioritize mobile experience