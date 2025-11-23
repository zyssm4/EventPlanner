import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import TimelineEntryModel from '../models/Timeline';
import Event from '../models/Event';

export const getTimelineEntries = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const entries = await TimelineEntryModel.findAll({
      where: { eventId: req.params.eventId },
      order: [['startTime', 'ASC']]
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline entries' });
  }
};

export const createTimelineEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.body.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const entry = await TimelineEntryModel.create({
      eventId: req.body.eventId,
      title: req.body.title,
      description: req.body.description,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      responsiblePerson: req.body.responsiblePerson,
      order: req.body.order || 0
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create timeline entry' });
  }
};

export const updateTimelineEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [updated] = await TimelineEntryModel.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }

    const entry = await TimelineEntryModel.findByPk(req.params.id);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update entry' });
  }
};

export const deleteTimelineEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await TimelineEntryModel.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
};
