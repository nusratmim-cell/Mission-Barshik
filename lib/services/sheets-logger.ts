/**
 * Google Sheets Logger Service
 * 
 * Logs CRM API calls to Google Sheets via Apps Script webhook.
 * All logging is fire-and-forget to not block the main application flow.
 */

// Log entry interface matching the Google Sheet columns
export interface CRMLogEntry {
  timestamp: string;
  requestId: string;
  endpoint: string;
  method: string;
  phoneNumber: string;
  classId: string;
  requestPayload: string;
  responseStatus: number | null;
  responseBody: string;
  success: boolean;
  errorMessage: string | null;
  durationMs: number;
  leadId: number | null;
  prospectId: string | null;
  formName: string;
  isNewLead: boolean;
}

// Parameters for logging a CRM call
export interface LogCRMCallParams {
  endpoint: string;
  method: string;
  phoneNumber?: string;
  classId?: string;
  requestPayload?: object;
  responseStatus?: number;
  responseBody?: object | string;
  success: boolean;
  errorMessage?: string;
  durationMs: number;
  leadId?: number;
  prospectId?: string;
  isNewLead?: boolean;
}

// Check if logging is enabled
const isLoggingEnabled = (): boolean => {
  return !!process.env.GOOGLE_SHEETS_WEBHOOK_URL;
};

// Check if debug mode is enabled
const isDebugMode = (): boolean => {
  return process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
};

/**
 * Generate unique request ID for tracking
 */
function generateRequestId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `crm-${timestamp}-${random}`;
}

/**
 * Truncate long strings to prevent Google Sheets overflow
 */
function truncate(str: string, maxLength: number = 1000): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...[truncated]';
}

/**
 * Safely stringify an object, handling circular references
 */
function safeStringify(obj: object | string | undefined | null): string {
  if (obj === undefined || obj === null) return '';
  if (typeof obj === 'string') return obj;
  
  try {
    return JSON.stringify(obj);
  } catch {
    return '[Unable to stringify]';
  }
}

/**
 * Send log entry to Google Sheets via webhook (fire-and-forget)
 */
async function sendToGoogleSheets(entry: CRMLogEntry): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('[SheetsLogger] No webhook URL configured, skipping log');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      console.warn(`[SheetsLogger] Webhook responded with status ${response.status}`);
    }
  } catch (error) {
    // Silently fail - logging should never break the main flow
    console.error('[SheetsLogger] Failed to send log:', error);
  }
}

/**
 * Log a CRM API call to Google Sheets
 * 
 * This function is fire-and-forget - it doesn't block the main flow
 * and silently handles any errors.
 * 
 * @param params - The parameters for the log entry
 */
export function logCRMCall(params: LogCRMCallParams): void {
  // Skip logging if not configured
  if (!isLoggingEnabled()) {
    console.log('[SheetsLogger] Logging not configured, skipping');
    return;
  }

  // In debug mode, just log to console
  if (isDebugMode()) {
    console.log('[SheetsLogger] DEBUG MODE - Would log:', {
      endpoint: params.endpoint,
      method: params.method,
      success: params.success,
      durationMs: params.durationMs,
    });
    return;
  }

  // Build the log entry
  const entry: CRMLogEntry = {
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
    endpoint: params.endpoint,
    method: params.method,
    phoneNumber: params.phoneNumber || '',
    classId: params.classId || '',
    requestPayload: truncate(safeStringify(params.requestPayload)),
    responseStatus: params.responseStatus ?? null,
    responseBody: truncate(safeStringify(params.responseBody)),
    success: params.success,
    errorMessage: params.errorMessage ?? null,
    durationMs: params.durationMs,
    leadId: params.leadId ?? null,
    prospectId: params.prospectId ?? null,
    formName: 'YT_Free_Video',
    isNewLead: params.isNewLead ?? false,
  };

  // Fire-and-forget - don't await
  sendToGoogleSheets(entry).catch((error) => {
    // Extra safety - catch any unhandled errors
    console.error('[SheetsLogger] Unexpected error:', error);
  });
}

/**
 * Create a logger context for tracking a specific flow
 * Useful for logging multiple related API calls
 */
export function createLoggerContext(phoneNumber: string, classId: string) {
  return {
    log: (params: Omit<LogCRMCallParams, 'phoneNumber' | 'classId'>) => {
      logCRMCall({
        ...params,
        phoneNumber,
        classId,
      });
    },
  };
}