import { EventType, Language } from '../../../shared/types';
import i18next from '../config/i18n';

export class TemplateService {
  static async getChecklistTemplate(eventType: EventType, language: Language): Promise<string[]> {
    await i18next.changeLanguage(language);

    const key = `templates.${eventType}.checklist`;
    const checklist = i18next.t(key, { returnObjects: true });

    if (Array.isArray(checklist)) {
      return checklist;
    }

    return [];
  }

  static getBudgetCategories(language: Language): string[] {
    i18next.changeLanguage(language);

    return [
      i18next.t('categories.venue'),
      i18next.t('categories.food'),
      i18next.t('categories.drinks'),
      i18next.t('categories.decoration'),
      i18next.t('categories.entertainment'),
      i18next.t('categories.photography'),
      i18next.t('categories.flowers'),
      i18next.t('categories.transportation'),
      i18next.t('categories.attire'),
      i18next.t('categories.stationery'),
      i18next.t('categories.staff'),
      i18next.t('categories.extras')
    ];
  }

  static getBudgetSuggestion(eventType: EventType, guestCount: number): number {
    const baseAmounts: Record<EventType, number> = {
      [EventType.WEDDING]: 150,
      [EventType.BIRTHDAY]: 50,
      [EventType.COMPANY]: 100
    };

    return baseAmounts[eventType] * guestCount;
  }
}
