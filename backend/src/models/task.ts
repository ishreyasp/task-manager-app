import { Task } from '../interfaces/task';
import TASK_STATUSES from '../constants/stringConstants';

/**
 * Task model handling operations related to task management
 */
export class TaskModel implements Task {
  id?: number;
  title: string;
  description: string;
  status: string;
  createdAt: Date;

  constructor(taskData: Task) {
    this.title = taskData.title;
    this.description = taskData.description;
    this.status = taskData.status;
    this.createdAt = new Date();
  }

  isDone(): boolean {
    return this.status === TASK_STATUSES.DONE;
  }

  isToDo(): boolean {
    return this.status === TASK_STATUSES.TO_DO;
  }

  isInProgress(): boolean {
    return this.status === TASK_STATUSES.IN_PROGRESS;
  }
}