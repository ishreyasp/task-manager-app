import { Task } from '../interfaces/task';

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

  isCompleted(): boolean {
    return this.status === 'Completed';
  }

  isPending(): boolean {
    return this.status === 'Pending';
  }

  isOngoing(): boolean {
    return this.status === 'Ongoing';
  }
}