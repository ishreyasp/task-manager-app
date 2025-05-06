// Mock the dependencies before importing the module to be tested
jest.mock('./app', () => ({
    listen: jest.fn((port, callback) => {
      callback();
      return {
        close: jest.fn()
      };
    })
  }));
  
  jest.mock('dotenv', () => ({
    config: jest.fn()
  }));
  
  jest.mock('./utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn()
  }));
  
  // Mock process.exit
  const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
    return undefined as never;
  });
  
  // Import dependencies after mocking
  import app from './app';
  import dotenv from 'dotenv';
  import logger from './utils/logger';
  
  describe('Server Initialization', () => {
    const originalEnv = process.env;
    
    beforeEach(() => {
      jest.clearAllMocks();
      
      process.env = { ...originalEnv };
    });
  
    afterAll(() => {
      process.env = originalEnv;
      jest.restoreAllMocks();
    });
  
    it('should load environment variables', () => {
      jest.isolateModules(() => {
        require('./server');
      });
      
      expect(dotenv.config).toHaveBeenCalled();
    });
  
    it('should start the server on the specified port', () => {
      jest.isolateModules(() => {
        require('./server');
      });
      
      expect(app.listen).toHaveBeenCalledWith(4000, expect.any(Function));
    });
  
    it('should log a message when the server starts successfully', () => {
      jest.isolateModules(() => {
        require('./server');
      });
      
      expect(logger.info).toHaveBeenCalledWith('Server is running on port 4000');
    });
  
    it('should handle errors during server startup', () => {
      (app.listen as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Failed to start server');
      });
      
      jest.isolateModules(() => {
        require('./server');
      });
      
      expect(logger.error).toHaveBeenCalledWith(
        'Error starting server:', 
        expect.objectContaining({ message: 'Failed to start server' })
      );
      
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });