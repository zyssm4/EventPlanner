// Shared types across frontend and backend
export enum EventType {
  WEDDING = 'wedding',
  BIRTHDAY = 'birthday',
  COMPANY = 'company'
}

export enum Language {
  EN = 'en',
  FR = 'fr',
  DE = 'de'
}

export interface User {
  id: string;
  email: string;
  name: string;
  language: Language;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  userId: string;
  name: string;
  type: EventType;
  date: Date;
  guestCount: number;
  description?: string;
  venueId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  id: string;
  eventId: string;
  name: string;
  order: number;
}

export interface BudgetItem {
  id: string;
  categoryId: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  notes?: string;
  order: number;
}

export interface ChecklistItem {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEntry {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  responsiblePerson?: string;
  order: number;
}

export interface Supplier {
  id: string;
  userId: string;
  name: string;
  category: string;
  contact: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  notes?: string;
}

export interface Venue {
  id: string;
  eventId: string;
  name: string;
  address: string;
  capacity: number;
  contact: string;
  phone?: string;
  email?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
}

export interface BudgetSummary {
  totalEstimated: number;
  totalActual: number;
  variance: number;
  categories: Array<{
    name: string;
    estimated: number;
    actual: number;
  }>;
}

export interface AISuggestion {
  type: 'budget' | 'checklist' | 'timeline';
  content: unknown;
}

// API Request/Response types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  language?: Language;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CreateEventRequest {
  name: string;
  type: EventType;
  date: Date;
  guestCount: number;
  description?: string;
}

export interface UpdateEventRequest {
  name?: string;
  type?: EventType;
  date?: Date;
  guestCount?: number;
  description?: string;
}

export interface CreateBudgetCategoryRequest {
  eventId: string;
  name: string;
  order?: number;
}

export interface CreateBudgetItemRequest {
  categoryId: string;
  name: string;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
  order?: number;
}

export interface UpdateBudgetItemRequest {
  name?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  order?: number;
}

export interface CreateChecklistItemRequest {
  eventId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  order?: number;
}

export interface UpdateChecklistItemRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: Date;
  order?: number;
}

export interface CreateTimelineEntryRequest {
  eventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  responsiblePerson?: string;
  order?: number;
}

export interface UpdateTimelineEntryRequest {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  responsiblePerson?: string;
  order?: number;
}

export interface CreateSupplierRequest {
  name: string;
  category: string;
  contact: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  notes?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  category?: string;
  contact?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  notes?: string;
}

export interface CreateVenueRequest {
  eventId: string;
  name: string;
  address: string;
  capacity: number;
  contact: string;
  phone?: string;
  email?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateVenueRequest {
  name?: string;
  address?: string;
  capacity?: number;
  contact?: string;
  phone?: string;
  email?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
}

export interface ExportFormat {
  format: 'pdf' | 'excel' | 'json';
  type: 'event' | 'budget' | 'checklist' | 'timeline' | 'full';
}

export interface AISuggestionRequest {
  eventId: string;
  type: 'budget' | 'checklist' | 'timeline';
  language: Language;
}

// Error response
export interface ErrorResponse {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
