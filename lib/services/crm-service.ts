/**
 * CRM Service Layer
 * 
 * This service handles the business logic for CRM integration.
 * It orchestrates the flow of checking leads, creating leads, and creating events.
 */

import { 
  checkLeadExists, 
  createLead, 
  createEvent,
  CRMCreateLeadPayload,
  CRMCreateEventPayload,
} from '@/lib/api/crm';

import {
  getCRMClass,
  getPassingYear,
  getCRMGroup,
  formatPhoneForCRM,
  CRM_LEAD_SOURCE,
  CRM_COUNTRY_CODE,
  CRM_EVENT_TYPE,
  CRM_FORM_TYPE,
  CRM_FORM_NAME,
  SHIKHO_PRODUCT_ID,
} from '@/lib/config/crm-mappings';

// Form data interface matching what comes from OTP verification
export interface LeadFormData {
  name: string;
  phone: string;
  classId: string;
  group?: string;
}

// Result of CRM processing
export interface CRMProcessResult {
  success: boolean;
  leadId?: number;
  prospectId?: string;
  eventCreated: boolean;
  error?: string;
  isNewLead: boolean;
}

/**
 * Process lead after OTP verification
 * 
 * This function:
 * 1. Checks if a lead exists with product_id = 1 (Shikho)
 * 2. If lead exists: creates an event for that lead
 * 3. If lead doesn't exist: creates the lead first, then creates an event
 * 
 * @param formData - The form data from OTP verification
 * @returns Promise with the result of CRM processing
 */
export async function processLeadAfterVerification(formData: LeadFormData): Promise<CRMProcessResult> {
  const logPrefix = '[CRMService:processLeadAfterVerification]';
  
  console.log(`${logPrefix} Starting CRM processing for:`, {
    name: formData.name,
    phone: formData.phone,
    classId: formData.classId,
    group: formData.group,
  });

  try {
    // Format phone number to CRM expected format
    const formattedPhone = formatPhoneForCRM(formData.phone);
    console.log(`${logPrefix} Formatted phone: ${formattedPhone}`);

    // Get CRM field values from mappings
    const cfClass = getCRMClass(formData.classId);
    const cfPassingYear = getPassingYear(formData.classId);
    const cfGroup = getCRMGroup(formData.classId, formData.group);

    console.log(`${logPrefix} CRM field mappings:`, {
      cfClass,
      cfPassingYear,
      cfGroup,
    });

    // Step 1: Check if lead exists with product_id = 1
    const existingLead = await checkLeadExists(formattedPhone, formData.classId);

    let prospectId: string;
    let leadId: number;
    let isNewLead = false;

    if (existingLead && existingLead.prospect_id) {
      // Lead exists - use existing prospect_id
      console.log(`${logPrefix} Using existing lead: ID=${existingLead.id}`);
      prospectId = existingLead.prospect_id;
      leadId = existingLead.id;
    } else {
      // Lead doesn't exist - create new lead
      console.log(`${logPrefix} No existing Shikho lead found, creating new lead`);
      
      const leadPayload: CRMCreateLeadPayload = {
        product_id: SHIKHO_PRODUCT_ID,
        name: formData.name,
        mobile: formattedPhone,
        country_code: CRM_COUNTRY_CODE,
        source: CRM_LEAD_SOURCE,
        cf_class: cfClass,
        cf_passing_year: cfPassingYear,
        cf_group: cfGroup,
      };

      const createLeadResult = await createLead(leadPayload, formData.classId);

      if (!createLeadResult || !createLeadResult.prospect_id) {
        console.error(`${logPrefix} Failed to create lead`);
        return {
          success: false,
          eventCreated: false,
          isNewLead: false,
          error: 'Failed to create lead in CRM',
        };
      }

      prospectId = createLeadResult.prospect_id;
      leadId = createLeadResult.id;
      isNewLead = true;
      console.log(`${logPrefix} Lead created: ID=${leadId}, prospect_id=${prospectId}`);
    }

    // Step 2: Create event for the lead
    const eventPayload: CRMCreateEventPayload = {
      type: CRM_EVENT_TYPE,
      product_id: SHIKHO_PRODUCT_ID,
      lead_prospect_id: prospectId,
      cf_form_type: CRM_FORM_TYPE,
      cf_form_name: CRM_FORM_NAME,
      cf_class: cfClass,
      cf_passing_year: cfPassingYear,
      cf_group: cfGroup,
    };

    const createEventResult = await createEvent(eventPayload, formattedPhone, formData.classId);

    if (!createEventResult) {
      console.error(`${logPrefix} Failed to create event for lead ID=${leadId}`);
      return {
        success: true, // Lead processing was successful
        leadId,
        prospectId,
        eventCreated: false,
        isNewLead,
        error: 'Failed to create event in CRM',
      };
    }

    console.log(`${logPrefix} Event created successfully for lead ID=${leadId}`);

    return {
      success: true,
      leadId,
      prospectId,
      eventCreated: true,
      isNewLead,
    };

  } catch (error) {
    console.error(`${logPrefix} Unexpected error:`, error);
    return {
      success: false,
      eventCreated: false,
      isNewLead: false,
      error: error instanceof Error ? error.message : 'Unknown error during CRM processing',
    };
  }
}

/**
 * Fire-and-forget wrapper for CRM processing
 * 
 * This function runs CRM processing in the background without blocking.
 * Any errors are caught and logged, but not propagated.
 * 
 * @param formData - The form data from OTP verification
 */
export function triggerCRMProcessing(formData: LeadFormData): void {
  const logPrefix = '[CRMService:triggerCRMProcessing]';
  
  console.log(`${logPrefix} Triggering async CRM processing`);
  
  // Use setImmediate-like pattern to not block the response
  // In Next.js API routes, we can use Promise without await
  processLeadAfterVerification(formData)
    .then((result) => {
      if (result.success) {
        console.log(`${logPrefix} CRM processing completed successfully:`, {
          leadId: result.leadId,
          prospectId: result.prospectId,
          eventCreated: result.eventCreated,
          isNewLead: result.isNewLead,
        });
      } else {
        console.warn(`${logPrefix} CRM processing completed with issues:`, {
          error: result.error,
          eventCreated: result.eventCreated,
        });
      }
    })
    .catch((error) => {
      console.error(`${logPrefix} CRM processing failed:`, error);
    });
}