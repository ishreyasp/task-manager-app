import axios, { AxiosError } from 'axios';
import { Task } from '../models/task'; 
import { TaskCreate } from '../models/taskInput';
import { TaskUpdate } from '../models/taskUpdate';

/**
 * Base URL for API requests
 */
const API_BASE_URL = "/api";

/**
 * Custom error interface to expose backend error messages
 */
export interface ServiceError {
  message: string;
  statusCode?: number;
  originalError?: any;
}

/**
 * Axios instance for making API requests
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', 
    'Accept': 'application/json',   
    },      
});

/**
 * Extract error message from backend responses
 */
const handleApiError = (error: any): ServiceError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.data) {
      const data = axiosError.response.data as any;
      return {
        message: data.message || data.error || 'An unexpected error occurred',
        statusCode: axiosError.response.status,
        originalError: error
      };
    }

    if (axiosError.request && !axiosError.response) {
      return {
        message: 'Unable to connect to the server. Please check your internet connection.',
        statusCode: 503,
        originalError: error
      };
    }
  }
  
  // Default error message
  return {
    message: error.message || 'An unexpected error occurred',
    statusCode: error.response?.status || 500,
    originalError: error
  };
};

/**
 * Task service with methods for interacting with the backend API
*/
export const Service = {

    /**
     * Get all tasks
     * @returns Promise resolving to array of tasks
     * @throws ServiceError
     */
    getTasks: async (): Promise<Task[]> => {
        try {
            const response = await axiosInstance.get('/tasks');
            return response.data;
        } catch (error) {
          throw handleApiError(error);
        }
    },

    /**
     * Get a single task by ID
     * @param id - The task ID
     * @returns Promise resolving to a task
     * @throws ServiceError
     */
    getTaskById: async (id: number): Promise<Task> => {
      try {
        const response = await axiosInstance.get(`/tasks/${id}`);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    /**
     * Create a new task
     * @param task - The task data to create
     * @returns Promise resolving to the created task
     * @throws ServiceError
     */
  createTask: async (task: TaskCreate): Promise<Task> => {
    try {
      const response = await axiosInstance.post('/tasks', task);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing task
   * @param id - The task ID
   * @param updates - The task data to update
   * @returns Promise resolving to the updated task
   * @throws ServiceError
   */
  updateTask: async (id: number, updates: TaskUpdate): Promise<Task> => {
    try {
      const response = await axiosInstance.put(`/tasks/${id}`, updates);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a task
   * @param id - The task ID
   * @returns Promise resolving to a success message
   * @throws ServiceError
   */
  deleteTask: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
}