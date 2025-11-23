import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PDFService } from '../services/pdf.service';
import { ExcelService } from '../services/excel.service';
import Event from '../models/Event';
import User from '../models/User';
import { Language } from '../types';

export const exportEventPlanPDF = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const user = await User.findByPk(req.userId!);
    const language = user?.language || Language.EN;

    const pdf = await PDFService.generateEventPlanPDF(req.params.eventId, language);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="event-plan-${event.name}.pdf"`);
    res.send(pdf);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export event plan' });
  }
};

export const exportBudgetPDF = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const user = await User.findByPk(req.userId!);
    const language = user?.language || Language.EN;

    const pdf = await PDFService.generateBudgetPDF(req.params.eventId, language);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="budget-${event.name}.pdf"`);
    res.send(pdf);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export budget' });
  }
};

export const exportBudgetExcel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const user = await User.findByPk(req.userId!);
    const language = user?.language || Language.EN;

    const excel = await ExcelService.generateBudgetExcel(req.params.eventId, language);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="budget-${event.name}.xlsx"`);
    res.send(excel);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export budget' });
  }
};

export const exportChecklistPDF = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const user = await User.findByPk(req.userId!);
    const language = user?.language || Language.EN;

    const pdf = await PDFService.generateChecklistPDF(req.params.eventId, language);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="checklist-${event.name}.pdf"`);
    res.send(pdf);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export checklist' });
  }
};

export const exportEventJSON = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Export complete event data including all relations
    const eventData = event.toJSON();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="event-${event.name}.json"`);
    res.json(eventData);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export event data' });
  }
};
