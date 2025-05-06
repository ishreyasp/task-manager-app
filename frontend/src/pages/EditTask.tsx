import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { Task } from '../models/task';
import { TaskCreate } from '../models/taskInput';
import { Service, ServiceError } from '../services/service';

/**
 * Page component for editing a task
 */
const EditTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

/**
 * Fetch task details on component mount
 */
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const taskId = parseInt(id);
        const fetchedTask = await Service.getTaskById(taskId);
        setTask(fetchedTask);
      } catch (err) {
        const serviceError = err as ServiceError;
        setError(serviceError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  /**
   * Handle task update
   */
  const handleUpdateTask = async (taskData: TaskCreate) => {
    if (!id || !task) return;
    try {
      setSubmitting(true);
      setError(null);
      const taskId = parseInt(id);
      await Service.updateTask(taskId, taskData);
      navigate('/'); 
    } catch (err) {
      const serviceError = err as ServiceError;
      setError(serviceError.message);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle task deletion
   */
  const handleDeleteTask = async () => {
    if (!id) return;
    try {
      setSubmitting(true);
      const taskId = parseInt(id);
      await Service.deleteTask(taskId);
      navigate('/'); 
    } catch (err) {
      const serviceError = err as ServiceError;
      setError(serviceError.message);
    } finally {
      setSubmitting(false);
      setDeleteConfirmOpen(false);
    }
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    navigate('/');
  };

  /**
   * Render the EditTaskPage component 
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
          <h1 className="text-3xl font-bold text-neutral-800">Edit Task</h1>
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
        {loading ? (
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading task details...</p>
          </div>
        ) : task ? (
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-primary-100 rounded-full p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-neutral-800">Task Details</h2>
              </div>
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="bg-danger-50 text-danger-700 hover:bg-danger-100 rounded-full p-2 flex items-center justify-center"
                aria-label="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <TaskForm 
              initialData={task}
              onSubmit={handleUpdateTask} 
              onCancel={handleCancel}
              isEditing={true}
              isSubmitting={submitting}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-8 text-center">
            <div className="text-neutral-600">Task not found.</div>
            <button 
              onClick={handleCancel}
              className="mt-4 btn btn-primary"
            >
              Go Back to Tasks
            </button>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-danger-100 mb-6 animate-pulse">
                  <svg className="h-8 w-8 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-neutral-800 mb-3">Delete Task</h3>
                
                <div className="mb-6 bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                  <p className="text-neutral-600 mb-2">Are you sure you want to delete this task?</p>
                  <div className="font-medium text-lg text-danger-700 mb-2">"{task?.title}"</div>
                  <p className="text-xs text-neutral-500">This action cannot be undone.</p>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="btn btn-secondary px-6"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteTask}
                    className="btn btn-danger px-6 flex items-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTaskPage;