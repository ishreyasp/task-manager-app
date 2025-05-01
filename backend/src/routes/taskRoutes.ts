import { Router } from 'express';
import TaskController from '../controllers/taskController';

const router = Router();

// Get all tasks
router.get('/', TaskController.getAllTasks);

// Create a new task
router.post('/', TaskController.createTask);

// Update task by task Id
router.put('/:id', TaskController.updateTask);

// Delete task by task Id
router.delete('/:id', TaskController.deleteTask);

export default router;