import { Router } from 'express';
import TaskController from '../../controllers/taskController';
import taskRoutes from '../../routes/taskRoutes';

// Mock dependencies
jest.mock('express', () => {
  const mockRouter = {
    get: jest.fn().mockReturnThis(),
    post: jest.fn().mockReturnThis(),
    put: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis()
  };
  return {
    Router: jest.fn().mockReturnValue(mockRouter)
  };
});

jest.mock('../../controllers/taskController', () => ({
  getAllTasks: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn()
}));

describe('Task Routes', () => {
  let mockRouter: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRouter = (Router as jest.Mock)();
  });

  it('should define GET route for fetching all tasks', () => {
    jest.isolateModules(() => {
      require('../../routes/taskRoutes');
    });
    
    expect(mockRouter.get).toHaveBeenCalledWith('/', TaskController.getAllTasks);
  });

  it('should define GET route for fetching a task by ID', () => {
    jest.isolateModules(() => {
      require('../../routes/taskRoutes');
    });
    
    expect(mockRouter.get).toHaveBeenCalledWith('/:id', TaskController.getTaskById);
  });

  it('should define POST route for creating a new task', () => {
    jest.isolateModules(() => {
      require('../../routes/taskRoutes');
    });
    
    expect(mockRouter.post).toHaveBeenCalledWith('/', TaskController.createTask);
  });

  it('should define PUT route for updating a task', () => {
    jest.isolateModules(() => {
      require('../../routes/taskRoutes');
    });
    
    expect(mockRouter.put).toHaveBeenCalledWith('/:id', TaskController.updateTask);
  });

  it('should define DELETE route for deleting a task', () => {
    jest.isolateModules(() => {
      require('../../routes/taskRoutes');
    });
    
    expect(mockRouter.delete).toHaveBeenCalledWith('/:id', TaskController.deleteTask);
  });

  it('should export the router', () => {
    expect(taskRoutes).toBeDefined();
  });
});