import { EventType, Language } from '../types';

interface AIBudgetSuggestion {
  category: string;
  items: {
    name: string;
    estimatedCost: number;
  }[];
}

interface AIChecklistSuggestion {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  daysBeforeEvent: number;
}

interface AITimelineSuggestion {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export class AIService {
  private static apiKey = process.env.OPENAI_API_KEY;
  private static model = process.env.AI_MODEL || 'gpt-4';

  static isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== 'your-openai-api-key-here';
  }

  static async generateBudgetSuggestions(
    eventType: EventType,
    guestCount: number,
    totalBudget: number,
    language: Language
  ): Promise<AIBudgetSuggestion[]> {
    if (!this.isConfigured()) {
      return this.getDefaultBudgetSuggestions(eventType, guestCount, totalBudget);
    }

    try {
      const prompt = this.getBudgetPrompt(eventType, guestCount, totalBudget, language);
      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('AI budget suggestion failed:', error);
      return this.getDefaultBudgetSuggestions(eventType, guestCount, totalBudget);
    }
  }

  static async generateChecklistSuggestions(
    eventType: EventType,
    eventDate: Date,
    language: Language
  ): Promise<AIChecklistSuggestion[]> {
    if (!this.isConfigured()) {
      return this.getDefaultChecklistSuggestions(eventType);
    }

    try {
      const prompt = this.getChecklistPrompt(eventType, eventDate, language);
      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('AI checklist suggestion failed:', error);
      return this.getDefaultChecklistSuggestions(eventType);
    }
  }

  static async generateTimelineSuggestions(
    eventType: EventType,
    eventDate: Date,
    guestCount: number,
    language: Language
  ): Promise<AITimelineSuggestion[]> {
    if (!this.isConfigured()) {
      return this.getDefaultTimelineSuggestions(eventType);
    }

    try {
      const prompt = this.getTimelinePrompt(eventType, eventDate, guestCount, language);
      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('AI timeline suggestion failed:', error);
      return this.getDefaultTimelineSuggestions(eventType);
    }
  }

  private static async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert event planner. Always respond with valid JSON arrays only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    return data.choices[0].message.content;
  }

  private static getBudgetPrompt(
    eventType: EventType,
    guestCount: number,
    totalBudget: number,
    language: Language
  ): string {
    const langMap: Record<string, string> = { en: 'English', fr: 'French', de: 'German' };
    return `Generate budget suggestions for a ${eventType} event with ${guestCount} guests and a total budget of $${totalBudget}.
    Response in ${langMap[language]}.
    Return a JSON array with this structure:
    [{"category": "string", "items": [{"name": "string", "estimatedCost": number}]}]`;
  }

  private static getChecklistPrompt(
    eventType: EventType,
    eventDate: Date,
    language: Language
  ): string {
    const langMap: Record<string, string> = { en: 'English', fr: 'French', de: 'German' };
    return `Generate a comprehensive checklist for a ${eventType} event scheduled for ${eventDate.toISOString().split('T')[0]}.
    Response in ${langMap[language]}.
    Return a JSON array with this structure:
    [{"title": "string", "description": "string", "priority": "high|medium|low", "daysBeforeEvent": number}]`;
  }

  private static getTimelinePrompt(
    eventType: EventType,
    _eventDate: Date,
    guestCount: number,
    language: Language
  ): string {
    const langMap: Record<string, string> = { en: 'English', fr: 'French', de: 'German' };
    return `Generate a day-of timeline for a ${eventType} event with ${guestCount} guests.
    Response in ${langMap[language]}.
    Return a JSON array with this structure:
    [{"title": "string", "description": "string", "startTime": "HH:MM", "endTime": "HH:MM"}]`;
  }

  private static getDefaultBudgetSuggestions(
    eventType: EventType,
    _guestCount: number,
    totalBudget: number
  ): AIBudgetSuggestion[] {

    const templates: Record<EventType, AIBudgetSuggestion[]> = {
      [EventType.WEDDING]: [
        { category: 'Venue', items: [{ name: 'Venue Rental', estimatedCost: totalBudget * 0.3 }] },
        { category: 'Catering', items: [{ name: 'Food & Beverage', estimatedCost: totalBudget * 0.25 }] },
        { category: 'Photography', items: [{ name: 'Photographer', estimatedCost: totalBudget * 0.1 }] },
        { category: 'Flowers', items: [{ name: 'Floral Arrangements', estimatedCost: totalBudget * 0.08 }] },
        { category: 'Music', items: [{ name: 'DJ/Band', estimatedCost: totalBudget * 0.07 }] },
        { category: 'Attire', items: [{ name: 'Wedding Dress/Suit', estimatedCost: totalBudget * 0.1 }] },
        { category: 'Other', items: [{ name: 'Miscellaneous', estimatedCost: totalBudget * 0.1 }] }
      ],
      [EventType.BIRTHDAY]: [
        { category: 'Venue', items: [{ name: 'Venue Rental', estimatedCost: totalBudget * 0.25 }] },
        { category: 'Catering', items: [{ name: 'Food & Drinks', estimatedCost: totalBudget * 0.35 }] },
        { category: 'Entertainment', items: [{ name: 'Entertainment', estimatedCost: totalBudget * 0.15 }] },
        { category: 'Decorations', items: [{ name: 'Decorations & Cake', estimatedCost: totalBudget * 0.15 }] },
        { category: 'Other', items: [{ name: 'Miscellaneous', estimatedCost: totalBudget * 0.1 }] }
      ],
      [EventType.COMPANY]: [
        { category: 'Venue', items: [{ name: 'Venue Rental', estimatedCost: totalBudget * 0.3 }] },
        { category: 'Catering', items: [{ name: 'Catering', estimatedCost: totalBudget * 0.3 }] },
        { category: 'AV Equipment', items: [{ name: 'Audio/Visual', estimatedCost: totalBudget * 0.15 }] },
        { category: 'Materials', items: [{ name: 'Printed Materials', estimatedCost: totalBudget * 0.1 }] },
        { category: 'Other', items: [{ name: 'Miscellaneous', estimatedCost: totalBudget * 0.15 }] }
      ]
    };

    return templates[eventType];
  }

  private static getDefaultChecklistSuggestions(eventType: EventType): AIChecklistSuggestion[] {
    const templates: Record<EventType, AIChecklistSuggestion[]> = {
      [EventType.WEDDING]: [
        { title: 'Book venue', priority: 'high', daysBeforeEvent: 365 },
        { title: 'Hire photographer', priority: 'high', daysBeforeEvent: 300 },
        { title: 'Send save-the-dates', priority: 'high', daysBeforeEvent: 240 },
        { title: 'Book caterer', priority: 'high', daysBeforeEvent: 200 },
        { title: 'Order wedding dress/suit', priority: 'high', daysBeforeEvent: 180 },
        { title: 'Send invitations', priority: 'high', daysBeforeEvent: 60 },
        { title: 'Final dress fitting', priority: 'medium', daysBeforeEvent: 14 },
        { title: 'Confirm all vendors', priority: 'high', daysBeforeEvent: 7 }
      ],
      [EventType.BIRTHDAY]: [
        { title: 'Set budget', priority: 'high', daysBeforeEvent: 60 },
        { title: 'Book venue', priority: 'high', daysBeforeEvent: 45 },
        { title: 'Create guest list', priority: 'high', daysBeforeEvent: 30 },
        { title: 'Send invitations', priority: 'high', daysBeforeEvent: 21 },
        { title: 'Order cake', priority: 'high', daysBeforeEvent: 14 },
        { title: 'Buy decorations', priority: 'medium', daysBeforeEvent: 7 },
        { title: 'Confirm headcount', priority: 'high', daysBeforeEvent: 3 }
      ],
      [EventType.COMPANY]: [
        { title: 'Define objectives', priority: 'high', daysBeforeEvent: 90 },
        { title: 'Book venue', priority: 'high', daysBeforeEvent: 60 },
        { title: 'Send invitations', priority: 'high', daysBeforeEvent: 45 },
        { title: 'Arrange catering', priority: 'high', daysBeforeEvent: 30 },
        { title: 'Prepare presentations', priority: 'high', daysBeforeEvent: 14 },
        { title: 'Test AV equipment', priority: 'high', daysBeforeEvent: 3 },
        { title: 'Print materials', priority: 'medium', daysBeforeEvent: 3 }
      ]
    };

    return templates[eventType];
  }

  private static getDefaultTimelineSuggestions(eventType: EventType): AITimelineSuggestion[] {
    const templates: Record<EventType, AITimelineSuggestion[]> = {
      [EventType.WEDDING]: [
        { title: 'Ceremony', startTime: '14:00', endTime: '15:00' },
        { title: 'Cocktail Hour', startTime: '15:00', endTime: '16:00' },
        { title: 'Reception & Dinner', startTime: '16:00', endTime: '18:00' },
        { title: 'First Dance & Cake', startTime: '18:00', endTime: '18:30' },
        { title: 'Dancing & Party', startTime: '18:30', endTime: '22:00' }
      ],
      [EventType.BIRTHDAY]: [
        { title: 'Guest Arrival', startTime: '14:00', endTime: '14:30' },
        { title: 'Activities/Games', startTime: '14:30', endTime: '16:00' },
        { title: 'Cake & Presents', startTime: '16:00', endTime: '17:00' },
        { title: 'Free Time & Departure', startTime: '17:00', endTime: '18:00' }
      ],
      [EventType.COMPANY]: [
        { title: 'Registration', startTime: '08:00', endTime: '09:00' },
        { title: 'Opening Remarks', startTime: '09:00', endTime: '09:30' },
        { title: 'Presentations', startTime: '09:30', endTime: '12:00' },
        { title: 'Lunch Break', startTime: '12:00', endTime: '13:00' },
        { title: 'Workshops', startTime: '13:00', endTime: '16:00' },
        { title: 'Networking', startTime: '16:00', endTime: '17:00' }
      ]
    };

    return templates[eventType];
  }
}
