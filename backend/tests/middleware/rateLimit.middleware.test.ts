import { Request, Response, NextFunction } from 'express';
import { rateLimit } from '../../src/middleware/rateLimit.middleware';

describe('Rate Limit Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      ip: '127.0.0.1',
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should allow requests within limit', () => {
    const middleware = rateLimit({ max: 5, windowMs: 60000 });

    // Make 5 requests
    for (let i = 0; i < 5; i++) {
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);
    }

    expect(nextFunction).toHaveBeenCalledTimes(5);
  });

  it('should block requests over limit', () => {
    const middleware = rateLimit({ max: 2, windowMs: 60000 });

    // Use unique IP for this test
    mockRequest.ip = '192.168.1.1';

    // Make 3 requests
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(2);
    expect(mockResponse.status).toHaveBeenCalledWith(429);
  });

  it('should set rate limit headers', () => {
    const middleware = rateLimit({ max: 10, windowMs: 60000 });

    // Use unique IP for this test
    mockRequest.ip = '10.0.0.1';

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 10);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', expect.any(Number));
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(Number));
  });

  it('should use custom key generator', () => {
    const middleware = rateLimit({
      max: 1,
      windowMs: 60000,
      keyGenerator: (req) => req.headers['x-api-key'] as string || 'anonymous'
    });

    mockRequest.headers = { 'x-api-key': 'unique-key-123' };

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(429);
  });

  it('should use custom error message', () => {
    const customMessage = 'Custom rate limit message';
    const middleware = rateLimit({
      max: 1,
      windowMs: 60000,
      message: customMessage
    });

    mockRequest.ip = '172.16.0.1';

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.json).toHaveBeenCalledWith({ error: customMessage });
  });
});
