import { NextRequest, NextResponse } from 'next/server';
import { triggerCRMProcessing } from '@/lib/services/crm-service';

// Shikho API base URL
// No hardcoded default: an unset var must fail loudly rather than silently
// falling back to the .com production API.
const SHIKHO_API_BASE = process.env.SHIKHO_API_BASE_URL || '';

// OTP intent for this platform
const OTP_INTENT = 'free-class-resource-download';

// Check if debug mode is enabled
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

interface VerifyOTPMeta {
  class: string;
  name: string;
  group?: string;
  phone?: string; // Added to receive phone for CRM processing
}

interface VerifyOTPRequest {
  token: string;
  otp: string;
  meta: VerifyOTPMeta;
}

interface ShikhoVerifyResponse {
  message: string;
  code: number;
}

interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  error?: string;
  debug?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse<VerifyOTPResponse>> {
  try {
    const body: VerifyOTPRequest = await request.json();
    const { token, otp, meta } = body;

    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { success: false, error: 'OTP is required' },
        { status: 400 }
      );
    }

    // Validate OTP format (4 digits)
    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'OTP must be 4 digits' },
        { status: 400 }
      );
    }

    if (!meta || !meta.class || !meta.name) {
      return NextResponse.json(
        { success: false, error: 'Meta data (class, name) is required' },
        { status: 400 }
      );
    }

    // Debug mode: Accept any 4-digit OTP without calling the actual API
    if (isDebugMode) {
      console.log('[DEBUG] OTP Verify - Skipping actual API call');
      console.log('[DEBUG] Token:', token);
      console.log('[DEBUG] OTP:', otp);
      console.log('[DEBUG] Meta:', meta);
      
      // Trigger CRM processing in background (fire-and-forget) even in debug mode
      if (meta.phone) {
        triggerCRMProcessing({
          name: meta.name,
          phone: meta.phone,
          classId: meta.class,
          group: meta.group,
        });
      }
      
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully (debug mode)',
        debug: true
      });
    }

    // Call Shikho Verify API
    const response = await fetch(`${SHIKHO_API_BASE}/public/activity/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        meta,
        otp,
        intent: OTP_INTENT
      }),
    });

    const data: ShikhoVerifyResponse = await response.json();

    // Check if the request was successful
    if (response.ok && data.code === 200) {
      // Trigger CRM processing in background (fire-and-forget)
      // This runs in parallel and doesn't block the user response
      if (meta.phone) {
        console.log('[OTP Verify] Triggering CRM processing for verified user');
        triggerCRMProcessing({
          name: meta.name,
          phone: meta.phone,
          classId: meta.class,
          group: meta.group,
        });
      } else {
        console.warn('[OTP Verify] Phone not provided in meta, skipping CRM processing');
      }
      
      return NextResponse.json({
        success: true,
        message: data.message || 'OTP verified successfully'
      });
    }

    // Handle specific error cases
    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP. Please try again.' },
        { status: 401 }
      );
    }

    if (response.status === 429) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please wait and try again.' },
        { status: 429 }
      );
    }

    // Handle other API errors
    console.error('Shikho Verify API error:', data);
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP. Please try again.' },
      { status: response.status || 500 }
    );

  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}