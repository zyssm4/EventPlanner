
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import ChecklistItemModel from '../models/Checklist';
import Event from '../models/Event';

export const createChecklistItem = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.body.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const item = await ChecklistItemModel.create({
      eventId: req.body.eventId,
      title: req.body.title,
      description: req.body.description,
      completed: false,
      dueDate: req.body.dueDate,
      order: req.body.order || 0
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checklist item' });
  }
};

export const getChecklistItems = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const items = await ChecklistItemModel.findAll({
      where: { eventId: req.params.eventId },
      order: [['order', 'ASC']]
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch checklist items' });
  }
};

export const updateChecklistItem = async (req: AuthRequest, res: Response) => {
  try {
    const [updated] = await ChecklistItemModel.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = await ChecklistItemModel.findByPk(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

export const deleteChecklistItem = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await ChecklistItemModel.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

export const toggleChecklistItem = async (req: AuthRequest, res: Response) => {
  try {
    const item = await ChecklistItemModel.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.completed = !item.completed;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle item' });
  }
};