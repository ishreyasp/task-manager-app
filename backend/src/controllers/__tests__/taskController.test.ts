import { Request, Response } from 'express';
import { ValidationError } from '../../exception/errorHandler';
import logger from '../../utils/logger';
import TASK_STATUSES from '../../constants/stringConstants';
import TaskController from '../taskController';

//Mock dependencies
jest.mock('../../service/taskService', () => ({
    getAllTasks: jest.fn(),
    getTaskById: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
}));

jest.mock('../../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
}));

import TaskService from '../../service/taskService';

// Main test suite for TaskController
describe('TaskController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;
    let responseSend: jest.Mock;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Set up mock response
        responseJson = jest.fn().mockReturnThis();
        responseStatus = jest.fn().mockReturnThis();
        responseSend = jest.fn().mockReturnThis();

        mockResponse = {
            status: responseStatus,
            json: responseJson,
            send: responseSend,
        };

        mockRequest = {};
    });

    // Add cleanup after all tests
    afterAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    // Test for getAllTasks method
    describe('getAllTasks', () => {
        it('should fetch all tasks successfully', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1', description: 'Description 1', status: TASK_STATUSES.TO_DO },
                { id: 2, title: 'Task 2', description: 'Description 2', status: TASK_STATUSES.IN_PROGRESS },
            ];
            (TaskService.getAllTasks as jest.Mock).mockResolvedValue(mockTasks);

            await TaskController.getAllTasks(mockRequest as Request, mockResponse as Response);

            expect(TaskService.getAllTasks).toHaveBeenCalledTimes(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockTasks);
            expect(logger.info).toHaveBeenCalledWith('Fetching all tasks...');
            expect(logger.info).toHaveBeenCalledWith(`All tasks fetched successfully. Found ${mockTasks.length} tasks.`);
        });

        it('should handle error when fetching tasks fails', async () => {
            const mockError = new Error('Database error');
            (TaskService.getAllTasks as jest.Mock).mockRejectedValue(mockError);

            try {
                await TaskController.getAllTasks(mockRequest as Request, mockResponse as Response);
                fail('Expected error was not thrown');
            } catch (error) {
                expect(error).toBe(mockError);
            }

            expect(TaskService.getAllTasks).toHaveBeenCalledTimes(1);
            expect(responseStatus).not.toHaveBeenCalledWith(200);
            expect(responseJson).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Fetching all tasks...');
        });
    });

    describe('getTaskById', () => {
        it('should fetch a task by ID successfully', async () => {
            const mockTask = { id: 1, title: 'Task 1', description: 'Description 1', status: TASK_STATUSES.TO_DO };
            const taskId = 1;

            mockRequest.params = { id: taskId.toString() };
            (TaskService.getTaskById as jest.Mock).mockResolvedValue(mockTask);

            await TaskController.getTaskById(mockRequest as Request, mockResponse as Response);

            expect(TaskService.getTaskById).toHaveBeenCalledWith(taskId);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockTask);
            expect(logger.info).toHaveBeenCalledWith('Fetching a task...');
        });

        it('should handle error when task ID is invalid', async () => {
            mockRequest.params = { id: 'invalid' };

            await expect(TaskController.getTaskById(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(ValidationError);

            expect(TaskService.getTaskById).not.toHaveBeenCalled();
            expect(responseStatus).not.toHaveBeenCalledWith(200);
            expect(responseJson).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Fetching a task...');
            expect(logger.error).toHaveBeenCalledWith('Invalid task ID');
        });

        it('should throw ValidationError for null task ID', async () => {
            mockRequest.params = { id: null as any };
            
            await expect(TaskController.getTaskById(mockRequest as Request, mockResponse as Response))
              .rejects.toThrow(ValidationError);
            
            expect(TaskService.getTaskById).not.toHaveBeenCalled();
            expect(responseStatus).not.toHaveBeenCalledWith(200);
            expect(responseJson).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Fetching a task...');
            expect(logger.error).toHaveBeenCalledWith('Task ID is required');
        });
    });

    describe('createTask', () => {
        it('should create a new task successfully', async () => {
            const mockTask = { id: 1, title: 'Task 1', description: 'Description 1', status: TASK_STATUSES.TO_DO };
            const taskData = { title: 'Task 1', description: 'Description 1', status: TASK_STATUSES.TO_DO };

            mockRequest.body = taskData;
            (TaskService.createTask as jest.Mock).mockResolvedValue(mockTask);

            await TaskController.createTask(mockRequest as Request, mockResponse as Response);

            expect(TaskService.createTask).toHaveBeenCalledWith(taskData);
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(mockTask);
            expect(logger.info).toHaveBeenCalledWith('Creating a new task...');
        })

        it('should handle error when task data is missing', async () => {
            mockRequest.body = null;

            await expect(TaskController.createTask(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(ValidationError);

            expect(TaskService.createTask).not.toHaveBeenCalled();
            expect(responseJson).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Creating a new task...');
            expect(logger.error).toHaveBeenCalledWith('Task data is required');
        });

        it('should handle error when task title is missing', async () => {
            const taskData = { description: 'Description 1', status: TASK_STATUSES.TO_DO };

            mockRequest.body = taskData;

            await expect(TaskController.createTask(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(ValidationError);

            expect(TaskService.createTask).not.toHaveBeenCalled();
            expect(responseJson).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Creating a new task...');
            expect(logger.error).toHaveBeenCalledWith('Task title is required');
        });

        it('should handle error when task status is invalid', async () => {
            const taskData = { title: 'Task 1', description: 'Description 1', status: TASK_STATUSES.DONE };

            mockRequest.body = taskData;

            await expect(TaskController.createTask(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(ValidationError);

            expect(TaskService.createTask).not.toHaveBeenCalled();
            expect(responseJson).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Creating a new task...');
            expect(logger.error).toHaveBeenCalledWith('Invalid status value. Status while creating task can be either TO_DO or IN_PROGRESS');
        });
    });    
    
    describe('updateTask', () => {
        it('should update existing task successfully', async () => {
            const mockTask = { id: 1, title: 'Updated Task', description: 'Updated Description', status: TASK_STATUSES.IN_PROGRESS };
            const taskData = { title: 'Updated Task', description: 'Updated Description', status: TASK_STATUSES.IN_PROGRESS };
            const taskId = 1;

            mockRequest.params = { id: taskId.toString() };     
            mockRequest.body = taskData;
            (TaskService.updateTask as jest.Mock).mockResolvedValue(mockTask);

            await TaskController.updateTask(mockRequest as Request, mockResponse as Response);

            expect(TaskService.updateTask).toHaveBeenCalledWith(taskId, taskData);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockTask);
            expect(logger.info).toHaveBeenCalledWith('Updating task...');   
        }); 

        it('should handle error when task status is invalid', async () => {
            const taskData = { title: 'Task 1', description: 'Description 1', status: 'Completed' };
            const taskId = 1;
            mockRequest.body = taskData;

            mockRequest.params = { id: taskId.toString() };
            await expect(TaskController.updateTask(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(ValidationError);

            expect(TaskService.updateTask).not.toHaveBeenCalled();
            expect(responseJson).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Updating task...');
            expect(logger.error).toHaveBeenCalledWith('Invalid status value. Status while updating task can be either TO_DO, IN_PROGRESS or DONE');
        });

        it('should handle error when task title is missing', async () => {
            const taskData = { description: 'Description 1', status: TASK_STATUSES.TO_DO };
            const taskId = 1;
            mockRequest.body = taskData;

            mockRequest.params = { id: taskId.toString() };
            await expect(TaskController.updateTask(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(ValidationError);

            expect(TaskService.updateTask).not.toHaveBeenCalled();
            expect(responseJson).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Updating task...');
            expect(logger.error).toHaveBeenCalledWith('Task title is required');
        });

        it('should handle error when task ID is missing', async () => {
            mockRequest.params = { id: null as any };
            
            await expect(TaskController.updateTask(mockRequest as Request, mockResponse as Response))
              .rejects.toThrow(ValidationError);
            
            expect(TaskService.updateTask).not.toHaveBeenCalled();
            expect(responseJson).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Updating task...');
            expect(logger.error).toHaveBeenCalledWith('Task ID is required');
        });

        it('should handle error when task ID is invalid', async () => {
            const taskData = { title: 'Task 1', description: 'Description 1', status: 'Completed' };
            mockRequest.params = { id: 'invalid' };

            mockRequest.body = taskData;
            await expect(TaskController.updateTask(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(ValidationError);

            expect(TaskService.updateTask).not.toHaveBeenCalled();
            expect(responseJson).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Updating task...');
            expect(logger.error).toHaveBeenCalledWith('Invalid task ID. Task Id can only be an integer');
        });
    });   
    
    describe('deleteTask', () => {
        it('should delete a task successfully', async () => {
            const taskId = 1;
            mockRequest.params = { id: taskId.toString() };

            await TaskController.deleteTask(mockRequest as Request, mockResponse as Response);

            expect(TaskService.deleteTask).toHaveBeenCalledWith(taskId);
            expect(responseStatus).toHaveBeenCalledWith(204);
            expect(responseSend).toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Deleting task...');
        });

        it('should handle error when task ID is invalid', async () => {
            mockRequest.params = { id: 'invalid' };

            await expect(TaskController.deleteTask(mockRequest as Request, mockResponse as Response))
                .rejects.toThrow(ValidationError);

            expect(TaskService.deleteTask).not.toHaveBeenCalled();
            expect(responseStatus).not.toHaveBeenCalledWith(204);
            expect(responseSend).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Deleting task...');
            expect(logger.error).toHaveBeenCalledWith('Invalid task ID. Task Id can only be an integer');
        });

        it('should handle error when task ID is null', async () => {
            mockRequest.params = { id: null as any };
            
            await expect(TaskController.deleteTask(mockRequest as Request, mockResponse as Response))
              .rejects.toThrow(ValidationError);
            
            expect(TaskService.deleteTask).not.toHaveBeenCalled();
            expect(responseStatus).not.toHaveBeenCalledWith(204);
            expect(responseSend).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Deleting task...');
            expect(logger.error).toHaveBeenCalledWith('Task ID is required');
        });
    });
});
