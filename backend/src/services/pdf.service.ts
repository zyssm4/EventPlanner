
import PDFDocument from 'pdfkit';
import { Language, EventType } from '../../../shared/types';
import i18next from '../config/i18n';
import Event from '../models/Event';
import { BudgetCategoryModel, BudgetItemModel } from '../models/Budget';
import ChecklistItemModel from '../models/Checklist';
import TimelineEntryModel from '../models/Timeline';
import { VenueModel } from '../models/Supplier';

export class PDFService {
  private static formatCurrency(amount: number, language: Language): string {
    const locale = language === Language.EN ? 'en-US' : 
                   language === Language.FR ? 'fr-FR' : 'de-DE';
    const currency = language === Language.EN ? 'USD' : 'EUR';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount);
  }

  private static formatDate(date: Date, language: Language): string {
    const locale = language === Language.EN ? 'en-US' : 
                   language === Language.FR ? 'fr-FR' : 'de-DE';
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  static async generateEventPlanPDF(eventId: string, language: Language): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        i18next.changeLanguage(language);

        const event = await Event.findByPk(eventId);
        if (!event) {
          throw new Error('Event not found');
        }

        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Header
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text(i18next.t('pdf.event_plan'), { align: 'center' });

        doc.moveDown();
        doc.fontSize(12)
           .font('Helvetica')
           .text(`${i18next.t('pdf.event_name')}: ${event.name}`)
           .text(`${i18next.t('pdf.event_type')}: ${i18next.t(`event_types.${event.type}`)}`)
           .text(`${i18next.t('pdf.event_date')}: ${this.formatDate(event.date, language)}`)
           .text(`${i18next.t('pdf.guest_count')}: ${event.guestCount}`);

        if (event.description) {
          doc.moveDown()
             .text(`${i18next.t('pdf.description')}: ${event.description}`);
        }

        doc.moveDown(2);

        // Budget Section
        doc.fontSize(18)
           .font('Helvetica-Bold')
           .text(i18next.t('pdf.budget_overview'));

        doc.moveDown();

        const categories = await BudgetCategoryModel.findAll({
          where: { eventId },
          include: [BudgetItemModel],
          order: [['order', 'ASC']]
        });

        let totalEstimated = 0;
        let totalActual = 0;

        for (const category of categories) {
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .text(category.name);

          const items = await BudgetItemModel.findAll({
            where: { categoryId: category.id },
            order: [['order', 'ASC']]
          });

          doc.fontSize(10).font('Helvetica');

          for (const item of items) {
            const estimated = parseFloat(item.estimatedCost.toString());
            const actual = parseFloat(item.actualCost.toString());
            totalEstimated += estimated;
            totalActual += actual;

            doc.text(
              `  • ${item.name}: ${this.formatCurrency(estimated, language)} / ${this.formatCurrency(actual, language)}`
            );
          }

          doc.moveDown(0.5);
        }

        doc.moveDown();
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text(`${i18next.t('pdf.total_estimated')}: ${this.formatCurrency(totalEstimated, language)}`)
           .text(`${i18next.t('pdf.total_actual')}: ${this.formatCurrency(totalActual, language)}`)
           .text(`${i18next.t('pdf.variance')}: ${this.formatCurrency(totalActual - totalEstimated, language)}`);

        doc.addPage();

        // Checklist Section
        doc.fontSize(18)
           .font('Helvetica-Bold')
           .text(i18next.t('pdf.checklist'));

        doc.moveDown();

        const checklistItems = await ChecklistItemModel.findAll({
          where: { eventId },
          order: [['order', 'ASC']]
        });

        doc.fontSize(10).font('Helvetica');

        for (const item of checklistItems) {
          const status = item.completed ? '☑' : '☐';
          doc.text(`${status} ${item.title}`);
          
          if (item.description) {
            doc.fontSize(9)
               .text(`   ${item.description}`, { indent: 20 });
          }

          if (item.dueDate) {
            doc.fontSize(9)
               .text(`   ${i18next.t('pdf.due')}: ${this.formatDate(item.dueDate, language)}`, { indent: 20 });
          }

          doc.fontSize(10).moveDown(0.3);
        }

        doc.addPage();

        // Timeline Section
        doc.fontSize(18)
           .font('Helvetica-Bold')
           .text(i18next.t('pdf.timeline'));

        doc.moveDown();

        const timelineEntries = await TimelineEntryModel.findAll({
          where: { eventId },
          order: [['startTime', 'ASC']]
        });

        doc.fontSize(10).font('Helvetica');

        for (const entry of timelineEntries) {
          const startTime = new Intl.DateTimeFormat(
            language === Language.EN ? 'en-US' : language === Language.FR ? 'fr-FR' : 'de-DE',
            { hour: '2-digit', minute: '2-digit' }
          ).format(entry.startTime);

          doc.font('Helvetica-Bold')
             .text(`${startTime} - ${entry.title}`);

          if (entry.description) {
            doc.font('Helvetica')
               .text(`   ${entry.description}`, { indent: 20 });
          }

          if (entry.responsiblePerson) {
            doc.text(`   ${i18next.t('pdf.responsible')}: ${entry.responsiblePerson}`, { indent: 20 });
          }

          doc.moveDown(0.5);
        }

        // Venue Section
        const venue = await VenueModel.findOne({ where: { eventId } });
        
        if (venue) {
          doc.addPage();
          doc.fontSize(18)
             .font('Helvetica-Bold')
             .text(i18next.t('pdf.venue_information'));

          doc.moveDown();
          doc.fontSize(10)
             .font('Helvetica')
             .text(`${i18next.t('pdf.venue_name')}: ${venue.name}`)
             .text(`${i18next.t('pdf.address')}: ${venue.address}`)
             .text(`${i18next.t('pdf.capacity')}: ${venue.capacity}`)
             .text(`${i18next.t('pdf.contact')}: ${venue.contact}`);

          if (venue.phone) {
            doc.text(`${i18next.t('pdf.phone')}: ${venue.phone}`);
          }

          if (venue.email) {
            doc.text(`${i18next.t('pdf.email')}: ${venue.email}`);
          }

          if (venue.openingHours) {
            doc.text(`${i18next.t('pdf.opening_hours')}: ${venue.openingHours}`);
          }
        }

        // Footer
        doc.fontSize(8)
           .text(
             `${i18next.t('pdf.generated')}: ${this.formatDate(new Date(), language)}`,
             50,
             doc.page.height - 50,
             { align: 'center' }
           );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  static async generateBudgetPDF(eventId: string, language: Language): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        i18next.changeLanguage(language);

        const event = await Event.findByPk(eventId);
        if (!event) {
          throw new Error('Event not found');
        }

        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Header
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text(i18next.t('pdf.budget_report'), { align: 'center' });

        doc.moveDown();
        doc.fontSize(12)
           .font('Helvetica')
           .text(`${i18next.t('pdf.event_name')}: ${event.name}`)
           .text(`${i18next.t('pdf.event_date')}: ${this.formatDate(event.date, language)}`);

        doc.moveDown(2);

        // Table header
        const tableTop = doc.y;
        const col1 = 50;
        const col2 = 250;
        const col3 = 350;
        const col4 = 450;

        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text(i18next.t('pdf.item'), col1, tableTop)
           .text(i18next.t('pdf.estimated'), col2, tableTop)
           .text(i18next.t('pdf.actual'), col3, tableTop)
           .text(i18next.t('pdf.difference'), col4, tableTop);

        doc.moveTo(col1, tableTop + 15)
           .lineTo(550, tableTop + 15)
           .stroke();

        let y = tableTop + 25;
        let totalEstimated = 0;
        let totalActual = 0;

        const categories = await BudgetCategoryModel.findAll({
          where: { eventId },
          include: [BudgetItemModel],
          order: [['order', 'ASC']]
        });

        for (const category of categories) {
          doc.fontSize(11)
             .font('Helvetica-Bold')
             .text(category.name, col1, y);

          y += 20;

          const items = await BudgetItemModel.findAll({
            where: { categoryId: category.id },
            order: [['order', 'ASC']]
          });

          doc.fontSize(9).font('Helvetica');

          for (const item of items) {
            const estimated = parseFloat(item.estimatedCost.toString());
            const actual = parseFloat(item.actualCost.toString());
            const diff = actual - estimated;
            
            totalEstimated += estimated;
            totalActual += actual;

            if (y > 700) {
              doc.addPage();
              y = 50;
            }

            doc.text(item.name, col1 + 10, y)
               .text(this.formatCurrency(estimated, language), col2, y)
               .text(this.formatCurrency(actual, language), col3, y)
               .text(this.formatCurrency(diff, language), col4, y);

            y += 15;
          }

          y += 10;
        }

        // Total row
        y += 10;
        doc.moveTo(col1, y)
           .lineTo(550, y)
           .stroke();

        y += 10;

        const totalDiff = totalActual - totalEstimated;

        doc.fontSize(11)
           .font('Helvetica-Bold')
           .text(i18next.t('pdf.total'), col1, y)
           .text(this.formatCurrency(totalEstimated, language), col2, y)
           .text(this.formatCurrency(totalActual, language), col3, y)
           .text(this.formatCurrency(totalDiff, language), col4, y);

        // Footer
        doc.fontSize(8)
           .font('Helvetica')
           .text(
             `${i18next.t('pdf.generated')}: ${this.formatDate(new Date(), language)}`,
             50,
             doc.page.height - 50,
             { align: 'center' }
           );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  static async generateChecklistPDF(eventId: string, language: Language): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        i18next.changeLanguage(language);

        const event = await Event.findByPk(eventId);
        if (!event) {
          throw new Error('Event not found');
        }

        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Header
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text(i18next.t('pdf.checklist_report'), { align: 'center' });

        doc.moveDown();
        doc.fontSize(12)
           .font('Helvetica')
           .text(`${i18next.t('pdf.event_name')}: ${event.name}`)
           .text(`${i18next.t('pdf.event_date')}: ${this.formatDate(event.date, language)}`);

        doc.moveDown(2);

        const checklistItems = await ChecklistItemModel.findAll({
          where: { eventId },
          order: [['order', 'ASC']]
        });

        const completed = checklistItems.filter(item => item.completed).length;
        const total = checklistItems.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text(`${i18next.t('pdf.progress')}: ${completed}/${total} (${percentage}%)`);

        doc.moveDown(2);

        doc.fontSize(10).font('Helvetica');

        for (const item of checklistItems) {
          const checkbox = item.completed ? '☑' : '☐';
          
          doc.font('Helvetica-Bold')
             .text(`${checkbox} ${item.title}`);

          if (item.description) {
            doc.font('Helvetica')
               .fontSize(9)
               .text(item.description, { indent: 20 });
          }

          if (item.dueDate) {
            const dueText = `${i18next.t('pdf.due')}: ${this.formatDate(item.dueDate, language)}`;
            const isOverdue = !item.completed && item.dueDate < new Date();
            
            doc.fontSize(9)
               .fillColor(isOverdue ? 'red' : 'black')
               .text(dueText, { indent: 20 })
               .fillColor('black');
          }

          doc.fontSize(10).moveDown(0.8);
        }

        // Footer
        doc.fontSize(8)
           .text(
             `${i18next.t('pdf.generated')}: ${this.formatDate(new Date(), language)}`,
             50,
             doc.page.height - 50,
             { align: 'center' }
           );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}