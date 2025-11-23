import { TemplateService } from '../../src/services/template.service';
import { EventType, Language } from '../../../shared/types';

describe('TemplateService', () => {
  describe('getBudgetCategories', () => {
    it('should return budget categories', () => {
      const categories = TemplateService.getBudgetCategories(Language.EN);

      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  describe('getBudgetSuggestion', () => {
    it('should calculate budget based on event type and guest count', () => {
      const weddingBudget = TemplateService.getBudgetSuggestion(EventType.WEDDING, 100);
      const birthdayBudget = TemplateService.getBudgetSuggestion(EventType.BIRTHDAY, 50);
      const companyBudget = TemplateService.getBudgetSuggestion(EventType.COMPANY, 200);

      expect(weddingBudget).toBe(15000); // 150 * 100
      expect(birthdayBudget).toBe(2500);  // 50 * 50
      expect(companyBudget).toBe(20000);  // 100 * 200
    });
  });

  describe('getChecklistTemplate', () => {
    it('should return checklist template for event type', async () => {
      const template = await TemplateService.getChecklistTemplate(
        EventType.WEDDING,
        Language.EN
      );

      expect(template).toBeDefined();
      expect(Array.isArray(template)).toBe(true);
    });
  });
});
