
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { BudgetCategoryModel, BudgetItemModel } from '../models/Budget';
import Event from '../models/Event';
import { BudgetSummary } from '../types';

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const category = await BudgetCategoryModel.create({
      eventId: req.body.eventId,
      name: req.body.name,
      order: req.body.order || 0
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const categories = await BudgetCategoryModel.findAll({
      where: { eventId: req.params.eventId },
      include: [BudgetItemModel],
      order: [['order', 'ASC']]
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verify user owns the category via event
    const category = await BudgetCategoryModel.findByPk(req.params.id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const event = await Event.findOne({
      where: {
        id: category.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(403).json({ error: 'Not authorized to update this category' });
      return;
    }

    await BudgetCategoryModel.update(req.body, {
      where: { id: req.params.id }
    });

    const updatedCategory = await BudgetCategoryModel.findByPk(req.params.id);
    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verify user owns the category via event
    const category = await BudgetCategoryModel.findByPk(req.params.id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const event = await Event.findOne({
      where: {
        id: category.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(403).json({ error: 'Not authorized to delete this category' });
      return;
    }

    await BudgetCategoryModel.destroy({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

export const createItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verify user owns the category via event
    const category = await BudgetCategoryModel.findByPk(req.params.categoryId);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const event = await Event.findOne({
      where: {
        id: category.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(403).json({ error: 'Not authorized to add items to this category' });
      return;
    }

    const item = await BudgetItemModel.create({
      categoryId: req.params.categoryId,
      name: req.body.name,
      estimatedCost: req.body.estimatedCost || 0,
      actualCost: req.body.actualCost || 0,
      notes: req.body.notes,
      order: req.body.order || 0
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

export const updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verify user owns the item via category and event
    const item = await BudgetItemModel.findByPk(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const category = await BudgetCategoryModel.findByPk(item.categoryId);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const event = await Event.findOne({
      where: {
        id: category.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(403).json({ error: 'Not authorized to update this item' });
      return;
    }

    await BudgetItemModel.update(req.body, {
      where: { id: req.params.id }
    });

    const updatedItem = await BudgetItemModel.findByPk(req.params.id);
    res.json(updatedItem);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verify user owns the item via category and event
    const item = await BudgetItemModel.findByPk(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const category = await BudgetCategoryModel.findByPk(item.categoryId);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const event = await Event.findOne({
      where: {
        id: category.eventId,
        userId: req.userId!
      }
    });

    if (!event) {
      res.status(403).json({ error: 'Not authorized to delete this item' });
      return;
    }

    await BudgetItemModel.destroy({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

export const getBudgetSummary = async (req: AuthRequest, res: Response): Promise<void> => {
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
    console.error('Get budget summary error:', error);
    res.status(500).json({ error: 'Failed to calculate summary' });
  }
};
