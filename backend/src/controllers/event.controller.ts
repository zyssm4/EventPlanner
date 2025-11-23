
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Event from '../models/Event';
import { EventType } from '../types';

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.create({
      userId: req.userId!,
      name: req.body.name,
      type: req.body.type as EventType,
      date: req.body.date,
      guestCount: req.body.guestCount,
      description: req.body.description
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const getEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const events = await Event.findAll({
      where: { userId: req.userId! },
      order: [['date', 'DESC']]
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [updated] = await Event.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!updated) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const event = await Event.findByPk(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await Event.destroy({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!deleted) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

export const duplicateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const original = await Event.findOne({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!original) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const duplicate = await Event.create({
      userId: req.userId!,
      name: `${original.name} (Copy)`,
      type: original.type,
      date: original.date,
      guestCount: original.guestCount,
      description: original.description
    });

    res.status(201).json(duplicate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate event' });
  }
};
