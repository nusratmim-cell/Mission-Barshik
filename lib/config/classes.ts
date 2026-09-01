// Class configuration for the lead generation platform
// Each class has its own drive URL and resource information

export type ClassId = 'c6' | 'c7' | 'c8' | 'c9';

// Group/batch options, used by classes where hasGroup is true
export type GroupValue = 'science' | 'humanities' | 'business';

export interface ClassConfig {
  id: ClassId;
  label: string;
  labelBn: string;
  /** Folder for the class as a whole; also the fallback when a group has no folder. */
  driveUrl: string;
  resourceTitle: string;
  resourceTitleBn: string;
  hasGroup: boolean;
  /** Per-group subfolders, for classes where hasGroup is true. */
  groupDriveUrls?: Partial<Record<GroupValue, string>>;
}

// Drive folders live under the "Mission Barshik" parent folder:
// https://drive.google.com/drive/folders/1R79r6q7kHg9sl20aSYypZDE9_pEyvFP7

export const CLASS_CONFIG: Record<ClassId, ClassConfig> = {
  c6: {
    id: 'c6',
    label: 'Class 6',
    labelBn: 'ষষ্ঠ শ্রেণি',
    driveUrl: 'https://drive.google.com/drive/folders/1_6-w0-hgGowzfvxAuF5fA8zvs_s8I4Ak?usp=sharing',
    resourceTitle: 'Class 6 Mission Barshik',
    resourceTitleBn: 'ষষ্ঠ শ্রেণি মিশন বার্ষিক',
    hasGroup: false
  },
  c7: {
    id: 'c7',
    label: 'Class 7',
    labelBn: 'সপ্তম শ্রেণি',
    driveUrl: 'https://drive.google.com/drive/folders/1-oEvK3qMKsUIrWcMBpv_CvxayGMcc76n?usp=sharing',
    resourceTitle: 'Class 7 Mission Barshik',
    resourceTitleBn: 'সপ্তম শ্রেণি মিশন বার্ষিক',
    hasGroup: false
  },
  c8: {
    id: 'c8',
    label: 'Class 8',
    labelBn: 'অষ্টম শ্রেণি',
    driveUrl: 'https://drive.google.com/drive/folders/1GUn25TKfDvS5ouVrzYLkUZlReF7A9Z8u?usp=sharing',
    resourceTitle: 'Class 8 Mission Barshik',
    resourceTitleBn: 'অষ্টম শ্রেণি মিশন বার্ষিক',
    hasGroup: false
  },
  c9: {
    id: 'c9',
    label: 'Class 9',
    labelBn: 'নবম শ্রেণি',
    driveUrl: 'https://drive.google.com/drive/folders/1YWW6yUKBUzS6u8n_LVWpn81ns-9OVP1x?usp=sharing',
    resourceTitle: 'Class 9 Mission Barshik',
    resourceTitleBn: 'নবম শ্রেণি মিশন বার্ষিক',
    hasGroup: true,
    groupDriveUrls: {
      science: 'https://drive.google.com/drive/folders/14Hqzs4irU54OAaDAfqIwEPkEgLIuye0l?usp=sharing',
      humanities: 'https://drive.google.com/drive/folders/1SzHa6fmQKNoYmaz38IsbOfbdWPvqMjjU?usp=sharing',
      business: 'https://drive.google.com/drive/folders/1Gfxbxnpn49CmzSq95FHWn6ql8IHSWUqv?usp=sharing',
    }
  }
} as const;

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
export const VALID_CLASS_IDS: readonly ClassId[] = ['c6', 'c7', 'c8', 'c9'] as const;

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

/**
 * Resolve the Drive folder to hand the student.
 *
 * For a class with groups (currently only C9) this returns the group's own
 * subfolder, e.g. science -> the SCI folder. Falls back to the class-level
 * folder when the class has no groups, or when the group is missing/unknown.
 */
export function getDriveUrl(classId: string, group?: string): string | undefined {
  const config = getClassConfig(classId);
  if (!config) return undefined;

  if (config.hasGroup && group) {
    const groupUrl = config.groupDriveUrls?.[group as GroupValue];
    if (groupUrl) return groupUrl;
    console.warn(`No group folder for ${classId}/${group}, using class folder`);
  }

  return config.driveUrl;
}
