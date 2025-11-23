
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
