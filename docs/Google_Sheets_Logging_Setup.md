# Google Sheets Logging Setup Guide

This guide explains how to set up Google Sheets logging for CRM API calls in the YouTube Lead Generation platform.

## Overview

We use Google Sheets as a simple, free logging solution to track all CRM API calls. The setup involves:
1. Creating a Google Sheet
2. Adding a Google Apps Script to receive logs
3. Deploying the script as a web app
4. Configuring the application with the webhook URL

---

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Rename it to something like `CRM API Logs - YT Lead Gen`
3. In the first row (Row 1), add these column headers:

| Column | Header |
|--------|--------|
| A | Timestamp |
| B | Request ID |
| C | API Endpoint |
| D | HTTP Method |
| E | Phone Number |
| F | Class ID |
| G | Request Payload |
| H | Response Status |
| I | Response Body |
| J | Success |
| K | Error Message |
| L | Duration (ms) |
| M | Lead ID |
| N | Prospect ID |
| O | Form Name |
| P | Is New Lead |

4. **Optional**: Format the header row:
   - Select Row 1
   - Make it bold (Ctrl+B)
   - Add a background color
   - Freeze the row: View > Freeze > 1 row

---

## Step 2: Create the Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. This opens the Apps Script editor in a new tab
3. Delete any existing code in the editor
4. Copy and paste the following code:

```javascript
/**
 * CRM API Logger - Google Apps Script
 * 
 * This script receives POST requests from the YT Lead Gen application
 * and logs CRM API call data to this Google Sheet.
 * 
 * Deployed as a Web App to receive webhook calls.
 */

// Handle POST requests (log data)
function doPost(e) {
  try {
    // Get the active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Append a new row with the log data
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),      // A: Timestamp
      data.requestId || '',                             // B: Request ID
      data.endpoint || '',                              // C: API Endpoint
      data.method || '',                                // D: HTTP Method
      data.phoneNumber || '',                           // E: Phone Number
      data.classId || '',                               // F: Class ID
      data.requestPayload || '',                        // G: Request Payload
      data.responseStatus || '',                        // H: Response Status
      data.responseBody || '',                          // I: Response Body
      data.success ? 'TRUE' : 'FALSE',                  // J: Success
      data.errorMessage || '',                          // K: Error Message
      data.durationMs || 0,                             // L: Duration (ms)
      data.leadId || '',                                // M: Lead ID
      data.prospectId || '',                            // N: Prospect ID
      data.formName || '',                              // O: Form Name
      data.isNewLead ? 'TRUE' : 'FALSE'                 // P: Is New Lead
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Log entry added successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error for debugging
    console.error('Error processing log entry:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (health check)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'OK',
      message: 'CRM API Logger is active and ready to receive logs',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function - run manually to verify setup
function testLogEntry() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        requestId: 'test-' + Date.now(),
        endpoint: '/leads',
        method: 'GET',
        phoneNumber: '8801687129490',
        classId: 'class-5',
        requestPayload: '{"test": true}',
        responseStatus: 200,
        responseBody: '{"data": []}',
        success: true,
        errorMessage: null,
        durationMs: 150,
        leadId: null,
        prospectId: null,
        formName: 'YT_Free_Video',
        isNewLead: false
      })
    }
  };
  
  var result = doPost(testData);
  console.log('Test result:', result.getContent());
}
```

5. Click **Save** (Ctrl+S) and name your project `CRM API Logger`

---

## Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy > New deployment**

2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**

3. Configure the deployment:
   - **Description**: `CRM API Logger v1`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone`

   > ⚠️ **Important**: "Anyone" is required so the application can send logs without authentication. The webhook URL acts as a secret key.

4. Click **Deploy**

5. You'll be asked to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** > **Go to CRM API Logger (unsafe)**
   - Click **Allow**

6. Copy the **Web app URL** that appears. It will look like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

   > 🔑 **Save this URL** - you'll need it for the next step!

---

## Step 4: Test the Webhook

Before configuring the application, test that the webhook works:

1. Open a new browser tab and paste your webhook URL
2. You should see a JSON response:
   ```json
   {
     "status": "OK",
     "message": "CRM API Logger is active and ready to receive logs",
     "timestamp": "2025-12-08T12:00:00.000Z"
   }
   ```

3. **Optional**: Run the test function in Apps Script:
   - In the Apps Script editor, select `testLogEntry` from the function dropdown
   - Click **Run**
   - Check your Google Sheet - a test row should appear

---

## Step 5: Configure the Application

1. Open your `.env.local` file in the project

2. Add the webhook URL:
   ```env
   # Google Sheets Logging
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

3. Restart the development server for changes to take effect:
   ```bash
   npm run dev
   ```

---

## Step 6: Verify Logging

1. Go through the lead form flow:
   - Fill out the form with test data
   - Complete OTP verification
   
2. Check your Google Sheet:
   - New rows should appear for each CRM API call
   - You should see entries for `/leads` (check), `/leads/upserts` (create), and `/events` (event creation)

---

## Troubleshooting

### Logs not appearing in sheet

1. **Check the webhook URL**: Make sure it's correctly copied to `.env.local`
2. **Check deployment**: Ensure the script is deployed as a Web App
3. **Check permissions**: The script needs access to "Anyone"
4. **Check server logs**: Look for `[SheetsLogger]` entries in the console

### Error: "Script function not found: doPost"

- Make sure you saved the script after pasting the code
- Try redeploying: Deploy > Manage deployments > Edit > Deploy

### Error: "Authorization required"

- Re-authorize the script: Run any function and follow the authorization flow

### Webhook returns 404 or error

- Create a new deployment (don't edit existing one)
- Use the new deployment URL

---

## Updating the Script

If you need to modify the Apps Script code:

1. Make your changes in the Apps Script editor
2. Go to **Deploy > Manage deployments**
3. Click the **Edit** icon (pencil) next to your deployment
4. Change the version to **New version**
5. Click **Deploy**
6. The same URL will now use the updated code

---

## Security Notes

1. **Keep the webhook URL secret**: Anyone with this URL can add entries to your sheet
2. **Don't share the URL publicly**: Only store it in `.env.local` (which is gitignored)
3. **Monitor access**: You can check Apps Script execution logs: View > Executions
4. **Regenerate if compromised**: Create a new deployment to get a new URL

---

## Data Retention

Google Sheets has a limit of about 10 million cells. To manage data:

1. **Archive old data**: Periodically move old rows to a separate sheet
2. **Delete old data**: Remove entries older than needed
3. **Use multiple sheets**: Create a new sheet each month

To automate cleanup, you can add a time-triggered function in Apps Script.

---

## Support

If you encounter issues:

1. Check the Apps Script execution logs: View > Executions
2. Check the browser console for errors
3. Check the Next.js server logs for `[SheetsLogger]` messages