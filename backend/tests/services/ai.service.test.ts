import { AIService } from '../../src/services/ai.service';
import { EventType, Language } from '../../../shared/types';

describe('AIService', () => {
  describe('isConfigured', () => {
    it('should return false when API key is not set', () => {
      delete process.env.OPENAI_API_KEY;
      expect(AIService.isConfigured()).toBe(false);
    });

    it('should return false when API key is placeholder', () => {
      process.env.OPENAI_API_KEY = 'your-openai-api-key-here';
      expect(AIService.isConfigured()).toBe(false);
    });
  });

  describe('generateBudgetSuggestions', () => {
    it('should return default suggestions when AI is not configured', async () => {
      delete process.env.OPENAI_API_KEY;
      const suggestions = await AIService.generateBudgetSuggestions(
        EventType.WEDDING,
        100,
        10000,
        Language.EN
      );

      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toHaveProperty('category');
      expect(suggestions[0]).toHaveProperty('items');
    });

    it('should return suggestions for different event types', async () => {
      const weddingSuggestions = await AIService.generateBudgetSuggestions(
        EventType.WEDDING, 100, 10000, Language.EN
      );
      const birthdaySuggestions = await AIService.generateBudgetSuggestions(
        EventType.BIRTHDAY, 50, 5000, Language.EN
      );
      const companySuggestions = await AIService.generateBudgetSuggestions(
        EventType.COMPANY, 200, 20000, Language.EN
      );

      expect(weddingSuggestions.length).toBeGreaterThan(0);
      expect(birthdaySuggestions.length).toBeGreaterThan(0);
      expect(companySuggestions.length).toBeGreaterThan(0);
    });
  });

  describe('generateChecklistSuggestions', () => {
    it('should return default checklist suggestions', async () => {
      const suggestions = await AIService.generateChecklistSuggestions(
        EventType.WEDDING,
        new Date('2024-12-31'),
        Language.EN
      );

      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toHaveProperty('title');
      expect(suggestions[0]).toHaveProperty('priority');
      expect(suggestions[0]).toHaveProperty('daysBeforeEvent');
    });
  });

  describe('generateTimelineSuggestions', () => {
    it('should return default timeline suggestions', async () => {
      const suggestions = await AIService.generateTimelineSuggestions(
        EventType.BIRTHDAY,
        new Date('2024-12-31'),
        50,
        Language.EN
      );

      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toHaveProperty('title');
      expect(suggestions[0]).toHaveProperty('startTime');
      expect(suggestions[0]).toHaveProperty('endTime');
    });
  });
});
