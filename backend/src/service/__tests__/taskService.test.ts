import { TaskModel } from '../../models/task';
import { Task } from '../../interfaces/task';
import TaskService from '../../service/taskService';
import tasks from '../../database/tasks';
import { DatabaseError, NotFoundError } from '../../exception/errorHandler';
import logger from '../../utils/logger';

// Mock the dependencies
jest.mock('../../database/tasks', () => ({
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
}));
  
jest.mock('../../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn()
}));

jest.mock('../../models/task', () => {
    return {
      TaskModel: jest.fn().mockImplementation((data) => {
        return {
          id: data?.id,
          title: data?.title || '',
          description: data?.description || '',
          status: data?.status || 'TO_DO',
        };
      })
    };
});

describe('TaskService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('getAllTasks', () => {
        it('should return all tasks', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1', description: 'Description 1', status: 'TO_DO' },
                { id: 2, title: 'Task 2', description: 'Description 2', status: 'IN_PROGRESS' }
            ];
            (tasks.findAll as jest.Mock).mockResolvedValue(mockTasks);

            const result = await TaskService.getAllTasks();

            expect(tasks.findAll).toHaveBeenCalledTimes(1);
            expect(logger.info).toHaveBeenCalledWith('Fetching all tasks from database');
            expect(result).toEqual(mockTasks);
        });

        it('should throw DatabaseError if there is an error retrieving tasks', async () => {
            const mockError = new Error('Database connection failed');

            (tasks.findAll as jest.Mock).mockRejectedValue(mockError);

            await expect(TaskService.getAllTasks()).rejects.toThrow(DatabaseError);
            expect(logger.error).toHaveBeenCalledWith('Failed to retrieve tasks. Please try again later. Error: ', mockError);
        });
    });

    describe('getTaskById', () => {
        it('should return a task by task ID', async () => {
            const mockTask = { id: 1, title: 'Task 1', description: 'Description 1', status: 'TO_DO' };
            const taskId = 1;

            (tasks.findByPk as jest.Mock).mockResolvedValue(mockTask);

            const result = await TaskService.getTaskById(taskId);

            expect(tasks.findByPk).toHaveBeenCalledWith(taskId);
            expect(logger.info).toHaveBeenCalledWith(`Fetching task for Id: ${taskId}`);
            expect(result).toEqual(mockTask);
        })

        it('should throw error when task ID not found', async () => {
            const taskId = 1;

            (tasks.findByPk as jest.Mock).mockResolvedValue(null);

            await expect(TaskService.getTaskById(taskId)).rejects.toThrow(NotFoundError);

            expect(logger.error).toHaveBeenCalledWith(`Task with ID: ${taskId} not found`);
            expect(tasks.findByPk).toHaveBeenCalledWith(taskId);
            expect(logger.info).toHaveBeenCalledWith(`Fetching task for Id: ${taskId}`);
        });

        it('should throw DatabaseError if there is an error retrieving the task', async () => {
            const taskId = 1;
            const mockError = new Error('Database connection failed');

            (tasks.findByPk as jest.Mock).mockRejectedValue(mockError);

            await expect(TaskService.getTaskById(taskId)).rejects.toThrow(DatabaseError);

            expect(logger.error).toHaveBeenCalledWith('Failed to retrieve tasks. Please try again later. Error: ', mockError);
        });
    });  
    
    describe('createTask', () => {
        it('should create and return a new task', async () => {
            const taskData: Task = {
              title: 'New Task',
              description: 'New Description',
              status: 'TO_DO'
            };
            
            const createdTaskData = {
              id: 1,
              ...taskData
            };
            
            (tasks.create as jest.Mock).mockResolvedValue({
              get: jest.fn().mockReturnValue(createdTaskData)
            });
            
            const result = await TaskService.createTask(taskData);
            
            expect(tasks.create).toHaveBeenCalledWith({
              title: taskData.title,
              description: taskData.description,
              status: taskData.status
            });
            
            expect(logger.info).toHaveBeenCalledWith('Creating a new task in the database');
            expect(logger.info).toHaveBeenCalledWith(`Task created successfully with ID: ${createdTaskData.id}`);
            
            expect(result).toEqual(expect.objectContaining({
              id: createdTaskData.id,
              title: taskData.title,
              description: taskData.description,
              status: taskData.status
            }));
          });

        it('should throw DatabaseError if there is an error creating the task', async () => {
            const mockError = new Error('Database connection failed');
            const mockTaskData = { title: 'New Task', description: 'New Description', status: 'TO_DO' };

            (tasks.create as jest.Mock).mockRejectedValue(mockError);

            await expect(TaskService.createTask(mockTaskData)).rejects.toThrow(DatabaseError);

            expect(logger.error).toHaveBeenCalledWith('Failed to create task. Please try again later. Error: ', mockError);
        });
    });

    describe('updateTask', () => {
        it('should update and return the task when found', async () => {
          const taskId = 1;
          const taskData: Task = {
            title: 'Updated Task',
            description: 'Updated Description',
            status: 'IN_PROGRESS'
          };
          
          (tasks.findByPk as jest.Mock).mockResolvedValue({ id: taskId });
          (tasks.update as jest.Mock).mockResolvedValue([1]);
          
          const result = await TaskService.updateTask(taskId, taskData);
          
          expect(tasks.findByPk).toHaveBeenCalledWith(taskId);
          expect(tasks.update).toHaveBeenCalledWith(
            {
              title: taskData.title,
              description: taskData.description,
              status: taskData.status
            },
            {
              where: { id: taskId }
            }
          );
          
          expect(logger.info).toHaveBeenCalledWith(`Updating task with ID: ${taskId}`);
          expect(logger.info).toHaveBeenCalledWith(`Task with ID: ${taskId} updated successfully`);
          
          expect(result).toEqual(expect.objectContaining({
            id: taskId,
            title: taskData.title,
            description: taskData.description,
            status: taskData.status
          }));
        });
    
        it('should throw NotFoundError when task to update is not found', async () => {
          const taskId = 999;
          const taskData: Task = {
            title: 'Updated Task',
            description: 'Updated Description',
            status: 'IN_PROGRESS'
          };
          
          (tasks.findByPk as jest.Mock).mockResolvedValue(null);
          
          await expect(TaskService.updateTask(taskId, taskData)).rejects.toThrow(NotFoundError);
          expect(logger.error).toHaveBeenCalledWith(`Task with ID: ${taskId} not found`);
          expect(tasks.update).not.toHaveBeenCalled();
        });
    
        it('should throw DatabaseError when update fails', async () => {
          const taskId = 1;
          const taskData: Task = {
            title: 'Updated Task',
            description: 'Updated Description',
            status: 'IN_PROGRESS'
          };
          
          (tasks.findByPk as jest.Mock).mockResolvedValue({ id: taskId });
          
          const mockError = new Error('Database connection failed');
          (tasks.update as jest.Mock).mockRejectedValue(mockError);
          
          await expect(TaskService.updateTask(taskId, taskData)).rejects.toThrow(DatabaseError);
          expect(logger.error).toHaveBeenCalledWith(
            'Failed to update task. Please try again later. Error: ', 
            mockError
          );
        });
      });
    
      describe('deleteTask', () => {
        it('should delete the task when found', async () => {
          const taskId = 1;
          
          const mockTask = {
            id: taskId,
            destroy: jest.fn().mockResolvedValue(undefined)
          };
          
          (tasks.findByPk as jest.Mock).mockResolvedValue(mockTask);
          
          await TaskService.deleteTask(taskId);
          
          expect(tasks.findByPk).toHaveBeenCalledWith(taskId);
          expect(mockTask.destroy).toHaveBeenCalled();
          expect(logger.info).toHaveBeenCalledWith(`Deleting task with ID: ${taskId}`);
        });
    
        it('should throw NotFoundError when task to delete is not found', async () => {
          const taskId = 999;
          
          (tasks.findByPk as jest.Mock).mockResolvedValue(null);
          
          await expect(TaskService.deleteTask(taskId)).rejects.toThrow(NotFoundError);
          expect(logger.error).toHaveBeenCalledWith(`Task with ID: ${taskId} not found`);
        });
    
        it('should throw DatabaseError when delete fails', async () => {
          const taskId = 1;
          
          const mockTask = {
            id: taskId,
            destroy: jest.fn().mockRejectedValue(new Error('Database connection failed'))
          };
          
          (tasks.findByPk as jest.Mock).mockResolvedValue(mockTask);
          
          await expect(TaskService.deleteTask(taskId)).rejects.toThrow(DatabaseError);
          expect(logger.error).toHaveBeenCalledWith(
            'Failed to delete task. Please try again later. Error: ', 
            expect.any(Error)
          );
        });
      });
    });