
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { BudgetCategoryModel, BudgetItemModel } from '../models/Budget';
import Event from '../models/Event';
import { BudgetSummary } from '../../../shared/types';

export const createCategory = async (req: AuthRequest, res: Response) => {
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

    const category = await BudgetCategoryModel.create({
      eventId: req.body.eventId,
      name: req.body.name,
      order: req.body.order || 0
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
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

    const categories = await BudgetCategoryModel.findAll({
      where: { eventId: req.params.eventId },
      include: [BudgetItemModel],
      order: [['order', 'ASC']]
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createItem = async (req: AuthRequest, res: Response) => {
  try {
    const item = await BudgetItemModel.create({
      categoryId: req.body.categoryId,
      name: req.body.name,
      estimatedCost: req.body.estimatedCost || 0,
      actualCost: req.body.actualCost || 0,
      notes: req.body.notes,
      order: req.body.order || 0
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const [updated] = await BudgetItemModel.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = await BudgetItemModel.findByPk(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await BudgetItemModel.destroy({
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

export const getBudgetSummary = async (req: AuthRequest, res: Response) => {
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

    const categories = await BudgetCategoryModel.findAll({
      where: { eventId: req.params.eventId },
      include: [BudgetItemModel]
    });

    let totalEstimated = 0;
    let totalActual = 0;
    const categorySummaries = [];

    for (const category of categories) {
      const items = await BudgetItemModel.findAll({
        where: { categoryId: category.id }
      });

      const categoryEstimated = items.reduce((sum, item) => 
        sum + parseFloat(item.estimatedCost.toString()), 0
      );
      const categoryActual = items.reduce((sum, item) => 
        sum + parseFloat(item.actualCost.toString()), 0
      );

      totalEstimated += categoryEstimated;
      totalActual += categoryActual;

      categorySummaries.push({
        name: category.name,
        estimated: categoryEstimated,
        actual: categoryActual
      });
    }

    const summary: BudgetSummary = {
      totalEstimated,
      totalActual,
      variance: totalActual - totalEstimated,
      categories: categorySummaries
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate summary' });
  }
};