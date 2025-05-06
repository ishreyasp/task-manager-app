import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { TaskCreate } from '../models/taskInput';
import { Service, ServiceError } from '../services/service';

/**
 * Page component for creating a new task
 */
const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle task creation
   */
  const handleCreateTask = async (taskData: TaskCreate) => {
    try {
      setLoading(true);
      setError(null);
      await Service.createTask(taskData);
      navigate('/'); 
    } catch (err) {
      const serviceError = err as ServiceError;
      setError(serviceError.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    navigate('/');
  };

  /**
   * Render the CreateTaskPage component
   */
  return (
    <div className="container-custom">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={handleCancel}
            className="mr-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-600"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-neutral-800">Create New Task</h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-danger-50 border-l-4 border-danger-500 text-danger-700 p-4 rounded-lg mb-6 shadow-sm" role="alert">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Task form component */}
        <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-800">Task Details</h2>
          </div>
          
          <TaskForm 
            onSubmit={handleCreateTask} 
            onCancel={handleCancel}
            isSubmitting={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;