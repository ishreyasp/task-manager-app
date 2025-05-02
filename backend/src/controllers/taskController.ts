import { Request, Response } from 'express';
import TaskService from '../service/taskService';
import { Task } from '../interfaces/task';
import { ValidationError } from '../exception/errorHandler';
import logger from '../utils/logger';
import TASK_STATUSES from '../constants/stringConstants';

/**
 * Controller for handling task related HTTP requests
 */
export default class TaskController {

    /**
     * Get all tasks
     * 
     * @param req - Request object
     * @param res - Response object
     * @return List of all tasks in JSON format
     */
    public static async getAllTasks(req: Request, res: Response): Promise<void> {
        logger.info('Fetching all tasks...');
        const allTasks = await TaskService.getAllTasks();
        logger.info(`All tasks fetched successfully. Found ${allTasks.length} tasks.`);
        res.status(200).json(allTasks);
    }

    /**
     * Get task by given task Id
     * 
     * @param req - Request object
     * @param res - Response object
     * @return List of all tasks in JSON format
     */
    public static async getTaskById(req: Request, res: Response): Promise<void> {
        logger.info('Fetching a task...');
        const taskId = parseInt(req.params.id, 10);

        if (isNaN(taskId)) {
            logger.error('Invalid task ID');
            throw new ValidationError('Invalid task ID');
        }

        if (taskId===null) {
            logger.error('Task ID is required');
            throw new ValidationError('Task ID is required');
        }

        const existingTask = await TaskService.getTaskById(taskId);
        res.status(200).json(existingTask);
    }

     /**
     * Create a new task
     * 
     * @param req - Request object with task data in body
     * @param res - Response object
     * @return Created task in JSON format
     * @throws ValidationError if title or description is missing
     * @throws ValidationError if status is invalid
     */
    public static async createTask(req: Request, res: Response): Promise<void> {
        logger.info('Creating a new task...');
        
        if (!req.body || Object.keys(req.body).length === 0) {
            logger.error('Task data is required');
            throw new ValidationError('Task data is required');
        }
        const taskData: Task = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        };

        if (!taskData.title || !taskData.description) {
            logger.error('Title and description are required');
            throw new ValidationError('Title and description are required');
        }

        if (taskData.status && ![TASK_STATUSES.TO_DO].includes(taskData.status)) {
            logger.error('Invalid status value');
            throw new ValidationError('Invalid status value');
        }

        const newTask = await TaskService.createTask(taskData);
        res.status(201).json(newTask);
    }

    /**
     * Update an existing task for given task Id
     * 
     * @param req - Request object with task ID in params and updated data in body
     * @param res - Response object
     * @return Updated task in JSON format
     * @throws ValidationError if task ID is invalid or missing
     * @throws ValidationError if title or description is missing
     * @throws ValidationError if status is invalid
     */
    public static async updateTask(req: Request, res: Response): Promise<void> {
        logger.info('Updating task...');
        const taskId = parseInt(req.params.id, 10);

        const taskData: Task = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        };

        if (isNaN(taskId)) {
            logger.error('Invalid task ID');
            throw new ValidationError('Invalid task ID');
        }

        if (taskId===null) {
            logger.error('Task ID is required');
            throw new ValidationError('Task ID is required');
        }

        if (!taskData.title || !taskData.description) {
            logger.error('Title and description are required');
            throw new ValidationError('Title and description are required');
        }

        if (taskData.status && ![TASK_STATUSES.TO_DO, TASK_STATUSES.DONE, TASK_STATUSES.IN_PROGRESS].includes(taskData.status)) {
            logger.error('Invalid status value');
            throw new ValidationError('Invalid status value');
        }

        const updatedTask = await TaskService.updateTask(taskId, taskData);
        res.status(200).json(updatedTask);
    }

    /**
     * Delete a task by given task Id
     * 
     * @param req - Request object with task ID in params
     * @param res - Response object
     * @return No content response
     * @throws ValidationError if task ID is invalid or missing
     * @throws ValidationError if task ID is null
     */
    public static async deleteTask(req: Request, res: Response): Promise<void> {
        logger.info('Deleting task...');
        const taskId = parseInt(req.params.id, 10);

        if (isNaN(taskId)) {
            logger.error('Invalid task ID');
            throw new ValidationError('Invalid task ID');
        }

        if (taskId===null) {
            logger.error('Task ID is required');
            throw new ValidationError('Task ID is required');
        }

        await TaskService.deleteTask(taskId);
        res.status(204).send();
}
}