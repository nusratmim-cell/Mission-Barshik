/**
 * CRM API Client Functions
 *
 * These functions handle communication with the Shikho CRM API.
 * They are server-side only and should not be imported in client components.
 */

import { SHIKHO_PRODUCT_ID } from '@/lib/config/crm-mappings';
import { logCRMCall } from '@/lib/services/sheets-logger';

// CRM API configuration from environment variables
const CRM_API_BASE_URL = process.env.CRM_API_BASE_URL || 'https://crm-api.shikho.com/api/v1';
const CRM_API_TOKEN = process.env.CRM_API_TOKEN || '';
const CRM_LOG_REF_ID = process.env.CRM_LOG_REF_ID || 'gform-web-001-0000000000001';

// Check if debug mode is enabled
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

// Types for CRM API responses and requests

export interface CRMLeadOwner {
  id: number;
  name: string;
  status_id?: number;
  deleted_at?: string | null;
}

export interface CRMLeadStage {
  id: number;
  name: string;
}

export interface CRMLatestCall {
  id: number;
  lead_id: number;
  call_status: string;
  dispo_status: string;
  created_at: string;
}

export interface CRMLead {
  id: number;
  mobile: string;
  name: string;
  source: string;
  lead_stage_id: number;
  owner_id: number;
  status_id: number;
  product_id?: number;
  prospect_id?: string;
  owner?: CRMLeadOwner;
  lead_stage?: CRMLeadStage;
  district?: string | null;
  product?: { id: number; name: string } | null;
  latest_call?: CRMLatestCall | null;
  lead_contacts?: any[];
  custom_field?: any[];
}

export interface CRMLeadSearchResponse {
  data: CRMLead[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: Record<string, string>;
    };
  };
}

export interface CRMCreateLeadPayload {
  product_id: number;
  name: string;
  mobile: string;
  country_code: string;
  source: string;
  cf_class: string;
  cf_passing_year: string;
  cf_group: string;
}

export interface CRMCreateLeadResponse {
  id: number;
  prospect_id: string;
  message?: string;
}

export interface CRMCreateEventPayload {
  type: string;
  product_id: number;
  lead_prospect_id: string;
  cf_form_type: string;
  cf_form_name: string;
  cf_class: string;
  cf_passing_year: string;
  cf_group: string;
}

export interface CRMCreateEventResponse {
  id?: number;
  message?: string;
  success?: boolean;
}

/**
 * Get common headers for CRM API requests
 */
function getCRMHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${CRM_API_TOKEN}`,
    'X-Log-Ref-Id': CRM_LOG_REF_ID,
  };
}

/**
 * Check if a lead exists in the CRM for the given phone number
 *
 * @param mobile - Phone number in 88XXXXXXXXXX format
 * @param classId - Optional class ID for logging context
 * @returns The lead with product_id = 1 (Shikho) if found, null otherwise
 */
export async function checkLeadExists(mobile: string, classId?: string): Promise<CRMLead | null> {
  const logPrefix = '[CRM:checkLeadExists]';
  const startTime = Date.now();
  
  if (isDebugMode) {
    console.log(`${logPrefix} DEBUG MODE - Returning mock null (no lead exists)`);
    return null;
  }

  try {
    const url = new URL(`${CRM_API_BASE_URL}/leads`);
    url.searchParams.set('cols', 'lead_stage_id;prospect_id;owner_id;product_id');
    url.searchParams.set('search', `mobile:${mobile}`);
    url.searchParams.set('conditions', 'mobile:=');

    console.log(`${logPrefix} Checking lead for mobile: ${mobile}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getCRMHeaders(),
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      console.error(`${logPrefix} API error: ${response.status} ${response.statusText}`);
      
      // Log the failed API call
      logCRMCall({
        endpoint: '/leads',
        method: 'GET',
        phoneNumber: mobile,
        classId,
        responseStatus: response.status,
        success: false,
        errorMessage: `${response.status} ${response.statusText}`,
        durationMs,
      });
      
      return null;
    }

    const data: CRMLeadSearchResponse = await response.json();
    console.log(`${logPrefix} Found ${data.data.length} leads for mobile: ${mobile}`);

    // Find lead with product_id = 1 (Shikho)
    const shikhoLead = data.data.find(lead => lead.product_id === SHIKHO_PRODUCT_ID);
    
    // Log the successful API call
    logCRMCall({
      endpoint: '/leads',
      method: 'GET',
      phoneNumber: mobile,
      classId,
      responseStatus: response.status,
      responseBody: data,
      success: true,
      durationMs,
      leadId: shikhoLead?.id,
      prospectId: shikhoLead?.prospect_id,
    });
    
    if (shikhoLead) {
      console.log(`${logPrefix} Found Shikho lead: ID=${shikhoLead.id}, prospect_id=${shikhoLead.prospect_id}`);
      return shikhoLead;
    }

    console.log(`${logPrefix} No Shikho lead (product_id=1) found for mobile: ${mobile}`);
    return null;

  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(`${logPrefix} Error checking lead:`, error);
    
    // Log the error
    logCRMCall({
      endpoint: '/leads',
      method: 'GET',
      phoneNumber: mobile,
      classId,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      durationMs,
    });
    
    return null;
  }
}

/**
 * Create or update a lead in the CRM
 *
 * @param payload - Lead data to create/update
 * @param classId - Optional class ID for logging context
 * @returns The created/updated lead response with prospect_id
 */
export async function createLead(payload: CRMCreateLeadPayload, classId?: string): Promise<CRMCreateLeadResponse | null> {
  const logPrefix = '[CRM:createLead]';
  const startTime = Date.now();
  
  if (isDebugMode) {
    console.log(`${logPrefix} DEBUG MODE - Returning mock lead response`);
    return {
      id: 999999,
      prospect_id: 'mock-prospect-id-' + Date.now(),
      message: 'Mock lead created (debug mode)',
    };
  }

  try {
    console.log(`${logPrefix} Creating lead for mobile: ${payload.mobile}`);
    console.log(`${logPrefix} Payload:`, JSON.stringify(payload, null, 2));

    const response = await fetch(`${CRM_API_BASE_URL}/leads/upserts`, {
      method: 'POST',
      headers: getCRMHeaders(),
      body: JSON.stringify(payload),
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${logPrefix} API error: ${response.status} ${response.statusText}`);
      console.error(`${logPrefix} Error body:`, errorText);
      
      // Log the failed API call
      logCRMCall({
        endpoint: '/leads/upserts',
        method: 'POST',
        phoneNumber: payload.mobile,
        classId,
        requestPayload: payload,
        responseStatus: response.status,
        responseBody: errorText,
        success: false,
        errorMessage: `${response.status} ${response.statusText}`,
        durationMs,
        isNewLead: true,
      });
      
      return null;
    }

    const data: CRMCreateLeadResponse = await response.json();
    console.log(`${logPrefix} Lead created/updated successfully: ID=${data.id}, prospect_id=${data.prospect_id}`);
    
    // Log the successful API call
    logCRMCall({
      endpoint: '/leads/upserts',
      method: 'POST',
      phoneNumber: payload.mobile,
      classId,
      requestPayload: payload,
      responseStatus: response.status,
      responseBody: data,
      success: true,
      durationMs,
      leadId: data.id,
      prospectId: data.prospect_id,
      isNewLead: true,
    });
    
    return data;

  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(`${logPrefix} Error creating lead:`, error);
    
    // Log the error
    logCRMCall({
      endpoint: '/leads/upserts',
      method: 'POST',
      phoneNumber: payload.mobile,
      classId,
      requestPayload: payload,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      durationMs,
      isNewLead: true,
    });
    
    return null;
  }
}

/**
 * Create an event for a lead in the CRM
 *
 * @param payload - Event data to create
 * @param phoneNumber - Optional phone number for logging context
 * @param classId - Optional class ID for logging context
 * @returns The created event response
 */
export async function createEvent(
  payload: CRMCreateEventPayload,
  phoneNumber?: string,
  classId?: string
): Promise<CRMCreateEventResponse | null> {
  const logPrefix = '[CRM:createEvent]';
  const startTime = Date.now();
  
  if (isDebugMode) {
    console.log(`${logPrefix} DEBUG MODE - Returning mock event response`);
    return {
      id: 888888,
      success: true,
      message: 'Mock event created (debug mode)',
    };
  }

  try {
    console.log(`${logPrefix} Creating event for prospect: ${payload.lead_prospect_id}`);
    console.log(`${logPrefix} Payload:`, JSON.stringify(payload, null, 2));

    const response = await fetch(`${CRM_API_BASE_URL}/events`, {
      method: 'POST',
      headers: getCRMHeaders(),
      body: JSON.stringify(payload),
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${logPrefix} API error: ${response.status} ${response.statusText}`);
      console.error(`${logPrefix} Error body:`, errorText);
      
      // Log the failed API call
      logCRMCall({
        endpoint: '/events',
        method: 'POST',
        phoneNumber,
        classId,
        requestPayload: payload,
        responseStatus: response.status,
        responseBody: errorText,
        success: false,
        errorMessage: `${response.status} ${response.statusText}`,
        durationMs,
        prospectId: payload.lead_prospect_id,
      });
      
      return null;
    }

    const data: CRMCreateEventResponse = await response.json();
    console.log(`${logPrefix} Event created successfully:`, data);
    
    // Log the successful API call
    logCRMCall({
      endpoint: '/events',
      method: 'POST',
      phoneNumber,
      classId,
      requestPayload: payload,
      responseStatus: response.status,
      responseBody: data,
      success: true,
      durationMs,
      prospectId: payload.lead_prospect_id,
    });
    
    return data;

  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(`${logPrefix} Error creating event:`, error);
    
    // Log the error
    logCRMCall({
      endpoint: '/events',
      method: 'POST',
      phoneNumber,
      classId,
      requestPayload: payload,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      durationMs,
      prospectId: payload.lead_prospect_id,
    });
    
    return null;
  }
}