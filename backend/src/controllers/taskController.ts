import { Request, Response } from 'express';
import TaskService from '../service/taskService';
import { Task } from '../interfaces/task';
import { ValidationError } from '../exception/errorHandler';

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
        const allTasks = await TaskService.getAllTasks();
        res.status(200).json(allTasks);
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
        const taskData: Task = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        };

        if (!taskData.title || !taskData.description) {
            throw new ValidationError('Title and description are required');
        }

        if (taskData.status && !['Pending'].includes(taskData.status)) {
            throw new ValidationError('Invalid status value');
        }

        const newTask = await TaskService.createTask(taskData);
        res.status(201).json(newTask);
    }

    /**
     * Update an existing task
     * @param req - Request object with task ID in params and updated data in body
     * @param res - Response object
     * @return Updated task in JSON format
     * @throws ValidationError if task ID is invalid or missing
     * @throws ValidationError if title or description is missing
     * @throws ValidationError if status is invalid
     */
    public static async updateTask(req: Request, res: Response): Promise<void> {
        const taskId = parseInt(req.params.id, 10);

        const taskData: Task = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        };

        if (isNaN(taskId)) {
            throw new ValidationError('Invalid task ID');
        }

        if (taskId===null) {
            throw new ValidationError('Task ID is required');
        }

        if (!taskData.title || !taskData.description) {
            throw new ValidationError('Title and description are required');
        }

        if (taskData.status && !['Pending', 'Completed', 'Ongoing'].includes(taskData.status)) {
            throw new ValidationError('Invalid status value');
        }

        const updatedTask = await TaskService.updateTask(taskId, taskData);
        res.status(200).json(updatedTask);
    }

    /**
     * Delete a task by ID
     * @param req - Request object with task ID in params
     * @param res - Response object
     * @return No content response
     * @throws ValidationError if task ID is invalid or missing
     * @throws ValidationError if task ID is null
     */
    public static async deleteTask(req: Request, res: Response): Promise<void> {
            const taskId = parseInt(req.params.id, 10);

            if (isNaN(taskId)) {
                throw new ValidationError('Invalid task ID');
            }

            if (taskId===null) {
                throw new ValidationError('Task ID is required');
            }

            await TaskService.deleteTask(taskId);
            res.status(204).send();
    }
}