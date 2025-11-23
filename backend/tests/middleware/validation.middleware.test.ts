import { Request, Response, NextFunction } from 'express';
import { validate } from '../../src/middleware/validation.middleware';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  describe('required fields', () => {
    it('should fail when required field is missing', () => {
      const middleware = validate([
        { field: 'email', required: true }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: ['email is required']
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should pass when required field is present', () => {
      mockRequest.body = { email: 'test@example.com' };
      const middleware = validate([
        { field: 'email', required: true }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('email validation', () => {
    it('should fail for invalid email', () => {
      mockRequest.body = { email: 'invalid-email' };
      const middleware = validate([
        { field: 'email', type: 'email' }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should pass for valid email', () => {
      mockRequest.body = { email: 'test@example.com' };
      const middleware = validate([
        { field: 'email', type: 'email' }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('string length validation', () => {
    it('should fail when string is too short', () => {
      mockRequest.body = { password: '123' };
      const middleware = validate([
        { field: 'password', minLength: 8 }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should fail when string is too long', () => {
      mockRequest.body = { name: 'a'.repeat(101) };
      const middleware = validate([
        { field: 'name', maxLength: 100 }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('number validation', () => {
    it('should fail when number is below minimum', () => {
      mockRequest.body = { guestCount: 0 };
      const middleware = validate([
        { field: 'guestCount', type: 'number', min: 1 }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should fail when number is above maximum', () => {
      mockRequest.body = { guestCount: 20000 };
      const middleware = validate([
        { field: 'guestCount', type: 'number', max: 10000 }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('date validation', () => {
    it('should fail for invalid date', () => {
      mockRequest.body = { eventDate: 'not-a-date' };
      const middleware = validate([
        { field: 'eventDate', type: 'date' }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should pass for valid date', () => {
      mockRequest.body = { eventDate: '2024-12-31' };
      const middleware = validate([
        { field: 'eventDate', type: 'date' }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('custom validation', () => {
    it('should use custom validation function', () => {
      mockRequest.body = { password: 'weakpassword' };
      const middleware = validate([
        {
          field: 'password',
          custom: (value) => /[A-Z]/.test(value) && /[0-9]/.test(value),
          message: 'Password must contain uppercase and number'
        }
      ]);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: ['Password must contain uppercase and number']
      });
    });
  });
});
