# Task Manager App

Task Manager Application built to manage and track day to day tasks with ease.

## Tech Stack Used

### 1. Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Sequalize

### 2. Frontend
- React
- Typescript
- TailwindCSS

## Setup and Installation
1. Make sure you have Node.js and PostgreSQL installed on your system.
   ```bash
   node --version
   npm --version
   psql --version
   ```

2. Create a PostgreSQL database named `task-manager-db` (or update the connection settings in the code).

3. Install frontend dependencies:
   ```bash
   cd frontend && npm install
   ```
4. Install backend dependencies:
   ``` bash
   cd backend && npm install
   ```

5. Create a `.env` file in the backend directory with the following content (adjust as needed):
   ```
   PORT=4000
   DB_USER=<username>
   DB_PASSWORD=<password>
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=task-manager-db
   ```

7. Build the app code:
   ```bash
   npm run build
   ```
8. Start backend and frontend server with live reload:
   ```bash
   npm run dev
   ```   

## API Documentation   
Visit https://github.com/ishreyasp/task-manager-app/tree/main/backend#readme for more information
## Screenshots of App
