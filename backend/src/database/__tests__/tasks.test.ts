import sequelize from '../../database/dbConfig';

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
});