export type Language = 'en' | 'fr' | 'de';

export type EventType = 'wedding' | 'birthday' | 'company';

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

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  language: Language;
}
