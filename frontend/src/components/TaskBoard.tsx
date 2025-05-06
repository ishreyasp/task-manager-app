import React, { useState, useEffect } from 'react';
import { Task, TaskStatuses } from '../models/task';
import { TaskCreate } from '../models/taskInput';
import { Service, ServiceError } from '../services/service';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard view with columns for different task statuses
 */
const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Fetch tasks on component mount
   */
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Fetch all tasks from the API
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await Service.getTasks();
      // eslint-disable-next-line no-console
      console.log('API Response:', data);
      setTasks(data);
    } catch (err) {
      const serviceError = err as ServiceError;
      setError(serviceError.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle updating a task status
   */
  const handleUpdateTaskStatus = async (task: Task, newStatus: string) => {
    try {
      const taskData: TaskCreate = { title: task.title, description: task.description, status: newStatus };
      const updatedTask = await Service.updateTask(task.id, taskData);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (err) {
      const serviceError = err as ServiceError;
      setError(serviceError.message);
    }
  };

  /**
   * Filter tasks by status
   */
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  /**
   * Navigate to the create task page
   */
  const navigateToCreateTask = () => {
    navigate('/create-task');
  };

  /**
   * Navigate to edit task page
   */
  const navigateToEditTask = (taskId: number) => {
    navigate(`/edit-task/${taskId}`);
  };

  /**
   * Render the task board with columns for each status
   */
  return (
    <div className="container-custom">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Task Dashboard</h1>

        {/* Button to create a new task */}
        <button 
          onClick={navigateToCreateTask} 
          className="btn btn-primary btn-icon"
          aria-label="Create new task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Task
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-danger-50 border-l-4 border-danger-500 text-danger-700 p-4 rounded-lg mb-8 shadow-sm" role="alert">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
        
      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <span className="ml-3 text-neutral-600">Loading your tasks...</span>
        </div>
      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* To Do Column */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 overflow-hidden">
            <div className="bg-primary-50 p-4 border-b border-primary-100">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <h2 className="font-semibold text-primary-700">To Do</h2>
                <div className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {getTasksByStatus(TaskStatuses.TODO).length}
                </div>
              </div>
            </div>

            {/* Task card for each task in the To Do column */}
            {/* If no tasks, show a message no tasks in to do*/}
            {/* If tasks exist, display each task */}
            {/* Each task card is clickable to navigate to the edit task page */}
            {/* Each task card has a button to move the task to In Progress */}
            <div className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto space-y-4">
              {getTasksByStatus(TaskStatuses.TODO).length > 0 ? (
                getTasksByStatus(TaskStatuses.TODO).map(task => (
                  <div 
                    key={task.id} 
                    className="task-card p-4 cursor-pointer"
                    onClick={() => navigateToEditTask(task.id)}
                  >
                    <h3 className="font-medium text-neutral-800 mb-2">{task.title}</h3>
                    <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                      {task.description || <span className="text-neutral-400 italic">No description</span>}
                    </p>
                    <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p> 
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateTaskStatus(task, TaskStatuses.IN_PROGRESS);
                        }}
                        className="text-xs text-primary-700 hover:text-primary-900 bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded-md transition-colors"
                      >
                        Move to In Progress
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-neutral-400">
                  <p>No tasks to do</p>
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 overflow-hidden">
            <div className="bg-warning-50 p-4 border-b border-warning-100">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-warning-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h2 className="font-semibold text-warning-700">In Progress</h2>
                <div className="ml-2 bg-warning-100 text-warning-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {getTasksByStatus(TaskStatuses.IN_PROGRESS).length}
                </div>
              </div>
            </div>

            {/* Task card for each task in the In Progress column */}
            {/* If no tasks, show a message no tasks in progress*/}
            {/* If tasks exist, display each task */}
            {/* Each task card is clickable to navigate to the edit task page */}
            {/* Each task card has buttons to move the task to To Do or Done */}
            <div className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto space-y-4">
              {getTasksByStatus(TaskStatuses.IN_PROGRESS).length > 0 ? (
                getTasksByStatus(TaskStatuses.IN_PROGRESS).map(task => (
                  <div 
                    key={task.id} 
                    className="task-card p-4 cursor-pointer"
                    onClick={() => navigateToEditTask(task.id)}
                  >
                    <h3 className="font-medium text-neutral-800 mb-2">{task.title}</h3>
                    <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                      {task.description || <span className="text-neutral-400 italic">No description</span>}
                    </p>
                    <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p> 
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateTaskStatus(task, TaskStatuses.TODO);
                        }}
                        className="text-xs text-primary-700 hover:text-primary-900 bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded-md transition-colors"
                      >
                        Move to To Do
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateTaskStatus(task, TaskStatuses.DONE);
                        }}
                        className="text-xs text-success-700 hover:text-success-900 bg-success-50 hover:bg-success-100 px-2 py-1 rounded-md transition-colors"
                      >
                        Move to Done
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-neutral-400">
                  <p>No tasks in progress</p>
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 overflow-hidden">
            <div className="bg-success-50 p-4 border-b border-success-100">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="font-semibold text-success-700">Done</h2>
                <div className="ml-2 bg-success-100 text-success-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {getTasksByStatus(TaskStatuses.DONE).length}
                </div>
              </div>
            </div>

            {/* Task card for each task in the Done column */}
            {/* If no tasks, show a message no completed tasks*/}
            {/* If tasks exist, display each task */}
            {/* Each task card is clickable to navigate to the edit task page */}
            {/* Each task card has a button to move the task to In Progress */}
            <div className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto space-y-4">
              {getTasksByStatus(TaskStatuses.DONE).length > 0 ? (
                getTasksByStatus(TaskStatuses.DONE).map(task => (
                  <div 
                    key={task.id} 
                    className="task-card p-4 cursor-pointer"
                    onClick={() => navigateToEditTask(task.id)}
                  >
                    <h3 className="font-medium text-neutral-800 mb-2">{task.title}</h3>
                    <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                      {task.description || <span className="text-neutral-400 italic">No description</span>}
                    </p>
                    <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p> 
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateTaskStatus(task, TaskStatuses.IN_PROGRESS);
                        }}
                        className="text-xs text-warning-700 hover:text-warning-900 bg-warning-50 hover:bg-warning-100 px-2 py-1 rounded-md transition-colors"
                      >
                        Move to In Progress
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-neutral-400">
                  <p>No completed tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;