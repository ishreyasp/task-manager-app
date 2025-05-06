import sequelize from '../../database/dbConfig';
import TASK_STATUSES from '../../constants/stringConstants';
import tasks from '../../database/tasks';

// Mock the dependencies
jest.mock('../../database/dbConfig', () => ({
  define: jest.fn().mockReturnValue({
    sync: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  }),
}));

jest.mock('../../constants/stringConstants', () => ({
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
}));

describe('Tasks Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should define tasks model with correct table name', () => {
    jest.isolateModules(() => {
      require('../../database/tasks');
    });
    
    expect(sequelize.define).toHaveBeenCalledWith(
      'tasks',
      expect.any(Object),
      expect.any(Object)
    );
  });

  it('should define tasks model with correct fields', () => {
    jest.isolateModules(() => {
      require('../../database/tasks');
    });
    
    const callArgs = (sequelize.define as jest.Mock).mock.calls[0];
    const fieldsDefinition = callArgs[1];
    
    expect(fieldsDefinition.id.primaryKey).toBe(true);
    expect(fieldsDefinition.id.autoIncrement).toBe(true);
    expect(fieldsDefinition.id.type.key).toBe('INTEGER');
    
    expect(fieldsDefinition.title.allowNull).toBe(false);
    expect(fieldsDefinition.title.type.key).toBe('STRING');
    
    expect(fieldsDefinition.description.allowNull).toBe(true);
    expect(fieldsDefinition.description.type.key).toBe('STRING');
    
    expect(fieldsDefinition.status.allowNull).toBe(false);
    expect(fieldsDefinition.status.defaultValue).toBe(TASK_STATUSES.TO_DO);
    expect(fieldsDefinition.status.type.key).toBe('ENUM');
    expect(fieldsDefinition.status.type.values).toEqual([
      TASK_STATUSES.TO_DO, 
      TASK_STATUSES.IN_PROGRESS, 
      TASK_STATUSES.DONE
    ]);
  });

  it('should define tasks model with timestamps enabled but updatedAt disabled', () => {
    jest.isolateModules(() => {
      require('../../database/tasks');
    });
    
    const callArgs = (sequelize.define as jest.Mock).mock.calls[0];
    const options = callArgs[2];
    
    expect(options.timestamps).toBe(true);
    expect(options.updatedAt).toBe(false);
  });

  it('should export the defined model', () => {
    expect(tasks).toBeDefined();
  });

  it.skip('should create tasks table in database when synced', async () => {
    jest.unmock('../../database/dbConfig');
    
    const realTasks = tasks;
    
    await realTasks.sync({ force: true });
    
    const tableInfo = await sequelize.getQueryInterface().describeTable('tasks');
    
    expect(tableInfo.id).toBeDefined();
    expect(tableInfo.title).toBeDefined();
    expect(tableInfo.description).toBeDefined();
    expect(tableInfo.status).toBeDefined();
    expect(tableInfo.createdAt).toBeDefined();
    expect(tableInfo.updatedAt).toBeUndefined();
  });
});