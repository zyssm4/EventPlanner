import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as eventController from '../controllers/event.controller';
import * as budgetController from '../controllers/budget.controller';
import * as checklistController from '../controllers/checklist.controller';
import * as timelineController from '../controllers/timeline.controller';
import * as supplierController from '../controllers/supplier.controller';
import * as exportController from '../controllers/export.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refreshToken);
router.post('/auth/logout', authenticate, authController.logout);
router.get('/auth/me', authenticate, authController.getProfile);
router.patch('/auth/language', authenticate, authController.updateLanguage);

// Event routes
router.get('/events', authenticate, eventController.getAllEvents);
router.get('/events/:id', authenticate, eventController.getEvent);
router.post('/events', authenticate, eventController.createEvent);
router.put('/events/:id', authenticate, eventController.updateEvent);
router.delete('/events/:id', authenticate, eventController.deleteEvent);
router.post('/events/:id/duplicate', authenticate, eventController.duplicateEvent);

// Budget routes
router.get('/events/:eventId/budget', authenticate, budgetController.getBudgetSummary);
router.post('/events/:eventId/budget/categories', authenticate, budgetController.createCategory);
router.put('/budget/categories/:id', authenticate, budgetController.updateCategory);
router.delete('/budget/categories/:id', authenticate, budgetController.deleteCategory);
router.post('/budget/categories/:categoryId/items', authenticate, budgetController.createItem);
router.put('/budget/items/:id', authenticate, budgetController.updateItem);
router.delete('/budget/items/:id', authenticate, budgetController.deleteItem);

// Checklist routes
router.get('/events/:eventId/checklist', authenticate, checklistController.getChecklist);
router.post('/events/:eventId/checklist', authenticate, checklistController.createItem);
router.put('/checklist/:id', authenticate, checklistController.updateItem);
router.patch('/checklist/:id/toggle', authenticate, checklistController.toggleComplete);
router.delete('/checklist/:id', authenticate, checklistController.deleteItem);
router.post('/events/:eventId/checklist/template', authenticate, checklistController.generateTemplate);

// Timeline routes
router.get('/events/:eventId/timeline', authenticate, timelineController.getTimeline);
router.post('/events/:eventId/timeline', authenticate, timelineController.createEntry);
router.put('/timeline/:id', authenticate, timelineController.updateEntry);
router.delete('/timeline/:id', authenticate, timelineController.deleteEntry);

// Supplier routes
router.get('/suppliers', authenticate, supplierController.getAllSuppliers);
router.get('/suppliers/:id', authenticate, supplierController.getSupplier);
router.post('/suppliers', authenticate, supplierController.createSupplier);
router.put('/suppliers/:id', authenticate, supplierController.updateSupplier);
router.delete('/suppliers/:id', authenticate, supplierController.deleteSupplier);

// Venue routes
router.get('/events/:eventId/venue', authenticate, supplierController.getVenue);
router.post('/events/:eventId/venue', authenticate, supplierController.createVenue);
router.put('/venues/:id', authenticate, supplierController.updateVenue);
router.delete('/venues/:id', authenticate, supplierController.deleteVenue);

// Export routes
router.get('/events/:eventId/export/pdf', authenticate, exportController.exportPDF);
router.get('/events/:eventId/export/excel', authenticate, exportController.exportExcel);
router.get('/events/:eventId/export/json', authenticate, exportController.exportJSON);

export default router;
