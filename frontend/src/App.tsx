import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskBoard from './components/TaskBoard';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';

/**
 * Main App component with routing
 */
const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="app-header">
          <div className="container-custom flex items-center">
            <div className="mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Task Manager</h1>
              <p className="text-primary-100 text-sm">Manage tasks with ease</p>
            </div>
          </div>
        </header>
        
        <main className="flex-grow py-8">
          <Routes>
            <Route path="/" element={<TaskBoard />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/edit-task/:id" element={<EditTask />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <div className="container-custom text-center">
            <p className="text-sm">
              Task Manager <p />
              Developed with <span className="text-primary-300">React</span> and 
              <span className="text-primary-300"> Tailwind CSS</span> <br />
              Developed By Shreyas Purkar
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;