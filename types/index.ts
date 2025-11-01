// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string | null;
  profile_picture: string | null;
  is_business_owner: boolean;
  is_customer: boolean;
  date_joined: string;
  review_count?: number;
  businesses?: number[];
  average_rating_given?: number | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  phone_number?: string;
}

// Business Types
export interface Business {
  id: number;
  name: string;
  category: BusinessCategory;
  category_id?: number;
  description: string;
  address: string;
  city: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number | null;
  longitude?: number | null;
  contact_number: string;
  email?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  user: BusinessUser;
  average_rating: number;
  review_count: number;
  recent_reviews?: Review[];
  is_open?: boolean | null;
  image?: string;
  image_url?: string;
  additional_images?: BusinessImage[];
  opening_hours?: OpeningHours;
  business_hours?: BusinessHour[];
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  is_verified: boolean;
  is_active?: boolean;
  distance?: number;
}

export interface BusinessListItem {
  id: number;
  name: string;
  category: string;
  city: string;
  address: string;
  image?: string;
  image_url?: string;
  average_rating: number;
  review_count: number;
  distance?: number;
  is_verified: boolean;
}

export interface BusinessUser {
  id: number;
  username: string;
  is_business_owner: boolean;
  phone_number?: string;
}

export interface BusinessCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  business_count?: number;
  is_active: boolean;
}

export interface BusinessImage {
  id: number;
  image: string;
  image_url?: string;
  caption?: string;
  uploaded_at: string;
  is_primary: boolean;
  order?: number;
}

export interface BusinessHour {
  day_of_week: string;
  opening_time: string | null;
  closing_time: string | null;
  is_closed: boolean;
}

export interface OpeningHours {
  [key: string]: {
    open?: string;
    close?: string;
    closed?: boolean;
  };
}

export interface BusinessFormData {
  name: string;
  category_id: number;
  description: string;
  address: string;
  city: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  contact_number: string;
  email?: string;
  website?: string;
  opening_hours?: OpeningHours;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  image?: File | null;
}

// Review Types
export interface Review {
  id: number;
  business: number;
  business_name?: string;
  user: ReviewUser;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  sentiment_score?: number | null;
  sentiment_label?: 'POS' | 'NEG' | 'NEU' | null;
  is_edited?: boolean;
  helpful_count?: number;
  is_flagged: boolean;
  flagged_reason?: string;
  time_ago?: string;
}

export interface ReviewUser {
  id: number;
  username: string;
  review_count: number;
  profile_picture?: string | null;
}

export interface ReviewFormData {
  business: number;
  rating: number;
  comment: string;
}

export interface FlagReviewData {
  reason: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

// Statistics Types
export interface BusinessStatistics {
  total_businesses: number;
  total_reviews: number;
  average_rating: number;
  categories: CategoryStats[];
  recent_reviews: Review[];
  trending_businesses: BusinessListItem[];
}

export interface CategoryStats {
  name: string;
  business_count: number;
}

// Search & Filter Types
export interface SearchFilters {
  q?: string;
  category?: number;
  city?: string;
  min_rating?: number;
  max_rating?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface NearbyBusinessFilters {
  latitude: number;
  longitude: number;
  radius?: number;
}

// Dashboard Types
export interface UserDashboard {
  user_profile: User;
  businesses: BusinessListItem[];
  recent_reviews: Review[];
  stats: {
    total_businesses: number;
    total_reviews: number;
    average_rating_given: number;
  };
}

// Admin Types
export interface AuditLog {
  id: number;
  business: number | null;
  user: number | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  timestamp: string;
  details?: string;
  ip_address?: string;
  user_agent?: string;
}

// Toast/Notification Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Form Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

// Location Types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  address: string;
  city: string;
  state?: string;
  country?: string;
  postal_code?: string;
  coordinates?: Coordinates;
}

// Image Upload Types
export interface ImageUploadData {
  image: File;
  caption?: string;
  is_primary?: boolean;
}

// Contact Types
export interface ContactBusinessData {
  message: string;
}

// Utility Types
export type SortOrder = 'asc' | 'desc';
export type OrderingField = 'name' | 'created_at' | 'average_rating' | 'review_count';

export interface SortOption {
  label: string;
  value: string;
}

// Component Props Types
export interface BusinessCardProps {
  business: BusinessListItem | Business;
  onFavorite?: (id: number) => void;
  isFavorited?: boolean;
}

export interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (id: number) => void;
  onFlag?: (id: number, reason: string) => void;
  showBusinessName?: boolean;
  canModerate?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Toast Context Types
export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}