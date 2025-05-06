import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../../utils/logger';

jest.mock('sequelize', () => {
  const mockSequelizeInstance = {
    authenticate: jest.fn().mockResolvedValue(undefined),
    sync: jest.fn().mockResolvedValue(undefined)
  };
  
  return {
    Sequelize: jest.fn(() => mockSequelizeInstance)
  };
});

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('Database Configuration', () => {
  const originalEnv = process.env;
  const originalExit = process.exit;
  
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
    
    process.exit = jest.fn() as any;
  });
  
  afterAll(() => {
    process.env = originalEnv;
    process.exit = originalExit;
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
    
    expect(Sequelize).toHaveBeenCalledWith({
      database: 'test_db',
      username: 'test_user',
      password: 'test_password',
      host: 'localhost',
      dialect: 'postgres',
      port: 5432
    });
  });
  
  it('should use default port if DB_PORT is not provided', () => {
    delete process.env.DB_PORT;
    
    jest.isolateModules(() => {
      require('../../database/dbConfig');
    });
    
    expect(Sequelize).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 5432
      })
    );
  });
  
  it('should try to authenticate and sync the database', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    jest.isolateModules(() => {
      require('../../database/dbConfig');
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const sequelizeInstance = ((Sequelize as unknown) as jest.Mock).mock.results[0].value;
    
    expect(sequelizeInstance.authenticate).toHaveBeenCalled();
    expect(sequelizeInstance.sync).toHaveBeenCalledWith({ force: false });
    expect(logger.info).toHaveBeenCalledWith('Connection to the database has been established successfully.');
    expect(logger.info).toHaveBeenCalledWith('Database synchronized successfully.');
  });
  
  it('should log error and exit if database connection fails', async () => {
    const mockError = new Error('Connection failed');
    const mockSequelizeInstance = {
      authenticate: jest.fn().mockRejectedValue(mockError),
      sync: jest.fn()
    };
    (Sequelize as unknown as jest.Mock).mockImplementationOnce(() => mockSequelizeInstance);
    
    jest.isolateModules(() => {
      require('../../database/dbConfig');
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(logger.error).toHaveBeenCalledWith(
      'Unable to connect to the database:',
      mockError
    );
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(mockSequelizeInstance.sync).not.toHaveBeenCalled();
  });
});