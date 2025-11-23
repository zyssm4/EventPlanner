
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { SupplierModel, VenueModel } from '../models/Supplier';
import Event from '../models/Event';

export const createSupplier = async (req: AuthRequest, res: Response) => {
  try {
    const supplier = await SupplierModel.create({
      userId: req.userId!,
      ...req.body
    });

    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier' });
  }
};

export const getSuppliers = async (req: AuthRequest, res: Response) => {
  try {
    const suppliers = await SupplierModel.findAll({
      where: { userId: req.userId! },
      order: [['name', 'ASC']]
    });

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};

export const getSupplier = async (req: AuthRequest, res: Response) => {
  try {
    const supplier = await SupplierModel.findOne({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
};

export const updateSupplier = async (req: AuthRequest, res: Response) => {
  try {
    const [updated] = await SupplierModel.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const supplier = await SupplierModel.findByPk(req.params.id);
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update supplier' });
  }
};

export const deleteSupplier = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await SupplierModel.destroy({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
};

export const createVenue = async (req: AuthRequest, res: Response) => {
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

    const venue = await VenueModel.create(req.body);

    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create venue' });
  }
};

export const getVenue = async (req: AuthRequest, res: Response) => {
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

    const venue = await VenueModel.findOne({
      where: { eventId: req.params.eventId }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
};

export const updateVenue = async (req: AuthRequest, res: Response) => {
  try {
    const [updated] = await VenueModel.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    const venue = await VenueModel.findByPk(req.params.id);
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update venue' });
  }
};

export const deleteVenue = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await VenueModel.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete venue' });
  }
};