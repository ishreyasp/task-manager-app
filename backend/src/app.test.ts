import express from 'express';

// Mock dependencies
jest.mock('express', () => {
  const mockUse = jest.fn();
  const mockGet = jest.fn(); 
  const mockJson = jest.fn().mockReturnValue('json-middleware');
  
  // Create a mock express instance
  const mockExpress = () => ({
    use: mockUse,
    get: mockGet,
  });
  
  // Add static methods to the function
  mockExpress.json = mockJson;
  mockExpress.Router = jest.requireActual('express').Router;
  
  return mockExpress;
});

jest.mock('cors', () => jest.fn().mockReturnValue('cors-middleware'));
jest.mock('./routes/taskRoutes', () => 'task-routes-mock');
jest.mock('./exception/errorHandler', () => ({
  errorHandler: 'error-handler-mock'
}));

const mockExpress = jest.mocked(express);
import cors from 'cors';
const mockCors = jest.mocked(cors);

describe('Express App Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    jest.isolateModules(() => {
      require('./app');
    });
  });

  it('should use CORS middleware', () => {
    expect(mockCors).toHaveBeenCalled();

    const mockApp = mockExpress();
    expect(mockApp.use).toHaveBeenCalledWith('cors-middleware');
  });

  it('should use JSON middleware', () => {
    expect(mockExpress.json).toHaveBeenCalled();
    
    const mockApp = mockExpress();
    expect(mockApp.use).toHaveBeenCalledWith('json-middleware');
  });

  it('should register task routes', () => {
    const mockApp = mockExpress();
    expect(mockApp.use).toHaveBeenCalledWith('/tasks', 'task-routes-mock');
  });

  it('should register error handling middleware', () => {
    const mockApp = mockExpress();
    expect(mockApp.use).toHaveBeenCalledWith('error-handler-mock');
  });

  it('should register health check endpoint', () => {
    const mockApp = mockExpress();
    expect(mockApp.get).toHaveBeenCalledWith('/healthz', expect.any(Function));
  });
});