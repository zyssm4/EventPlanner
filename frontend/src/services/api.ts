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

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
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

  async updateLanguage(language: string): Promise<void> {
    await this.client.patch('/auth/language', { language });
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { data } = await this.client.post('/auth/refresh', { refreshToken });
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
    const { data } = await this.client.put<Event>(`/events/${id}`, updates);
    return data;
  }

  async deleteEvent(id: string): Promise<void> {
    await this.client.delete(`/events/${id}`);
  }

  async duplicateEvent(id: string): Promise<Event> {
    const { data } = await this.client.post<Event>(`/events/${id}/duplicate`);
    return data;
  }

  async generateChecklistTemplate(eventId: string, eventType: string): Promise<ChecklistItem[]> {
    const { data } = await this.client.post<ChecklistItem[]>(`/events/${eventId}/checklist/template`, {
      eventType,
    });
    return data;
  }

  // Budget
  async getBudgetSummary(eventId: string): Promise<{ totalEstimated: number; totalActual: number; variance: number; categories: Array<{ name: string; estimated: number; actual: number }> }> {
    const { data } = await this.client.get(`/events/${eventId}/budget`);
    return data;
  }

  async createBudgetCategory(
    eventId: string,
    category: Omit<BudgetCategory, 'id' | 'eventId'>
  ): Promise<BudgetCategory> {
    const { data } = await this.client.post<BudgetCategory>(
      `/events/${eventId}/budget/categories`,
      { ...category, eventId }
    );
    return data;
  }

  async updateBudgetCategory(
    categoryId: string,
    updates: Partial<BudgetCategory>
  ): Promise<BudgetCategory> {
    const { data } = await this.client.put<BudgetCategory>(
      `/budget/categories/${categoryId}`,
      updates
    );
    return data;
  }

  async deleteBudgetCategory(categoryId: string): Promise<void> {
    await this.client.delete(`/budget/categories/${categoryId}`);
  }

  // Budget Items
  async createBudgetItem(
    categoryId: string,
    item: Omit<BudgetItem, 'id' | 'categoryId'>
  ): Promise<BudgetItem> {
    const { data } = await this.client.post<BudgetItem>(
      `/budget/categories/${categoryId}/items`,
      { ...item, categoryId }
    );
    return data;
  }

  async updateBudgetItem(
    itemId: string,
    updates: Partial<BudgetItem>
  ): Promise<BudgetItem> {
    const { data } = await this.client.put<BudgetItem>(
      `/budget/items/${itemId}`,
      updates
    );
    return data;
  }

  async deleteBudgetItem(itemId: string): Promise<void> {
    await this.client.delete(`/budget/items/${itemId}`);
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
    itemId: string,
    updates: Partial<ChecklistItem>
  ): Promise<ChecklistItem> {
    const { data } = await this.client.put<ChecklistItem>(
      `/checklist/${itemId}`,
      updates
    );
    return data;
  }

  async toggleChecklistItem(itemId: string): Promise<ChecklistItem> {
    const { data } = await this.client.patch<ChecklistItem>(`/checklist/${itemId}/toggle`);
    return data;
  }

  async deleteChecklistItem(itemId: string): Promise<void> {
    await this.client.delete(`/checklist/${itemId}`);
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
    entryId: string,
    updates: Partial<TimelineEntry>
  ): Promise<TimelineEntry> {
    const { data } = await this.client.put<TimelineEntry>(
      `/timeline/${entryId}`,
      updates
    );
    return data;
  }

  async deleteTimelineEntry(entryId: string): Promise<void> {
    await this.client.delete(`/timeline/${entryId}`);
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    const { data } = await this.client.get<Supplier[]>('/suppliers');
    return data;
  }

  async getSupplier(id: string): Promise<Supplier> {
    const { data } = await this.client.get<Supplier>(`/suppliers/${id}`);
    return data;
  }

  async createSupplier(supplier: Omit<Supplier, 'id' | 'userId'>): Promise<Supplier> {
    const { data } = await this.client.post<Supplier>('/suppliers', supplier);
    return data;
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier> {
    const { data } = await this.client.put<Supplier>(`/suppliers/${id}`, updates);
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
    const { data } = await this.client.post<Venue>(`/events/${eventId}/venue`, { ...venue, eventId });
    return data;
  }

  async updateVenue(venueId: string, updates: Partial<Venue>): Promise<Venue> {
    const { data } = await this.client.put<Venue>(`/venues/${venueId}`, updates);
    return data;
  }

  async deleteVenue(venueId: string): Promise<void> {
    await this.client.delete(`/venues/${venueId}`);
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
