export interface FilterState {
  // Location & Distance
  city: string;
  distance: number; // 0-10 km
  university: string;

  // Price & Budget
  minPrice: number;
  maxPrice: number;
  priceType: 'monthly' | 'daily';
  budgetFriendlyOnly: boolean;

  // Room & Property Type
  roomTypes: string[]; // Single, Double, Shared
  propertyTypes: string[]; // Boarding House, Annex, Hostel

  // Facilities & Amenities
  facilities: string[]; // WiFi, AC, Attached Bathroom, etc.

  // Student Preferences
  genderPreference: 'Male' | 'Female' | 'Mixed' | 'Any';
  studentType: 'Students Only' | 'Professionals' | 'Any';
  quietEnvironment: boolean;

  // Availability
  moveInDate: string;
  availableNow: boolean;
  leaseDuration: 'Short-term' | 'Long-term' | 'Any';

  // Ratings & Reviews
  minRating: number;
  topRatedOnly: boolean;

  // Safety & Rules
  smokingAllowed: boolean | null;
  visitorsAllowed: boolean | null;
  curfew: boolean | null;

  // Sorting
  sortBy: string;
}

export const INITIAL_FILTERS: FilterState = {
  city: '',
  distance: 10,
  university: '',
  minPrice: 0,
  maxPrice: 100000,
  priceType: 'monthly',
  budgetFriendlyOnly: false,
  roomTypes: [],
  propertyTypes: [],
  facilities: [],
  genderPreference: 'Any',
  studentType: 'Any',
  quietEnvironment: false,
  moveInDate: '',
  availableNow: false,
  leaseDuration: 'Any',
  minRating: 0,
  topRatedOnly: false,
  smokingAllowed: null,
  visitorsAllowed: null,
  curfew: null,
  sortBy: 'Recently Added'
};
