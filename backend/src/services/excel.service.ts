
import ExcelJS from 'exceljs';
import { Language } from '../../../shared/types';
import i18next from '../config/i18n';
import Event from '../models/Event';
import { BudgetCategoryModel, BudgetItemModel } from '../models/Budget';

export class ExcelService {
  static async generateBudgetExcel(eventId: string, language: Language): Promise<Buffer> {
    i18next.changeLanguage(language);

    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(i18next.t('excel.budget'));

    // Header
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = i18next.t('excel.budget_for', { name: event.name });
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Column headers
    worksheet.addRow([]);
    const headerRow = worksheet.addRow([
      i18next.t('excel.category'),
      i18next.t('excel.item'),
      i18next.t('excel.estimated'),
      i18next.t('excel.actual'),
      i18next.t('excel.difference')
    ]);

    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Data rows
    const categories = await BudgetCategoryModel.findAll({
      where: { eventId },
      include: [BudgetItemModel],
      order: [['order', 'ASC']]
    });

    let totalEstimated = 0;
    let totalActual = 0;

    for (const category of categories) {
      const items = await BudgetItemModel.findAll({
        where: { categoryId: category.id },
        order: [['order', 'ASC']]
      });

      let firstItem = true;

      for (const item of items) {
        const estimated = parseFloat(item.estimatedCost.toString());
        const actual = parseFloat(item.actualCost.toString());
        const diff = actual - estimated;

        totalEstimated += estimated;
        totalActual += actual;

        const row = worksheet.addRow([
          firstItem ? category.name : '',
          item.name,
          estimated,
          actual,
          diff
        ]);

        // Format currency columns
        row.getCell(3).numFmt = language === Language.EN ? '$#,##0.00' : '#,##0.00 €';
        row.getCell(4).numFmt = language === Language.EN ? '$#,##0.00' : '#,##0.00 €';
        row.getCell(5).numFmt = language === Language.EN ? '$#,##0.00' : '#,##0.00 €';

        // Color code difference
        if (diff > 0) {
          row.getCell(5).font = { color: { argb: 'FFFF0000' } };
        } else if (diff < 0) {
          row.getCell(5).font = { color: { argb: 'FF00AA00' } };
        }

        firstItem = false;
      }
    }

    // Total row
    worksheet.addRow([]);
    const totalRow = worksheet.addRow([
      '',
      i18next.t('excel.total'),
      totalEstimated,
      totalActual,
      totalActual - totalEstimated
    ]);

    totalRow.font = { bold: true };
    totalRow.getCell(3).numFmt = language === Language.EN ? '$#,##0.00' : '#,##0.00 €';
    totalRow.getCell(4).numFmt = language === Language.EN ? '$#,##0.00' : '#,##0.00 €';
    totalRow.getCell(5).numFmt = language === Language.EN ? '$#,##0.00' : '#,##0.00 €';

    // Column widths
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
```

### `backend/src/services/ai.service.ts`

```typescript
import { EventType, Language } from '../../../shared/types';
import i18next from '../config/i18n';
import { TemplateService } from './template.service';

export class AIService {
  // Simple AI-like suggestions based on templates and rules
  static async suggestBudget(eventType: EventType, guestCount: number, language: Language) {
    i18next.changeLanguage(language);

    const baseAmount = TemplateService.getBudgetSuggestion(eventType, guestCount);
    const template = TemplateService.getEventTemplate(eventType, language);

    const categoryBreakdown = this.calculateCategoryBreakdown(eventType, baseAmount);

    return {
      totalSuggested: baseAmount,
      categories: template.budgetCategories.map((name, index) => ({
        name,
        suggestedAmount: categoryBreakdown[index] || 0,
        description: i18next.t(`ai.budget_suggestion.${eventType}.${index}`)
      })),
      tips: this.getBudgetTips(eventType, language)
    };
  }

  private static calculateCategoryBreakdown(eventType: EventType, total: number): number[] {
    const distributions = {
      wedding: [0.30, 0.25, 0.10, 0.08, 0.07, 0.05, 0.03, 0.04, 0.05, 0.03],
      birthday: [0.25, 0.30, 0.15, 0.15, 0.10, 0.03, 0.02],
      company: [0.30, 0.25, 0.15, 0.10, 0.05, 0.05, 0.05, 0.05]
    };

    return distributions[eventType].map(pct => Math.round(total * pct));
  }

  private static getBudgetTips(eventType: EventType, language: Language): string[] {
    i18next.changeLanguage(language);

    const tips = {
      wedding: [
        i18next.t('ai.tips.wedding.1'),
        i18next.t('ai.tips.wedding.2'),
        i18next.t('ai.tips.wedding.3'),
        i18next.t('ai.tips.wedding.4')
      ],
      birthday: [
        i18next.t('ai.tips.birthday.1'),
        i18next.t('ai.tips.birthday.2'),
        i18next.t('ai.tips.birthday.3')
      ],
      company: [
        i18next.t('ai.tips.company.1'),
        i18next.t('ai.tips.company.2'),
        i18next.t('ai.tips.company.3'),
        i18next.t('ai.tips.company.4')
      ]
    };

    return tips[eventType];
  }

  static async generateTimeline(eventType: EventType, eventDate: Date, language: Language) {
    i18next.changeLanguage(language);

    const template = TemplateService.getEventTemplate(eventType, language);

    return {
      entries: template.timelineEntries.map((entry, index) => ({
        ...entry,
        startTime: this.calculateTimeSlot(eventDate, entry.timing),
        order: index
      })),
      suggestions: [
        i18next.t(`ai.timeline_suggestion.${eventType}.1`),
        i18next.t(`ai.timeline_suggestion.${eventType}.2`)
      ]
    };
  }

  private static calculateTimeSlot(baseDate: Date, timing: string): Date {
    const [hours, minutes] = timing.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  static async generateInvitationText(
    eventType: EventType,
    eventName: string,
    eventDate: Date,
    venue: string,
    language: Language
  ): Promise<string> {
    i18next.changeLanguage(language);

    const dateStr = new Intl.DateTimeFormat(
      language === Language.EN ? 'en-US' : language === Language.FR ? 'fr-FR' : 'de-DE',
      { dateStyle: 'full', timeStyle: 'short' }
    ).format(eventDate);

    const templates = {
      wedding: i18next.t('ai.invitation.wedding', { name: eventName, date: dateStr, venue }),
      birthday: i18next.t('ai.invitation.birthday', { name: eventName, date: dateStr, venue }),
      company: i18next.t('ai.invitation.company', { name: eventName, date: dateStr, venue })
    };

    return templates[eventType];
  }

  static async generateSupplierEmail(
    supplierName: string,
    eventType: EventType,
    eventDate: Date,
    requirements: string,
    language: Language
  ): Promise<string> {
    i18next.changeLanguage(language);

    const dateStr = new Intl.DateTimeFormat(
      language === Language.EN ? 'en-US' : language === Language.FR ? 'fr-FR' : 'de-DE',
      { dateStyle: 'long' }
    ).format(eventDate);

    return i18next.t('ai.supplier_email', {
      supplier: supplierName,
      eventType: i18next.t(`event_types.${eventType}`),
      date: dateStr,
      requirements
    });
  }
}