import { Request, Response, NextFunction } from 'express';

interface ValidationRule {
  field: string;
  type?: 'string' | 'number' | 'email' | 'date' | 'boolean' | 'array';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      // Required check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(rule.message || `${rule.field} is required`);
        continue;
      }

      // Skip other validations if field is not present and not required
      if (value === undefined || value === null) continue;

      // Type checks
      if (rule.type) {
        switch (rule.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`${rule.field} must be a string`);
            }
            break;
          case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
              errors.push(`${rule.field} must be a number`);
            }
            break;
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              errors.push(`${rule.field} must be a valid email`);
            }
            break;
          case 'date':
            if (isNaN(Date.parse(value))) {
              errors.push(`${rule.field} must be a valid date`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`${rule.field} must be a boolean`);
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push(`${rule.field} must be an array`);
            }
            break;
        }
      }

      // String length checks
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
        }
      }

      // Number range checks
      if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors.push(`${rule.field} must be at least ${rule.min}`);
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push(`${rule.field} must be at most ${rule.max}`);
        }
      }

      // Pattern check
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push(rule.message || `${rule.field} has invalid format`);
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push(rule.message || `${rule.field} is invalid`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
};

// Pre-built validation rules for common use cases
export const registerValidation = validate([
  { field: 'email', type: 'email', required: true },
  {
    field: 'password',
    type: 'string',
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  },
  { field: 'name', type: 'string', required: true, minLength: 2, maxLength: 100 }
]);

export const loginValidation = validate([
  { field: 'email', type: 'email', required: true },
  { field: 'password', type: 'string', required: true }
]);

export const eventValidation = validate([
  { field: 'name', type: 'string', required: true, minLength: 1, maxLength: 200 },
  { field: 'type', type: 'string', required: true },
  { field: 'date', type: 'date', required: true },
  { field: 'guestCount', type: 'number', min: 1, max: 10000 }
]);

export const budgetItemValidation = validate([
  { field: 'name', type: 'string', required: true, maxLength: 200 },
  { field: 'estimatedCost', type: 'number', min: 0 },
  { field: 'actualCost', type: 'number', min: 0 }
]);

export const checklistItemValidation = validate([
  { field: 'title', type: 'string', required: true, maxLength: 500 },
  { field: 'dueDate', type: 'date' }
]);

export const supplierValidation = validate([
  { field: 'name', type: 'string', required: true, maxLength: 200 },
  { field: 'email', type: 'email' },
  { field: 'phone', type: 'string', maxLength: 50 }
]);
