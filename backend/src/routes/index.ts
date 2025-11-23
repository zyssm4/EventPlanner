import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as eventController from '../controllers/event.controller';
import * as budgetController from '../controllers/budget.controller';
import * as checklistController from '../controllers/checklist.controller';
import * as timelineController from '../controllers/timeline.controller';
import * as supplierController from '../controllers/supplier.controller';
import * as exportController from '../controllers/export.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimit, exportRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// Auth routes (with rate limiting)
router.post('/auth/register', authRateLimit, authController.register);
router.post('/auth/login', authRateLimit, authController.login);
router.post('/auth/refresh', authController.refreshToken);
router.post('/auth/logout', authenticate, authController.logout);
router.get('/auth/me', authenticate, authController.getProfile);
router.patch('/auth/language', authenticate, authController.updateLanguage);

// Event routes
router.get('/events', authenticate, eventController.getEvents);
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
router.get('/events/:eventId/checklist', authenticate, checklistController.getChecklistItems);
router.post('/events/:eventId/checklist', authenticate, checklistController.createChecklistItem);
router.put('/checklist/:id', authenticate, checklistController.updateChecklistItem);
router.patch('/checklist/:id/toggle', authenticate, checklistController.toggleChecklistItem);
router.delete('/checklist/:id', authenticate, checklistController.deleteChecklistItem);
router.post('/events/:eventId/checklist/template', authenticate, checklistController.generateTemplate);

// Timeline routes
router.get('/events/:eventId/timeline', authenticate, timelineController.getTimelineEntries);
router.post('/events/:eventId/timeline', authenticate, timelineController.createTimelineEntry);
router.put('/timeline/:id', authenticate, timelineController.updateTimelineEntry);
router.delete('/timeline/:id', authenticate, timelineController.deleteTimelineEntry);

// Supplier routes
router.get('/suppliers', authenticate, supplierController.getSuppliers);
router.get('/suppliers/:id', authenticate, supplierController.getSupplier);
router.post('/suppliers', authenticate, supplierController.createSupplier);
router.put('/suppliers/:id', authenticate, supplierController.updateSupplier);
router.delete('/suppliers/:id', authenticate, supplierController.deleteSupplier);

// Venue routes
router.get('/events/:eventId/venue', authenticate, supplierController.getVenue);
router.post('/events/:eventId/venue', authenticate, supplierController.createVenue);
router.put('/venues/:id', authenticate, supplierController.updateVenue);
router.delete('/venues/:id', authenticate, supplierController.deleteVenue);

// Export routes (with rate limiting)
router.get('/events/:eventId/export/pdf', authenticate, exportRateLimit, exportController.exportEventPlanPDF);
router.get('/events/:eventId/export/excel', authenticate, exportRateLimit, exportController.exportBudgetExcel);
router.get('/events/:eventId/export/json', authenticate, exportRateLimit, exportController.exportEventJSON);

export default router;
