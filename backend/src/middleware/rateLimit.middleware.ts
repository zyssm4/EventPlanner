import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

interface RateLimitOptions {
  windowMs?: number;  // Time window in milliseconds
  max?: number;       // Max requests per window
  message?: string;   // Error message
  keyGenerator?: (req: Request) => string;  // Custom key generator
}

const defaultStore: RateLimitStore = {};

export const rateLimit = (options: RateLimitOptions = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute default
  const max = options.max || 100; // 100 requests default
  const message = options.message || 'Too many requests, please try again later';
  const keyGenerator = options.keyGenerator || ((req: Request) => {
    return req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
  });

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator(req);
    const now = Date.now();

    // Initialize or reset if window expired
    if (!defaultStore[key] || now > defaultStore[key].resetTime) {
      defaultStore[key] = {
        count: 0,
        resetTime: now + windowMs
      };
    }

    defaultStore[key].count++;

    // Check if over limit
    if (defaultStore[key].count > max) {
      const retryAfter = Math.ceil((defaultStore[key].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', defaultStore[key].resetTime);

      res.status(429).json({ error: message });
      return;
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - defaultStore[key].count));
    res.setHeader('X-RateLimit-Reset', defaultStore[key].resetTime);

    next();
  };
};

// Pre-configured rate limiters
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts, please try again in 15 minutes'
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'API rate limit exceeded, please slow down'
});

export const exportRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Export rate limit exceeded, please wait before exporting again'
});

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const key in defaultStore) {
    if (defaultStore[key].resetTime < now) {
      delete defaultStore[key];
    }
  }
}, 60 * 1000); // Cleanup every minute
