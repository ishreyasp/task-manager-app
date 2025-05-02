/**
 * Interface representing the task data structure
 */
export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string;
  }

/**
 * Available task statuses
 */
export const TaskStatuses = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done'
} as const;
  
/**
 * Type for task status values
 */
export type TaskStatus = typeof TaskStatuses[keyof typeof TaskStatuses]; 