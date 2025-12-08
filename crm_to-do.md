# CRM Integration To-Do List

## Backend Tasks ✅ COMPLETED

### B1: Set up Environment Variables for CRM API ✅
- [x] Add `CRM_API_BASE_URL` environment variable
- [x] Add `CRM_API_TOKEN` environment variable with the Bearer token from documentation
- [x] Update `.env.example` or documentation with required variables

### B2: Create CRM Data Mappings Configuration ✅
- [x] Create `lib/config/crm-mappings.ts` file
- [x] Implement class to CRM format mapping based on `class_batch.md`:
  - c5 → C5, c6 → C6, c7 → C7, c8 → C8
- [x] Implement class to passing year mapping based on `class_batch.md`:
  - c5 → 2031, c6 → 2030, c7 → 2029, c8 → 2028
- [x] Implement group mapping function:
  - For C5-C8: return "NONE"
  - For C9-C12: map science → "SCI", humanities → "HUM", business → "BS"

### B3: Create CRM API Client Module ✅
- [x] Create `lib/api/crm.ts` file
- [x] Implement `checkLeadExists(mobile: string)` function
  - Call `GET /leads` with mobile number search
  - Parse response to find lead with `product_id = 1`
  - Return lead data or null if not found
- [x] Implement `createLead(leadData)` function
  - Call `POST /leads/upserts`
  - Include all required fields: product_id, name, mobile, source (`free-resource-panel`), cf_class, cf_passing_year, cf_group
  - cf_class and cf_passing_year should be dynamically derived from classId using mappings
  - Return created lead with prospect_id
- [x] Implement `createEvent(eventData)` function
  - Call `POST /events`
  - Include: type, product_id, lead_prospect_id, cf_form_type, cf_form_name, cf_group, cf_passing_year, cf_class
  - Return success/failure status

### B4: Create CRM Service Layer ✅
- [x] Create `lib/services/crm-service.ts` file
- [x] Implement `processLeadAfterVerification(formData)` function:
  1. Format phone number to 88XXXXXXXXXX format
  2. Check if lead exists with product_id = 1
  3. If exists: create event with existing prospect_id
  4. If not exists: create lead first, then create event with new prospect_id
- [x] Add comprehensive error handling and logging
- [x] Ensure function is async and non-blocking

### B5: Integrate CRM Service with OTP Verification API ✅
- [x] Modify `app/api/otp/verify/route.ts`
- [x] After successful OTP verification, call CRM service in parallel (fire-and-forget pattern)
- [x] Pass form data (name, phone, classId, group) to CRM service
- [x] Ensure CRM operations don't block user response
- [x] Add try-catch to prevent CRM failures from affecting user flow

### B6: Add Logging and Monitoring ✅
- [x] Add structured logging for CRM operations
- [x] Log lead check results (found/not found)
- [x] Log lead creation success/failure
- [x] Log event creation success/failure
- [x] Include correlation IDs for debugging (e.g., X-Log-Ref-Id header)

### B7: Update Class Configuration (if needed) ✅
- [x] Review `lib/config/classes.ts`
- [x] CRM mappings support all classes (c5-c12), frontend config only needs active forms
- [x] ClassId type and mappings are compatible

### B8: Add Debug Mode Support for CRM ✅
- [x] Add mock CRM responses when `NEXT_PUBLIC_DEBUG_MODE=true`
- [x] Allow testing without calling actual CRM API
- [x] Log mock operations in debug mode

---

## Frontend Tasks

### F1: Update Form Data Storage
- [ ] Review `lib/api/otp.ts` - ensure all required data is stored
- [ ] Verify phone number is stored correctly for CRM (may need to convert to 88XXXXXXXXXX format)
- [ ] Ensure classId and group are properly passed through the verification flow

### F2: Update OTP Verification Component
- [ ] Review `components/lead-form/otp-verification.tsx`
- [ ] Ensure all form data (name, phone, classId, group) is passed to verify API
- [ ] No changes needed to user-facing behavior (CRM is backend-only)

### F3: Update Lead Form for Additional Classes (if needed)
- [ ] Review `lib/config/classes.ts` for frontend class options
- [ ] Add any missing class configurations if expanding beyond C5, C8, C12
- [ ] Ensure group selection is available for C9-C12 classes

### F4: Add Error Boundary/Fallback (optional enhancement)
- [ ] Consider adding error boundary for graceful failure handling
- [ ] Ensure user experience is not affected by backend CRM issues

---

## Testing Tasks

### T1: Unit Testing
- [ ] Write unit tests for CRM mapping functions
- [ ] Write unit tests for CRM API client functions
- [ ] Write unit tests for CRM service layer

### T2: Integration Testing
- [ ] Test full flow: OTP verification → Lead check → Lead creation → Event creation
- [ ] Test scenario: Lead exists with product_id = 1
- [ ] Test scenario: Lead exists with product_id = 2 (should create new lead for Shikho)
- [ ] Test scenario: No lead exists
- [ ] Test CRM API failure scenarios

### T3: Manual Testing
- [ ] Test in debug mode with mock responses
- [ ] Test with real CRM API in staging environment
- [ ] Verify leads appear in CRM system
- [ ] Verify events are created correctly

---

## Documentation Tasks

### D1: Update README
- [ ] Document new environment variables
- [ ] Document CRM integration flow
- [ ] Add troubleshooting section for CRM issues

### D2: API Documentation
- [ ] Document internal CRM service functions
- [ ] Document expected request/response formats