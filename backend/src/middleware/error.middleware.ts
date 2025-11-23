import { Request, Response, NextFunction } from 'express';
import i18next from '../config/i18n';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  const language = req.headers?.['accept-language'] || 'en';
  i18next.changeLanguage(language as string);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message
    });
    return;
  }

  if (error.name === 'SequelizeValidationError') {
    res.status(400).json({
      message: i18next.t('errors.validation'),
      details: error.message
    });
    return;
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    res.status(409).json({
      message: i18next.t('errors.duplicate')
    });
    return;
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    res.status(400).json({
      message: i18next.t('errors.foreignKey')
    });
    return;
  }

  res.status(500).json({
    message: i18next.t('errors.internal')
  });
};