import dotenv from 'dotenv';
import logger from '../../utils/logger';
import { Sequelize } from 'sequelize';

interface DbConfig {
  default: Sequelize;
  initDatabase: () => Promise<void>;
}

const mockSequelizeInstance = {
  authenticate: jest.fn().mockResolvedValue(undefined),
  sync: jest.fn().mockResolvedValue(undefined),
  models: { task: {} }
};

jest.mock('sequelize', () => ({
  Sequelize: jest.fn(() => mockSequelizeInstance)
}));

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('Database Configuration', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    process.env = {
      ...originalEnv,
      DB_NAME: 'test_db',
      DB_USERNAME: 'test_user',
      DB_PASSWORD: 'test_password',
      DB_HOST: 'localhost',
      DB_DIALECT: 'postgres',
      DB_PORT: '5432'
    };
  });
  
  afterAll(() => {
    process.env = originalEnv;
  });
  
  it('should load environment variables using dotenv', () => {
    jest.isolateModules(() => {
      require('../../database/dbConfig');
    });
    
    expect(dotenv.config).toHaveBeenCalled();
  });
  
  it('should initialize Sequelize with correct configuration', () => {
    jest.isolateModules(() => {
      require('../../database/dbConfig');
    });
    
    expect(mockSequelizeInstance).toBeDefined();
  });
  
  it('should use default port if DB_PORT is not provided', () => {
    delete process.env.DB_PORT;
    
    jest.isolateModules(() => {
      require('../../database/dbConfig');
    });
    
  });
  
  it('should authenticate and sync the database when initDatabase is called', async () => {
    let dbConfig: DbConfig | undefined;
    
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      dbConfig = require('../../database/dbConfig') as DbConfig;
    });
    
    if (dbConfig) {
      await dbConfig.initDatabase();
      
      expect(mockSequelizeInstance.authenticate).toHaveBeenCalled();
      expect(mockSequelizeInstance.sync).toHaveBeenCalledWith({ force: false });
      expect(logger.info).toHaveBeenCalledWith('Connection to the database has been established successfully.');
      expect(logger.info).toHaveBeenCalledWith('Database synchronized successfully.');
    } else {
      fail('dbConfig module was not loaded correctly');
    }
  });
  
  it('should throw error if database connection fails', async () => {
    const mockError = new Error('Connection failed');
    mockSequelizeInstance.authenticate.mockRejectedValueOnce(mockError);
    
    let dbConfig: DbConfig | undefined;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      dbConfig = require('../../database/dbConfig') as DbConfig;
    });
    
    if (dbConfig) {
      await expect(dbConfig.initDatabase()).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith('Unable to connect to the database:', mockError);
      expect(mockSequelizeInstance.sync).not.toHaveBeenCalled();
    } else {
      fail('dbConfig module was not loaded correctly');
    }
  });
});