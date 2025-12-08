/**
 * CRM Data Mappings Configuration
 * 
 * This file contains mappings between the application's class identifiers
 * and the CRM system's expected values.
 */

// Class slug to CRM cf_class format mapping
// Based on class_batch.md: Class X -> CX format
export const CLASS_TO_CRM_CLASS: Record<string, string> = {
  c5: 'C5',
  c6: 'C6',
  c7: 'C7',
  c8: 'C8',
  c9: 'C9',
  c10: 'C10',
  c11: 'C11',
  c12: 'C12',
};

// Class slug to SSC passing year mapping
// Based on class_batch.md:
// Class 5 - SSC 2031
// Class 6 - SSC 2030
// Class 7 - SSC 2029
// Class 8 - SSC 2028
export const CLASS_TO_PASSING_YEAR: Record<string, string> = {
  c5: '2031',
  c6: '2030',
  c7: '2029',
  c8: '2028',
  // Add more as needed following the pattern
  c9: '2027',
  c10: '2026',
  c11: '2025',
  c12: '2025', // HSC students pass SSC in same year or earlier
};

// User group selection to CRM cf_group format mapping
export const GROUP_TO_CRM_GROUP: Record<string, string> = {
  science: 'SCI',
  humanities: 'HUM',
  business: 'BS',
};

// Classes that don't require group selection (C5-C8)
export const CLASSES_WITHOUT_GROUP = ['c5', 'c6', 'c7', 'c8'];

// Default group value for classes without group selection
export const DEFAULT_GROUP = 'NONE';

/**
 * Get the CRM cf_class value for a given class slug
 * @param classId - The class slug (e.g., 'c5', 'c8', 'c12')
 * @returns The CRM cf_class value (e.g., 'C5', 'C8', 'C12')
 */
export function getCRMClass(classId: string): string {
  const crmClass = CLASS_TO_CRM_CLASS[classId.toLowerCase()];
  if (!crmClass) {
    console.warn(`Unknown class ID: ${classId}, using uppercase as fallback`);
    return classId.toUpperCase();
  }
  return crmClass;
}

/**
 * Get the CRM cf_passing_year value for a given class slug
 * @param classId - The class slug (e.g., 'c5', 'c8', 'c12')
 * @returns The SSC passing year (e.g., '2031', '2028', '2025')
 */
export function getPassingYear(classId: string): string {
  const passingYear = CLASS_TO_PASSING_YEAR[classId.toLowerCase()];
  if (!passingYear) {
    console.warn(`Unknown class ID: ${classId}, using current year + 5 as fallback`);
    return String(new Date().getFullYear() + 5);
  }
  return passingYear;
}

/**
 * Get the CRM cf_group value for a given class and user group selection
 * @param classId - The class slug (e.g., 'c5', 'c8', 'c12')
 * @param group - The user's group selection (e.g., 'science', 'humanities', 'business') or undefined
 * @returns The CRM cf_group value (e.g., 'NONE', 'SCI', 'HUM', 'BS')
 */
export function getCRMGroup(classId: string, group?: string): string {
  // For classes C5-C8, always return NONE regardless of group selection
  if (CLASSES_WITHOUT_GROUP.includes(classId.toLowerCase())) {
    return DEFAULT_GROUP;
  }

  // For classes C9-C12, use the group mapping
  if (group) {
    const crmGroup = GROUP_TO_CRM_GROUP[group.toLowerCase()];
    if (crmGroup) {
      return crmGroup;
    }
    console.warn(`Unknown group: ${group}, using NONE as fallback`);
  }

  // If no group provided for classes that require it, default to NONE
  return DEFAULT_GROUP;
}

/**
 * Format phone number to CRM expected format (88XXXXXXXXXX)
 * @param phone - The phone number in various formats (01XXXXXXXXX, +8801XXXXXXXXX, etc.)
 * @returns The phone number in 88XXXXXXXXXX format
 */
export function formatPhoneForCRM(phone: string): string {
  // Remove any spaces, dashes, or special characters
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // If starts with '0', replace with '880'
  if (cleaned.startsWith('0')) {
    cleaned = '88' + cleaned;
  }
  
  // If doesn't start with '88', add it
  if (!cleaned.startsWith('88')) {
    cleaned = '88' + cleaned;
  }
  
  return cleaned;
}

// CRM Lead Source constant
export const CRM_LEAD_SOURCE = 'free-resource-panel';

// CRM Country Code for Bangladesh
export const CRM_COUNTRY_CODE = 'BD';

// CRM Event constants
export const CRM_EVENT_TYPE = 'campaign_form_submission';
export const CRM_FORM_TYPE = 'ORGANIC';
export const CRM_FORM_NAME = 'YT_Free_Video';

// CRM Product ID for Shikho
export const SHIKHO_PRODUCT_ID = 1;