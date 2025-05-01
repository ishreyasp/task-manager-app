/**
 * Task interface representing a task model
 */
export interface Task {
    id?: number;
    title: string;
    description: string;
    status: string;
    createdAt?: Date;
  }