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

// Mock the database initialization
const mockInitDatabase = jest.fn().mockResolvedValue(undefined);
jest.mock('./database/dbConfig', () => ({
  initDatabase: mockInitDatabase,
  __esModule: true,
  default: {}
}));

// Mock database index
jest.mock('./database', () => ({}));

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
    // Use a simpler approach - just require the module once
    require('./server');
    
    expect(dotenv.config).toHaveBeenCalled();
  });
});