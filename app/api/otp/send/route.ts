import { NextRequest, NextResponse } from 'next/server';

// Shikho API base URL
const SHIKHO_API_BASE = process.env.SHIKHO_API_BASE_URL || 'https://api.shikho.com';

// OTP intent for this platform
const OTP_INTENT = 'free-class-resource-download';

// Check if debug mode is enabled
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

interface SendOTPRequest {
  phone: string;
}

interface ShikhoOTPResponse {
  body: {
    token: string;
  };
  code: number;
}

interface SendOTPResponse {
  success: boolean;
  token?: string;
  error?: string;
  debug?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse<SendOTPResponse>> {
  try {
    const body: SendOTPRequest = await request.json();
    const { phone } = body;

    // Validate phone number
    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone format (Bangladesh format: 01XXXXXXXXX)
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Debug mode: Return a mock token without calling the actual API
    if (isDebugMode) {
      console.log('[DEBUG] OTP Send - Skipping actual API call');
      console.log('[DEBUG] Phone:', phone);
      
      // Generate a mock token for debug mode
      const mockToken = `debug_token_${Date.now()}_${phone}`;
      
      return NextResponse.json({
        success: true,
        token: mockToken,
        debug: true
      });
    }

    // Call Shikho OTP API
    const response = await fetch(`${SHIKHO_API_BASE}/public/activity/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phone,
        intent: OTP_INTENT
      }),
    });

    const data: ShikhoOTPResponse = await response.json();

    // Check if the request was successful
    if (response.ok && data.code === 200 && data.body?.token) {
      return NextResponse.json({
        success: true,
        token: data.body.token
      });
    }

    // Handle API errors
    console.error('Shikho OTP API error:', data);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP. Please try again.' },
      { status: response.status || 500 }
    );

  } catch (error) {
    console.error('Error sending OTP:', error);
    
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}