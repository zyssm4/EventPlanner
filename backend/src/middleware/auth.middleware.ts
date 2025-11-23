import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/helpers';
import i18next from '../config/i18n';

export interface AuthRequest extends Request {
  userId?: string;
  language?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = (req as any).headers?.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: i18next.t('auth.noToken') });
      return;
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      res.status(401).json({ message: i18next.t('auth.invalidToken') });
      return;
    }

    req.userId = decoded.userId;
    const acceptLanguage = (req as any).headers?.['accept-language'];
    req.language = (typeof acceptLanguage === 'string' ? acceptLanguage : 'en');

    next();
  } catch (error) {
    res.status(401).json({ message: i18next.t('auth.invalidToken') });
  }
};
