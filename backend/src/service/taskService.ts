import { Request, Response } from 'express';
import { TaskModel } from '../models/task';
import { Task } from '../interfaces/task';
import tasks from '../database/tasks';
import { DatabaseError, NotFoundError } from '../exception/errorHandler';
import logger from '../utils/logger';

/**
 * Service for handling task related operations
 */
export default class TaskService {

    /**
     * Get all tasks
     * 
     * @return List of all tasks
     * @throws DatabaseError if there is an error retrieving tasks
     */
    public static async getAllTasks() {
        try {
            logger.info('Fetching all tasks from database');
            const allTasks = await tasks.findAll();
            return allTasks;
        } catch (error) {
            logger.error('Failed to retrieve tasks. Please try again later. Error: ', error);
            throw new DatabaseError("Failed to retrieve tasks. Please try again later.");
        }
    }

    /**
     * Create a new task
     * 
     * @param taskData - Data for the new task
     * @return Created task object
     * @throws DatabaseError if there is an error creating the task
     */
    public static async createTask(taskData: Task): Promise<TaskModel> {
        try {
            const taskModel = new TaskModel(taskData);
            
            logger.info('Creating a new task in the database');
            const createdTask = await tasks.create({
                title: taskModel.title,
                description: taskModel.description,
                status: taskModel.status
            });

            const taskObj = createdTask.get({ plain: true });
            
            if (taskObj.id) {
                taskModel.id = taskObj.id;
            }
            
            logger.info(`Task created successfully with ID: ${taskModel.id}`);
            return taskModel;
        } catch (error) {
            logger.error('Failed to create task. Please try again later. Error: ', error);
            throw new DatabaseError("Failed to create task. Please try again later.");
        }
    }

    /**
     * Update an existing task
     * 
     * @param id - ID of the task to update
     * @param taskData - Updated data for the task
     * @return Updated task object
     * @throws DatabaseError if there is an error updating the task
     * @throws NotFoundError if the task with the given ID does not exist
     */
    public static async updateTask(id: number, taskData: Task): Promise<TaskModel> {
        try {
            logger.info(`Updating task with ID: ${id}`);
            const taskModel = new TaskModel(taskData);
            taskModel.id = id; 

            const existingTaskId = await tasks.findByPk(taskModel.id);

            if (!existingTaskId) {
                logger.error(`Task with ID: ${taskModel.id} not found`);
                throw new NotFoundError(`Task with id ${taskModel.id} not found`);
            }

            const updatedTask = await tasks.update(
                {
                    title: taskModel.title,
                    description: taskModel.description,
                    status: taskModel.status
                },
                {
                    where: { id: taskModel.id }
                }
            );

            logger.info(`Task with ID: ${taskModel.id} updated successfully`);
            return taskModel;
        } catch (error) {
            if (error instanceof NotFoundError) {
                logger.error(`Task with ID: ${id} not found`);
                throw error;
            }

            logger.error('Failed to update task. Please try again later. Error: ', error);
            throw new DatabaseError('Failed to update task. Please try again later.');
        }
    }

    /**
     * Delete a task by ID
     * 
     * @param id - ID of the task to delete
     * @return void
     * @throws DatabaseError if there is an error deleting the task
     * @throws NotFoundError if the task with the given ID does not exist
     */
    public static async deleteTask(id: number): Promise<void> {
        try {
            logger.info(`Deleting task with ID: ${id}`);
            const task = await tasks.findByPk(id);

            if (!task) {
                logger.error(`Task with ID: ${id} not found`);
                throw new NotFoundError(`Task with id ${id} not found`);
            }

            await task.destroy();
        } catch (error) {
            if (error instanceof NotFoundError) {
                logger.error(`Task with ID: ${id} not found`);
                throw error;
            }

            logger.error('Failed to delete task. Please try again later. Error: ', error);
            throw new DatabaseError('Failed to delete task. Please try again later.');
        }
    }

}