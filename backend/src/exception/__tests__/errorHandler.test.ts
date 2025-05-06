import { Request, Response, NextFunction } from 'express';
import { 
  DatabaseError, 
  ValidationError, 
  NotFoundError, 
  errorHandler 
} from '../../exception/errorHandler';
import logger from '../../utils/logger';

jest.mock('../../utils/logger', () => ({
  error: jest.fn()
}));

describe('Custom Error Classes', () => {
  describe('DatabaseError', () => {
    it('should create an error with the correct name and message', () => {
      const errorMessage = 'Database connection failed';
      
      const error = new DatabaseError(errorMessage);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('DatabaseError');
      expect(error.message).toBe(errorMessage);
    });
  });

  describe('ValidationError', () => {
    it('should create an error with the correct name and message', () => {
      const errorMessage = 'Invalid input data';
      
      const error = new ValidationError(errorMessage);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe(errorMessage);
    });
  });

  describe('NotFoundError', () => {
    it('should create an error with the correct name and message', () => {
      const errorMessage = 'Resource not found';
      
      const error = new NotFoundError(errorMessage);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe(errorMessage);
    });
  });
});

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    jsonSpy = jest.fn();
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });
    
    mockRequest = {};
    mockResponse = {
      status: statusSpy,
      json: jsonSpy
    };
    mockNext = jest.fn();
  });

  it('should handle DatabaseError with 503 status code', () => {
    const errorMessage = 'Database connection failed';
    const error = new DatabaseError(errorMessage);
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(logger.error).toHaveBeenCalledWith(`Error: ${errorMessage}`, { stack: error.stack });
    expect(statusSpy).toHaveBeenCalledWith(503);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: 'Database Error',
      message: errorMessage
    });
  });

  it('should handle ValidationError with 400 status code', () => {
    const errorMessage = 'Invalid input data';
    const error = new ValidationError(errorMessage);
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(logger.error).toHaveBeenCalledWith(`Error: ${errorMessage}`, { stack: error.stack });
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: 'Validation Error',
      message: errorMessage
    });
  });

  it('should handle NotFoundError with 404 status code', () => {
    const errorMessage = 'Resource not found';
    const error = new NotFoundError(errorMessage);
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(logger.error).toHaveBeenCalledWith(`Error: ${errorMessage}`, { stack: error.stack });
    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: 'Resource Not Found Error',
      message: errorMessage
    });
  });

  it('should handle generic Error with 500 status code', () => {
    const errorMessage = 'Something went wrong';
    const error = new Error(errorMessage);
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(logger.error).toHaveBeenCalledWith(`Error: ${errorMessage}`, { stack: error.stack });
    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  });

  it('should handle errors without a stack trace', () => {
    const errorMessage = 'Error without stack';
    const error = new Error(errorMessage);
    delete error.stack;
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(logger.error).toHaveBeenCalledWith(`Error: ${errorMessage}`, { stack: undefined });
    expect(statusSpy).toHaveBeenCalledWith(500);
  });

  it('should not call next() after handling the error', () => {
    const error = new Error('Test error');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockNext).not.toHaveBeenCalled();
  });
});