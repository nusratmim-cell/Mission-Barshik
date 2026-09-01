import { z } from 'zod';

// Bangladesh phone number validation regex
// Format: 01X-XXXXXXXX where X is 3-9 for the first digit after 01
const bangladeshPhoneRegex = /^01[3-9]\d{8}$/;

// Valid class IDs
const validClassIds = ['c6', 'c7', 'c8', 'c9'] as const;

// Valid group values for C9
const validGroups = ['science', 'humanities', 'business'] as const;

/**
 * Lead form validation schema
 * Validates name, phone, class, and conditionally group (for C9)
 */
export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে')
    .max(255, 'নাম ২৫৫ অক্ষরের বেশি হতে পারবে না')
    .trim(),
  
  phone: z
    .string()
    .regex(bangladeshPhoneRegex, 'সঠিক ফোন নম্বর দাও (01XXXXXXXXX)')
    .transform(val => val.replace(/\s+/g, '')), // Remove any whitespace
  
  classId: z.enum(validClassIds, {
    message: 'একটি ক্লাস নির্বাচন করো'
  }),
  
  group: z.enum(validGroups, {
    message: 'একটি গ্রুপ নির্বাচন করো'
  }).optional(),
}).superRefine((data, ctx) => {
  // Group is required for C9
  if (data.classId === 'c9' && !data.group) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'নবম শ্রেণির জন্য গ্রুপ নির্বাচন করো',
      path: ['group'],
    });
  }
});

// Type inference from the schema
export type LeadFormInput = z.infer<typeof leadFormSchema>;

/**
 * OTP verification schema
 * Validates 4-digit OTP code
 */
export const otpSchema = z.object({
  otp: z
    .string()
    .length(4, 'ওটিপি ৪ সংখ্যার হতে হবে')
    .regex(/^\d{4}$/, 'ওটিপি শুধুমাত্র সংখ্যা হতে হবে'),
});

export type OtpInput = z.infer<typeof otpSchema>;

/**
 * Phone-only schema for OTP resend
 */
export const phoneSchema = z.object({
  phone: z
    .string()
    .regex(bangladeshPhoneRegex, 'সঠিক ফোন নম্বর দাও (01XXXXXXXXX)')
    .transform(val => val.replace(/\s+/g, '')),
});

export type PhoneInput = z.infer<typeof phoneSchema>;

/**
 * Meta data schema for OTP verification API
 */
export const verifyMetaSchema = z.object({
  class: z.string(),
  name: z.string(),
  group: z.string().optional(),
});

export type VerifyMeta = z.infer<typeof verifyMetaSchema>;