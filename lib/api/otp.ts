/**
 * OTP API Client Functions
 * 
 * These functions are used by the frontend to interact with the OTP API routes.
 * They handle the communication with our Next.js API routes which in turn
 * proxy requests to the Shikho API.
 */

// Check if debug mode is enabled (client-side check)
const isDebugMode = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
  : false;

// Types
export interface SendOTPResponse {
  success: boolean;
  token?: string;
  error?: string;
  debug?: boolean;
}

export interface VerifyOTPMeta {
  class: string;
  name: string;
  group?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  error?: string;
  debug?: boolean;
}

/**
 * Send OTP to the user's phone number
 * 
 * @param phone - Bangladesh phone number in format 01XXXXXXXXX
 * @returns Promise with success status and token (if successful)
 */
export async function sendOTP(phone: string): Promise<SendOTPResponse> {
  try {
    // In debug mode, we still call the API but it will return a mock token
    const response = await fetch('/api/otp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    const data: SendOTPResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to send OTP',
      };
    }

    return data;
  } catch (error) {
    console.error('Error in sendOTP:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

/**
 * Verify OTP entered by the user
 * 
 * @param token - The JWT token received from sendOTP
 * @param otp - The 4-digit OTP entered by the user
 * @param meta - Additional metadata (class, name, group)
 * @returns Promise with success status
 */
export async function verifyOTP(
  token: string,
  otp: string,
  meta: VerifyOTPMeta
): Promise<VerifyOTPResponse> {
  try {
    const response = await fetch('/api/otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, otp, meta }),
    });

    const data: VerifyOTPResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to verify OTP',
      };
    }

    return data;
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

/**
 * Storage keys for sessionStorage
 */
export const STORAGE_KEYS = {
  OTP_TOKEN: 'otp_token',
  FORM_DATA: 'form_data',
} as const;

/**
 * Form data stored in sessionStorage between pages
 */
export interface StoredFormData {
  name: string;
  phone: string;
  classId: string;
  group?: string;
}

/**
 * Store form data and token in sessionStorage
 * 
 * @param token - The OTP token from sendOTP
 * @param formData - The form data to store
 */
export function storeFormData(token: string, formData: StoredFormData): void {
  if (typeof window === 'undefined') return;
  
  sessionStorage.setItem(STORAGE_KEYS.OTP_TOKEN, token);
  sessionStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
}

/**
 * Retrieve stored form data from sessionStorage
 * 
 * @returns The stored form data or null if not found
 */
export function getStoredFormData(): StoredFormData | null {
  if (typeof window === 'undefined') return null;
  
  const data = sessionStorage.getItem(STORAGE_KEYS.FORM_DATA);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as StoredFormData;
  } catch {
    return null;
  }
}

/**
 * Retrieve stored OTP token from sessionStorage
 * 
 * @returns The stored token or null if not found
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(STORAGE_KEYS.OTP_TOKEN);
}

/**
 * Clear all stored data from sessionStorage
 * Called after successful verification or when user navigates away
 */
export function clearStoredData(): void {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem(STORAGE_KEYS.OTP_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.FORM_DATA);
}

/**
 * Check if debug mode is enabled
 * 
 * @returns true if debug mode is enabled
 */
export function isDebugModeEnabled(): boolean {
  return isDebugMode;
}

/**
 * Mask phone number for display (e.g., 01712***567)
 * 
 * @param phone - The full phone number
 * @returns Masked phone number
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 8) return phone;
  
  const start = phone.slice(0, 5);
  const end = phone.slice(-3);
  return `${start}***${end}`;
}