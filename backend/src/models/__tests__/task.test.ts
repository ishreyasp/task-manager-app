import { TaskModel } from '../../models/task';
import { Task } from '../../interfaces/task';
import TASK_STATUSES from '../../constants/stringConstants';

// Mock the constants
jest.mock('../../constants/stringConstants', () => ({
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
}));

describe('TaskModel', () => {
  const mockDate = new Date('2023-01-01T00:00:00.000Z');
  const originalDateConstructor = global.Date;
  
  beforeEach(() => {
    global.Date = jest.fn(() => mockDate) as any;
    (global.Date as any).now = originalDateConstructor.now;
  });
  
  afterEach(() => {
    global.Date = originalDateConstructor;
  });

  describe('constructor', () => {
    it('should initialize task properties from taskData', () => {
      const taskData: Task = {
        title: 'Test Task',
        description: 'Test Description',
        status: TASK_STATUSES.TO_DO
      };
      
      const task = new TaskModel(taskData);
      
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.status).toBe(taskData.status);
      expect(task.createdAt).toEqual(mockDate);
    });
    
    it('should set createdAt to current date', () => {

      const taskData: Task = {
        title: 'Test Task',
        description: 'Test Description',
        status: TASK_STATUSES.TO_DO
      };
      
      const task = new TaskModel(taskData);
      
      expect(task.createdAt).toEqual(mockDate);
    });
    
    it('should handle missing description', () => {
      const taskData: Task = {
        title: 'Test Task',
        status: TASK_STATUSES.TO_DO
      } as Task;
      

      const task = new TaskModel(taskData);
      
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBeUndefined();
      expect(task.status).toBe(taskData.status);
    });
    
    it('should handle empty description', () => {
      const taskData: Task = {
        title: 'Test Task',
        description: '',
        status: TASK_STATUSES.TO_DO
      };
      
      const task = new TaskModel(taskData);
      
      expect(task.description).toBe('');
    });
    
    it('should not set id if not provided', () => {
      const taskData: Task = {
        title: 'Test Task',
        description: 'Test Description',
        status: TASK_STATUSES.TO_DO
      };
      
      const task = new TaskModel(taskData);
      
      expect(task.id).toBeUndefined();
    });
    
    it('should handle provided id', () => {
      const taskData: Task = {
        id: 123,
        title: 'Test Task',
        description: 'Test Description',
        status: TASK_STATUSES.TO_DO
      };
      
      const task = new TaskModel(taskData);
      
      expect(task.id).toBeUndefined(); 
    });
  });

  describe('Status check methods', () => {
    it('should return true when isDone is called and status is DONE', () => {
      const task = new TaskModel({
        title: 'Test Task',
        description: 'Test Description',
        status: TASK_STATUSES.DONE
      });
      
      expect(task.isDone()).toBe(true);
      expect(task.isToDo()).toBe(false);
      expect(task.isInProgress()).toBe(false);
    });
    
    it('should return true when isToDo is called and status is TO_DO', () => {
      const task = new TaskModel({
        title: 'Test Task',
        description: 'Test Description',
        status: TASK_STATUSES.TO_DO
      });
      
      expect(task.isDone()).toBe(false);
      expect(task.isToDo()).toBe(true);
      expect(task.isInProgress()).toBe(false);
    });
    
    it('should return true when isInProgress is called and status is IN_PROGRESS', () => {
      const task = new TaskModel({
        title: 'Test Task',
        description: 'Test Description',
        status: TASK_STATUSES.IN_PROGRESS
      });
      
      expect(task.isDone()).toBe(false);
      expect(task.isToDo()).toBe(false);
      expect(task.isInProgress()).toBe(true);
    });
    
    it('should return false for all status methods when status is invalid', () => {
      const task = new TaskModel({
        title: 'Test Task',
        description: 'Test Description',
        status: 'INVALID_STATUS'
      });
      
      expect(task.isDone()).toBe(false);
      expect(task.isToDo()).toBe(false);
      expect(task.isInProgress()).toBe(false);
    });
  });

  describe('Task Interface Implementation', () => {
    it('should implement the Task interface correctly', () => {
      const taskData: Task = {
        title: 'Test Task',
        description: 'Test Description',
        status: TASK_STATUSES.TO_DO
      };
      
      const task: Task = new TaskModel(taskData);
      
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('status');
      
      expect((task as TaskModel).isDone).toBeDefined();
      expect((task as TaskModel).isToDo).toBeDefined();
      expect((task as TaskModel).isInProgress).toBeDefined();
    });
  });
});