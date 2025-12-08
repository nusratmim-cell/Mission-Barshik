// Class configuration for the lead generation platform
// Each class has its own drive URL and resource information

export type ClassId = 'c5' | 'c8' | 'c12';

export interface ClassConfig {
  id: ClassId;
  label: string;
  labelBn: string;
  driveUrl: string;
  resourceTitle: string;
  resourceTitleBn: string;
  hasGroup: boolean;
}

export const CLASS_CONFIG: Record<ClassId, ClassConfig> = {
  c5: {
    id: 'c5',
    label: 'Class 5',
    labelBn: 'ক্লাস ৫',
    driveUrl: 'https://drive.google.com/drive/folders/15MzujdWVDXAyBRpb_ITFFWSrF8QNuaxw?usp=sharing',
    resourceTitle: 'C5 Britti Exam Free Class',
    resourceTitleBn: 'ক্লাস ৫ বৃত্তি পরীক্ষা ফ্রি ক্লাস',
    hasGroup: false
  },
  c8: {
    id: 'c8',
    label: 'Class 8',
    labelBn: 'ক্লাস ৮',
    driveUrl: 'https://drive.google.com/drive/folders/1K7NM3BWuDNvu8bWHIHR1ZGyKXefD6buV?usp=sharing',
    resourceTitle: 'C8 Britti Exam Free Class',
    resourceTitleBn: 'ক্লাস ৮ বৃত্তি পরীক্ষা ফ্রি ক্লাস',
    hasGroup: false
  },
  c12: {
    id: 'c12',
    label: 'Admission',
    labelBn: 'এডমিশন',
    driveUrl: 'https://drive.google.com/drive/folders/1e5nx-u-RRDgkfLD8Si9HJb1nD-6pPyv6?usp=sharing',
    resourceTitle: "HSC'25 Admission Bounce Back",
    resourceTitleBn: "এইচএসসি'২৫ এডমিশন বাউন্স ব্যাক",
    hasGroup: true
  }
} as const;

// Group/batch options for Class 12
export type GroupValue = 'science' | 'humanities' | 'business';

export interface GroupOption {
  value: GroupValue;
  label: string;
}

export const GROUP_OPTIONS: readonly GroupOption[] = [
  { value: 'science', label: 'বিজ্ঞান' },
  { value: 'humanities', label: 'মানবিক' },
  { value: 'business', label: 'ব্যবসায় শিক্ষা' }
] as const;

// Valid class IDs for validation
export const VALID_CLASS_IDS: readonly ClassId[] = ['c5', 'c8', 'c12'] as const;

// Helper function to check if a string is a valid class ID
export function isValidClassId(id: string): id is ClassId {
  return VALID_CLASS_IDS.includes(id as ClassId);
}

// Helper function to get class config by ID (returns undefined if invalid)
export function getClassConfig(id: string): ClassConfig | undefined {
  if (isValidClassId(id)) {
    return CLASS_CONFIG[id];
  }
  return undefined;
}