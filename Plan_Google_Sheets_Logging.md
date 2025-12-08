# Google Sheets Logging Integration Plan

## Overview

This plan outlines the implementation of a logging layer that captures all CRM API calls and stores them in a Google Sheet for monitoring, debugging, and auditing purposes.

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   CRM API Client    │────▶│   Logging Service    │────▶│  Google Apps Script │
│  lib/api/crm.ts     │     │ lib/services/logger  │     │     Webhook         │
└─────────────────────┘     └──────────────────────┘     └─────────────────────┘
                                      │                            │
                                      │                            ▼
                                      │                   ┌─────────────────────┐
                                      └──────────────────▶│   Google Sheet      │
                                        fire-and-forget   │   CRM API Logs      │
                                                          └─────────────────────┘
```

## Data to Log

For each CRM API call, we will capture:

| Column | Description | Example |
|--------|-------------|---------|
| Timestamp | ISO 8601 timestamp | 2025-12-08T12:30:00.000Z |
| Request ID | Unique ID for the request | crm-1733661000-abc123 |
| API Endpoint | The CRM API endpoint called | /leads, /leads/upserts, /events |
| HTTP Method | GET, POST, PUT, etc. | POST |
| Phone Number | User's phone number (masked for privacy) | 880167****90 |
| Request Payload | JSON payload sent (truncated if large) | {"product_id":1,...} |
| Response Status | HTTP status code | 200, 400, 500 |
| Response Body | Response from API (truncated) | {"id":123456,...} |
| Success | Boolean success indicator | TRUE/FALSE |
| Error Message | Error message if failed | null or "Bad Request" |
| Duration (ms) | Time taken for the API call | 245 |
| Lead ID | Lead ID from response (if available) | 1637435 |
| Prospect ID | Prospect ID from response (if available) | 9aa013ec-... |
| Class ID | Class from form data | class-5 |
| Form Name | Name of the form/source | YT_Free_Video |

## Implementation Steps

### Step 1: Create Google Sheet and Apps Script Webhook

1. **Create a new Google Sheet** with the following columns:
   - Timestamp
   - Request ID
   - API Endpoint
   - HTTP Method
   - Phone Number
   - Request Payload
   - Response Status
   - Response Body
   - Success
   - Error Message
   - Duration (ms)
   - Lead ID
   - Prospect ID
   - Class ID
   - Form Name

2. **Create Google Apps Script** (deployed as Web App):

```javascript
// Google Apps Script Code
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Append row with all log data
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.requestId || '',
      data.endpoint || '',
      data.method || '',
      data.phoneNumber || '',
      data.requestPayload || '',
      data.responseStatus || '',
      data.responseBody || '',
      data.success || false,
      data.errorMessage || '',
      data.durationMs || 0,
      data.leadId || '',
      data.prospectId || '',
      data.classId || '',
      data.formName || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test endpoint
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'OK', message: 'CRM Logger is active'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy as Web App**:
   - Go to Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Copy the deployment URL

### Step 2: Create Logging Service Module

Create `lib/services/sheets-logger.ts`:

```typescript
/**
 * Google Sheets Logger Service
 * 
 * Logs CRM API calls to Google Sheets via Apps Script webhook.
 * All logging is fire-and-forget to not block the main application flow.
 */

export interface CRMLogEntry {
  timestamp: string;
  requestId: string;
  endpoint: string;
  method: string;
  phoneNumber: string;
  requestPayload: string;
  responseStatus: number | null;
  responseBody: string;
  success: boolean;
  errorMessage: string | null;
  durationMs: number;
  leadId: number | null;
  prospectId: string | null;
  classId: string | null;
  formName: string;
}

// Generate unique request ID
function generateRequestId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `crm-${timestamp}-${random}`;
}

// Mask phone number for privacy (show first 5 and last 2 digits)
function maskPhoneNumber(phone: string): string {
  if (phone.length <= 7) return phone;
  return phone.substring(0, 5) + '****' + phone.substring(phone.length - 2);
}

// Truncate long strings
function truncate(str: string, maxLength: number = 500): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...[truncated]';
}

// Send log to Google Sheets (fire-and-forget)
async function sendToGoogleSheets(entry: CRMLogEntry): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('[SheetsLogger] No webhook URL configured, skipping log');
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch (error) {
    // Silently fail - logging should never break the main flow
    console.error('[SheetsLogger] Failed to send log:', error);
  }
}

// Main logging function
export function logCRMCall(params: {
  endpoint: string;
  method: string;
  phoneNumber?: string;
  requestPayload?: object;
  responseStatus?: number;
  responseBody?: object | string;
  success: boolean;
  errorMessage?: string;
  durationMs: number;
  leadId?: number;
  prospectId?: string;
  classId?: string;
}): void {
  const entry: CRMLogEntry = {
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
    endpoint: params.endpoint,
    method: params.method,
    phoneNumber: params.phoneNumber ? maskPhoneNumber(params.phoneNumber) : '',
    requestPayload: params.requestPayload 
      ? truncate(JSON.stringify(params.requestPayload)) 
      : '',
    responseStatus: params.responseStatus ?? null,
    responseBody: params.responseBody 
      ? truncate(typeof params.responseBody === 'string' 
          ? params.responseBody 
          : JSON.stringify(params.responseBody))
      : '',
    success: params.success,
    errorMessage: params.errorMessage ?? null,
    durationMs: params.durationMs,
    leadId: params.leadId ?? null,
    prospectId: params.prospectId ?? null,
    classId: params.classId ?? null,
    formName: 'YT_Free_Video',
  };

  // Fire-and-forget - don't await
  sendToGoogleSheets(entry).catch(() => {
    // Silently ignore errors
  });
}
```

### Step 3: Integrate with CRM API Client

Modify `lib/api/crm.ts` to wrap each API call with logging:

```typescript
// Example for checkLeadExists function
export async function checkLeadExists(mobile: string): Promise<CRMLead | null> {
  const startTime = Date.now();
  const logPrefix = '[CRM:checkLeadExists]';
  
  // ... existing code ...
  
  try {
    const response = await fetch(url.toString(), { /* ... */ });
    const durationMs = Date.now() - startTime;
    
    // Log the API call
    logCRMCall({
      endpoint: '/leads',
      method: 'GET',
      phoneNumber: mobile,
      responseStatus: response.status,
      responseBody: data,
      success: response.ok,
      durationMs,
    });
    
    // ... rest of existing code ...
  } catch (error) {
    const durationMs = Date.now() - startTime;
    
    logCRMCall({
      endpoint: '/leads',
      method: 'GET',
      phoneNumber: mobile,
      success: false,
      errorMessage: error.message,
      durationMs,
    });
    
    // ... rest of existing code ...
  }
}
```

### Step 4: Environment Variables

Add to `.env.local` and `.env.example`:

```env
# Google Sheets Logging
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Security Considerations

1. **Phone Number Masking**: Phone numbers are masked before logging to protect PII
2. **Payload Truncation**: Large payloads are truncated to prevent sheet overflow
3. **Fire-and-Forget**: Logging failures never impact the main application
4. **No Tokens Logged**: Bearer tokens are never included in logs
5. **Apps Script Security**: The webhook is deployed with appropriate access controls

## Benefits

1. **Audit Trail**: Complete history of all CRM API interactions
2. **Debugging**: Easy to identify failed API calls and their causes
3. **Monitoring**: Track success rates, response times, and patterns
4. **No Dependencies**: Uses simple HTTP POST to Google Apps Script
5. **Low Cost**: Google Sheets is free for most use cases
6. **Easy Access**: Team can view logs directly in Google Sheets

## Testing

1. Enable debug mode to test without affecting real CRM
2. Verify logs appear in Google Sheet within seconds
3. Check that sensitive data is properly masked
4. Confirm logging failures don't break the main flow

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `lib/services/sheets-logger.ts` | CREATE | New logging service module |
| `lib/api/crm.ts` | MODIFY | Add logging to all CRM functions |
| `.env.local` | MODIFY | Add webhook URL |
| `.env.example` | MODIFY | Add webhook URL placeholder |
| `google-apps-script.js` | CREATE | Script for Google Sheets (docs only) |

## Next Steps

1. Create the Google Sheet with required columns
2. Deploy the Google Apps Script webhook
3. Add the webhook URL to environment variables
4. Create the logging service module
5. Integrate logging with CRM API functions
6. Test the complete flow