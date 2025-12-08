# Shikho YouTube Lead Gen Platform - Task List

## 📋 Task Overview

This document contains all implementation tasks separated by Backend (B) and Frontend (F).

---

## 🔧 Backend Tasks

### B1: Install Required Dependencies
Install form handling and validation packages:
```bash
npm install react-hook-form @hookform/resolvers zod
```
**Status**: [ ] Pending

---

### B2: Install UI Component Dependencies
Install Radix UI primitives for accessible components:
```bash
npm install @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot
```
**Status**: [ ] Pending

---

### B3: Install Animation Library
Install Framer Motion for animations:
```bash
npm install framer-motion
```
**Status**: [ ] Pending

---

### B4: Create Class Configuration File
Create `/lib/config/classes.ts` with:
- Class definitions (C5, C8, C12)
- Drive URLs for each class
- Group/batch options for C12
- hasGroup flag for conditional rendering

**Status**: [ ] Pending

---

### B5: Create Zod Validation Schema
Create `/lib/validations/lead-form.ts` with:
- Name validation (min 2 chars, max 255)
- Phone validation (BD format: 01XXXXXXXXX)
- Class validation (enum: c5, c8, c12)
- Group validation (conditional for C12)
- superRefine for cross-field validation

**Status**: [ ] Pending

---

### B6: Create OTP Send API Route
Create `/app/api/otp/send/route.ts`:
- Accept POST request with phone number
- Proxy request to Shikho OTP API
- Use intent: `free-class-resource-download`
- Return token on success
- Handle errors gracefully

**Status**: [ ] Pending

---

### B7: Create OTP Verify API Route
Create `/app/api/otp/verify/route.ts`:
- Accept POST request with OTP, token, and meta data
- Proxy request to Shikho Verify API
- Include Authorization header with Bearer token
- Return success/failure status
- Handle errors gracefully

**Status**: [ ] Pending

---

### B8: Create API Client Functions
Create `/lib/api/otp.ts` with:
- `sendOTP(phone: string)` function
- `verifyOTP(token: string, otp: string, meta: object)` function
- Error handling and response typing
- Debug mode bypass logic

**Status**: [ ] Pending

---

### B9: Set Up Environment Variables
Create `.env.local` with:
```env
NEXT_PUBLIC_DEBUG_MODE=false
SHIKHO_API_BASE_URL=https://api.shikho.com
```
Update `.env.example` for documentation.

**Status**: [ ] Pending

---

## 🎨 Frontend Tasks

### F1: Update globals.css with Shikho Design System
Update `/app/globals.css` with:
- Import Google Fonts (Baloo Da 2, Hind Siliguri)
- Add Shikho brand colors (--color-shikho-*)
- Add font family variables
- Configure focus ring styles

**Status**: [ ] Pending

---

### F2: Update Root Layout
Update `/app/layout.tsx`:
- Add Bengali fonts configuration
- Update metadata (title, description)
- Set up body classes for Shikho fonts

**Status**: [ ] Pending

---

### F3: Create Button Component
Create `/components/ui/button.tsx`:
- CTA variant with Shikho pink color
- Standard button sizes (sm, default, lg, xl)
- Loading state with spinner
- Full width option
- 8px border radius

**Status**: [ ] Pending

---

### F4: Create Input Component
Create `/components/ui/input.tsx`:
- 48px height
- 8px border radius
- Shikho border colors
- Focus ring with primary color
- Hind Siliguri font for Bengali support

**Status**: [ ] Pending

---

### F5: Create Select Component
Create `/components/ui/select.tsx`:
- Using Radix Select primitive
- Match input styling (48px height, 8px radius)
- Dropdown with proper animations
- Support for Bengali labels

**Status**: [ ] Pending

---

### F6: Create Card Component
Create `/components/ui/card.tsx`:
- 12px border radius
- Card header, content, footer sections
- Shadow styling
- Shikho border color

**Status**: [ ] Pending

---

### F7: Create Label Component
Create `/components/ui/label.tsx`:
- Using Radix Label primitive
- Shikho dark text color
- Medium font weight

**Status**: [ ] Pending

---

### F8: Create Form Components
Create `/components/ui/form.tsx`:
- Form provider wrapper
- FormField with Controller
- FormItem with gap styling
- FormLabel linked to input
- FormMessage for errors
- FormControl for accessible inputs

**Status**: [ ] Pending

---

### F9: Create OTP Input Component
Create `/components/lead-form/otp-input.tsx`:
- 4 separate single-digit input boxes
- Each box: 48px × 48px, 8px radius
- Auto-focus to next box on input
- Backspace goes to previous box
- Paste support for full OTP
- Auto-submit when complete

**Status**: [ ] Pending

---

### F10: Create Lead Form Component
Create `/components/lead-form/lead-form.tsx`:
- Name input field
- Phone input field
- Class display (from URL, read-only)
- Group select (conditional for C12)
- Form validation with react-hook-form + Zod
- Submit handler that calls OTP send API
- On success: store token in sessionStorage & redirect to verify page
- Loading states

**Status**: [ ] Pending

---

### F11: Create OTP Verification Component
Create `/components/lead-form/otp-verification.tsx`:
- Read form data from sessionStorage
- Display phone number (partially masked)
- OTP input component
- Resend OTP button with cooldown timer
- Verify button calls verify API
- On success: redirect to success page
- Error message display
- Back button to go back to form

**Status**: [ ] Pending

---

### F12: Create Success Screen Component
Create `/components/lead-form/success-screen.tsx`:
- Read class config from URL param
- Success message with celebration
- Display class resource title (Bengali)
- Hyperlinked Drive URL button
- Open in new tab behavior
- Clear sessionStorage on mount

**Status**: [ ] Pending

---

### F13: Create Lead Form Page (Step 1)
Create `/app/class/[classId]/page.tsx`:
- Dynamic route handling for c5, c8, c12
- Validate classId against allowed values
- Render LeadForm component with class context
- Handle invalid class IDs (404 or redirect)

**Status**: [ ] Pending

---

### F14: Create OTP Verification Page (Step 2)
Create `/app/class/[classId]/verify/page.tsx`:
- Read token from sessionStorage
- If no token, redirect back to lead form
- Render OTPVerification component
- Pass classId for context

**Status**: [ ] Pending

---

### F15: Create Success Page (Step 3)
Create `/app/class/[classId]/success/page.tsx`:
- Validate classId against allowed values
- Get drive URL from class config
- Render SuccessScreen component
- Clear sessionStorage data

**Status**: [ ] Pending

---

### F16: Create Class Layout
Create `/app/class/layout.tsx`:
- Shared layout for all class pages (form, verify, success)
- Background gradient (Shikho style)
- Decorative blob elements
- Footer with copyright

**Status**: [ ] Pending

---

### F17: Update Home Page
Update `/app/page.tsx`:
- Landing page or redirect logic
- Links to each class form (optional)
- Or redirect to default class

**Status**: [ ] Pending

---

### F18: Create Debug Panel Component
Create `/components/debug/debug-panel.tsx`:
- Only render when NEXT_PUBLIC_DEBUG_MODE=true
- Show current page/step
- Show stored token
- Show form data from sessionStorage
- "Go to Verify" button
- "Go to Success" button
- "Clear Storage" button
- Collapsible panel

**Status**: [ ] Pending

---

### F19: Add Animations
Update components with Framer Motion:
- Page entry animation (fade + slide)
- Page transition animations
- Button hover/tap effects
- Success celebration animation
- Form field stagger animation

**Status**: [ ] Pending

---

### F20: Mobile Responsive Testing & Fixes
- Test on various mobile viewport sizes
- Ensure touch targets are 48px minimum
- Check keyboard behavior on mobile
- Test OTP auto-fill from SMS
- Verify scroll behavior

**Status**: [ ] Pending

---

### F21: Error Handling UI
- Network error messages
- API error messages (invalid OTP, rate limit)
- Form validation error styling
- Toast notifications for errors
- Retry mechanisms

**Status**: [ ] Pending

---

### F22: Loading States
- Button loading spinners
- Form disabled during submit
- OTP verification loading
- Skeleton loading (optional)

**Status**: [ ] Pending

---

## 📊 Task Summary

| Category | Total | Status |
|----------|-------|--------|
| Backend (B) | 9 | 0/9 Complete |
| Frontend (F) | 22 | 0/22 Complete |
| **Total** | **31** | **0/31 Complete** |

---

## 🚀 Recommended Implementation Order

### Sprint 1: Foundation (B1-B3, F1-F2)
1. B1: Install form dependencies
2. B2: Install UI dependencies
3. B3: Install animation library
4. F1: Update globals.css
5. F2: Update root layout

### Sprint 2: UI Components (F3-F8)
6. F3: Create Button component
7. F4: Create Input component
8. F5: Create Select component
9. F6: Create Card component
10. F7: Create Label component
11. F8: Create Form components

### Sprint 3: Configuration & API (B4-B9)
12. B4: Create class configuration
13. B5: Create validation schema
14. B6: Create OTP send route
15. B7: Create OTP verify route
16. B8: Create API client
17. B9: Set up env variables

### Sprint 4: Lead Form Components (F9-F12)
18. F9: Create OTP input component
19. F10: Create Lead Form component
20. F11: Create OTP verification component
21. F12: Create Success screen component

### Sprint 5: Route Pages (F13-F17)
22. F13: Create lead form page (Step 1)
23. F14: Create OTP verification page (Step 2)
24. F15: Create success page (Step 3)
25. F16: Create class layout
26. F17: Update home page

### Sprint 6: Debug & Polish (F18-F22)
27. F18: Create debug panel
28. F19: Add animations
29. F20: Mobile testing
30. F21: Error handling UI
31. F22: Loading states

---

## ✅ Completion Checklist

Before marking complete, verify:

- [ ] All forms work on mobile devices
- [ ] OTP flow works end-to-end
- [ ] Debug mode bypasses API calls
- [ ] All 3 classes (C5, C8, C12) are accessible
- [ ] C12 shows group selection
- [ ] Drive links open in new tab
- [ ] Error messages display correctly
- [ ] Loading states are smooth
- [ ] Animations don't affect performance