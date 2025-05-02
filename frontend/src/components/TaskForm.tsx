import React, { useState, useEffect } from 'react';
import { Task, TaskStatuses, TaskStatus } from '../models/task';
import { TaskCreate } from '../models/taskInput';

/**
 * TaskFormProps interface for defining the props of the TaskForm component
 */
interface TaskFormProps {
  initialData?: Task;
  onSubmit: (task: TaskCreate) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

/**
 * Form component for creating or editing tasks with enhanced UI
 */
const TaskForm: React.FC<TaskFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing = false,
  isSubmitting = false 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatuses.TODO);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    status?: string;
  }>({});

  /**
   * Set initial values if editing an existing task
   */
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      
      const statusValue = Object.values(TaskStatuses).includes(initialData.status as TaskStatus) 
        ? initialData.status as TaskStatus 
        : TaskStatuses.TODO;
      setStatus(statusValue);
    }
  }, [initialData]);

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      description?: string;
      status?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        status
      });
      
      // Reset form if not editing
      if (!isEditing) {
        setTitle('');
        setDescription('');
        setStatus(TaskStatuses.TODO);
      }
    }
  };

  /**
   * Get the appropriate status badge class for the select option
   */
  const getStatusClass = (statusOption: string): string => {
    switch (statusOption) {
      case TaskStatuses.TODO:
        return 'bg-primary-100 text-primary-700';
      case TaskStatuses.IN_PROGRESS:
        return 'bg-warning-100 text-warning-700';
      case TaskStatuses.DONE:
        return 'bg-success-100 text-success-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  /**
   * Render the form with input fields for title, description, and status
   * along with validation error messages
   */
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title field with icon and error handling */}
      <div>
        <label htmlFor="title" className="form-label">
          Title <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`form-input pl-10 ${errors.title ? 'border-danger-300 focus:ring-danger-300' : ''}`}
            placeholder="Enter task title"
            disabled={isSubmitting}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        </div>
        {errors.title && (
          <p className="mt-1.5 text-danger-600 text-xs flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {errors.title}
          </p>
        )}
      </div>

       {/* Description field with icon and error handling */} 
      <div>
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <div className="relative">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input min-h-[120px] pl-10"
            placeholder="Enter task description"
            disabled={isSubmitting}
          />
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Status field with icon and error handling */}
      <div>
        <label htmlFor="status" className="form-label">
          Status <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className={`form-select pl-10 appearance-none ${errors.status ? 'border-danger-300 focus:ring-danger-300' : ''}`}
            disabled={isSubmitting}
          >
            {Object.values(TaskStatuses).map((statusOption) => (
              <option key={statusOption} value={statusOption} className={getStatusClass(statusOption)}>
                {statusOption}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.status && (
          <p className="mt-1.5 text-danger-600 text-xs flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {errors.status}
          </p>
        )}
      </div>

      {/* Submit and Cancel buttons */}
      <div className="flex gap-4 pt-3">
        <button 
          type="submit" 
          className="btn btn-primary flex-1 flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-5 w-5 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : isEditing ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Update Task
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Task
            </>
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary flex-1 flex items-center justify-center"
            disabled={isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;