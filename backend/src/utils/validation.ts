import { EventType, Language } from '../types';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  return password.length >= 8;
};

export const isValidEventType = (type: string): type is EventType => {
  return Object.values(EventType).includes(type as EventType);
};

export const isValidLanguage = (lang: string): lang is Language => {
  return Object.values(Language).includes(lang as Language);
};

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

export const validateRequiredFields = (
  data: Record<string, unknown>,
  requiredFields: string[]
): { valid: boolean; missing: string[] } => {
  const missing = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  return {
    valid: missing.length === 0,
    missing
  };
};

export const validateNumberRange = (
  value: number,
  min?: number,
  max?: number
): boolean => {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
};
