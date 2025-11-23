import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  User,
  Event,
  BudgetCategory,
  BudgetItem,
  ChecklistItem,
  TimelineEntry,
  Supplier,
  Venue,
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/auth/login', credentials);
    return data;
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/auth/register', registerData);
    return data;
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await this.client.get<User>('/auth/me');
    return data;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data } = await this.client.patch<User>('/auth/profile', updates);
    return data;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    const { data } = await this.client.get<Event[]>('/events');
    return data;
  }

  async getEvent(id: string): Promise<Event> {
    const { data } = await this.client.get<Event>(`/events/${id}`);
    return data;
  }

  async createEvent(event: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const { data } = await this.client.post<Event>('/events', event);
    return data;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const { data } = await this.client.patch<Event>(`/events/${id}`, updates);
    return data;
  }

  async deleteEvent(id: string): Promise<void> {
    await this.client.delete(`/events/${id}`);
  }

  async generateChecklistTemplate(eventId: string, eventType: string): Promise<ChecklistItem[]> {
    const { data } = await this.client.post<ChecklistItem[]>(`/events/${eventId}/checklist/generate`, {
      eventType,
    });
    return data;
  }

  // Budget Categories
  async getBudgetCategories(eventId: string): Promise<BudgetCategory[]> {
    const { data } = await this.client.get<BudgetCategory[]>(`/events/${eventId}/budget/categories`);
    return data;
  }

  async createBudgetCategory(
    eventId: string,
    category: Omit<BudgetCategory, 'id' | 'eventId'>
  ): Promise<BudgetCategory> {
    const { data } = await this.client.post<BudgetCategory>(
      `/events/${eventId}/budget/categories`,
      category
    );
    return data;
  }

  async updateBudgetCategory(
    eventId: string,
    categoryId: string,
    updates: Partial<BudgetCategory>
  ): Promise<BudgetCategory> {
    const { data } = await this.client.patch<BudgetCategory>(
      `/events/${eventId}/budget/categories/${categoryId}`,
      updates
    );
    return data;
  }

  async deleteBudgetCategory(eventId: string, categoryId: string): Promise<void> {
    await this.client.delete(`/events/${eventId}/budget/categories/${categoryId}`);
  }

  // Budget Items
  async getBudgetItems(eventId: string, categoryId: string): Promise<BudgetItem[]> {
    const { data } = await this.client.get<BudgetItem[]>(
      `/events/${eventId}/budget/categories/${categoryId}/items`
    );
    return data;
  }

  async getAllBudgetItems(eventId: string): Promise<BudgetItem[]> {
    const { data } = await this.client.get<BudgetItem[]>(`/events/${eventId}/budget/items`);
    return data;
  }

  async createBudgetItem(
    eventId: string,
    categoryId: string,
    item: Omit<BudgetItem, 'id' | 'categoryId'>
  ): Promise<BudgetItem> {
    const { data } = await this.client.post<BudgetItem>(
      `/events/${eventId}/budget/categories/${categoryId}/items`,
      item
    );
    return data;
  }

  async updateBudgetItem(
    eventId: string,
    categoryId: string,
    itemId: string,
    updates: Partial<BudgetItem>
  ): Promise<BudgetItem> {
    const { data } = await this.client.patch<BudgetItem>(
      `/events/${eventId}/budget/categories/${categoryId}/items/${itemId}`,
      updates
    );
    return data;
  }

  async deleteBudgetItem(eventId: string, categoryId: string, itemId: string): Promise<void> {
    await this.client.delete(`/events/${eventId}/budget/categories/${categoryId}/items/${itemId}`);
  }

  // Checklist
  async getChecklistItems(eventId: string): Promise<ChecklistItem[]> {
    const { data } = await this.client.get<ChecklistItem[]>(`/events/${eventId}/checklist`);
    return data;
  }

  async createChecklistItem(
    eventId: string,
    item: Omit<ChecklistItem, 'id' | 'eventId' | 'createdAt' | 'updatedAt'>
  ): Promise<ChecklistItem> {
    const { data } = await this.client.post<ChecklistItem>(`/events/${eventId}/checklist`, item);
    return data;
  }

  async updateChecklistItem(
    eventId: string,
    itemId: string,
    updates: Partial<ChecklistItem>
  ): Promise<ChecklistItem> {
    const { data } = await this.client.patch<ChecklistItem>(
      `/events/${eventId}/checklist/${itemId}`,
      updates
    );
    return data;
  }

  async deleteChecklistItem(eventId: string, itemId: string): Promise<void> {
    await this.client.delete(`/events/${eventId}/checklist/${itemId}`);
  }

  // Timeline
  async getTimelineEntries(eventId: string): Promise<TimelineEntry[]> {
    const { data } = await this.client.get<TimelineEntry[]>(`/events/${eventId}/timeline`);
    return data;
  }

  async createTimelineEntry(
    eventId: string,
    entry: Omit<TimelineEntry, 'id' | 'eventId'>
  ): Promise<TimelineEntry> {
    const { data } = await this.client.post<TimelineEntry>(`/events/${eventId}/timeline`, entry);
    return data;
  }

  async updateTimelineEntry(
    eventId: string,
    entryId: string,
    updates: Partial<TimelineEntry>
  ): Promise<TimelineEntry> {
    const { data } = await this.client.patch<TimelineEntry>(
      `/events/${eventId}/timeline/${entryId}`,
      updates
    );
    return data;
  }

  async deleteTimelineEntry(eventId: string, entryId: string): Promise<void> {
    await this.client.delete(`/events/${eventId}/timeline/${entryId}`);
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    const { data } = await this.client.get<Supplier[]>('/suppliers');
    return data;
  }

  async createSupplier(supplier: Omit<Supplier, 'id' | 'userId'>): Promise<Supplier> {
    const { data } = await this.client.post<Supplier>('/suppliers', supplier);
    return data;
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier> {
    const { data } = await this.client.patch<Supplier>(`/suppliers/${id}`, updates);
    return data;
  }

  async deleteSupplier(id: string): Promise<void> {
    await this.client.delete(`/suppliers/${id}`);
  }

  // Venues
  async getVenue(eventId: string): Promise<Venue | null> {
    try {
      const { data } = await this.client.get<Venue>(`/events/${eventId}/venue`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createVenue(eventId: string, venue: Omit<Venue, 'id' | 'eventId'>): Promise<Venue> {
    const { data } = await this.client.post<Venue>(`/events/${eventId}/venue`, venue);
    return data;
  }

  async updateVenue(eventId: string, updates: Partial<Venue>): Promise<Venue> {
    const { data } = await this.client.patch<Venue>(`/events/${eventId}/venue`, updates);
    return data;
  }

  async deleteVenue(eventId: string): Promise<void> {
    await this.client.delete(`/events/${eventId}/venue`);
  }

  // Exports
  async exportEventPDF(eventId: string): Promise<Blob> {
    const { data } = await this.client.get(`/events/${eventId}/export/pdf`, {
      responseType: 'blob',
    });
    return data;
  }

  async exportEventExcel(eventId: string): Promise<Blob> {
    const { data } = await this.client.get(`/events/${eventId}/export/excel`, {
      responseType: 'blob',
    });
    return data;
  }

  async exportEventJSON(eventId: string): Promise<Blob> {
    const { data } = await this.client.get(`/events/${eventId}/export/json`, {
      responseType: 'blob',
    });
    return data;
  }
}

export const api = new ApiClient();
