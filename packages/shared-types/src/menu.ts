// Menu-related type definitions

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  tags: string[];
  imageUrl?: string;
  isSpecial: boolean;
  isAvailable: boolean;
  allergens?: string[];
  nutritionInfo?: NutritionInfo;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
}

export interface MenuSection {
  category: MenuCategory;
  items: MenuItem[];
}

export interface Menu {
  sections: MenuSection[];
  lastUpdated: Date;
  version: string;
}

// Search and filtering types
export interface MenuSearchOptions {
  query?: string;
  category?: string;
  tags?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  excludeAllergens?: string[];
  includeUnavailable?: boolean;
}

export interface MenuSearchResult {
  items: MenuItem[];
  totalCount: number;
  searchTime: number;
  query: MenuSearchOptions;
}

// Fuse.js configuration types
export interface FuseSearchConfig {
  keys: Array<{
    name: string;
    weight: number;
  }>;
  threshold: number;
  distance: number;
  includeScore: boolean;
  includeMatches: boolean;
}

export const DEFAULT_FUSE_CONFIG: FuseSearchConfig = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'category.name', weight: 0.1 },
  ],
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  includeMatches: true,
};