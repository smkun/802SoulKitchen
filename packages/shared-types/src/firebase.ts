// Firebase-related type definitions

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface SiteSettings {
  id: string;
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  hours: BusinessHours;
  serviceAreaZipCodes: string[];
  socialMedia: SocialMediaLinks;
  announcements: Announcement[];
  isActive: boolean;
  lastUpdated: Date;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
  holidays?: HolidayHours[];
}

export interface DayHours {
  isOpen: boolean;
  openTime?: string; // Format: "HH:MM"
  closeTime?: string; // Format: "HH:MM"
  note?: string;
}

export interface HolidayHours {
  date: string; // Format: "YYYY-MM-DD"
  name: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  note?: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  yelp?: string;
  googleBusiness?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'promotion' | 'event';
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  priority: number;
  url?: string;
}

// Firestore collection names
export const COLLECTIONS = {
  MENU_ITEMS: 'menu_items',
  MENU_CATEGORIES: 'menu_categories',
  SETTINGS: 'settings',
  ANNOUNCEMENTS: 'announcements',
} as const;

// Firebase security rule helpers
export interface FirestoreSecurityContext {
  isAuthenticated: boolean;
  isOwner: boolean;
  isPublicRead: boolean;
}

export type FirestoreOperation = 'read' | 'write' | 'create' | 'update' | 'delete';

export interface FirestorePermission {
  collection: string;
  operation: FirestoreOperation;
  allowed: boolean;
  reason?: string;
}