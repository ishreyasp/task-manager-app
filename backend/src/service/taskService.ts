import { Request, Response } from 'express';
import { TaskModel } from '../models/task';
import { Task } from '../interfaces/task';
import tasks from '../database/tasks';
import { DatabaseError, NotFoundError } from '../exception/errorHandler';

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
            const allTasks = await tasks.findAll();
            return allTasks;
        } catch (error) {
            console.error('Error in TaskService.getAllTasks:', error);
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
            
            const createdTask = await tasks.create({
                title: taskModel.title,
                description: taskModel.description,
                status: taskModel.status
            });

            const taskObj = createdTask.get({ plain: true });
            
            if (taskObj.id) {
                taskModel.id = taskObj.id;
            }
            
            return taskModel;
        } catch (error) {
            console.error('Error in TaskService.createTask:', error);
            throw new DatabaseError(" Failed to create task. Please try again later.");
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
            const taskModel = new TaskModel(taskData);
            taskModel.id = id; 

            const existingTaskId = await tasks.findByPk(taskModel.id);

            if (!existingTaskId) {
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

            return taskModel;
        } catch (error) {
            console.error('Error in TaskService.updateTask:', error);
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
            const task = await tasks.findByPk(id);

            if (!task) {
                throw new NotFoundError(`Task with id ${id} not found`);
            }

            await task.destroy();
        } catch (error) {
            console.error('Error in TaskService.deleteTask:', error);
            throw new DatabaseError('Failed to delete task. Please try again later.');
        }
    }

}