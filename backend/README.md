# Task Manager App (Backend)

Backend for the Task Manager application built with Node.js, Express, and PostgreSQL.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Sequalize
- pg (PostgreSQL client)
- dotenv (Environment variable management)
- cors (Cross-Origin Resource Sharing)

## Setup and Installation

1. Make sure you have Node.js and PostgreSQL installed on your system.
   ```bash
   node --version
   npm --version
   psql --version
   ```

2. Create a PostgreSQL database named `task-manager-db` (or update the connection settings in the code).

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create a `.env` file in the directory with the following content (adjust as needed):
   ```
   PORT=4000
   DB_USER=<username>
   DB_PASSWORD=<password>
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=task-manager-db
   ```

6. Build the backend code:
   ```bash
   npm run build
   ```

7. Start the server:
   ```bash
   npm start
   ```

8. For starting server with live reload:
   ```bash
   npm run dev
   ```

## API Documentation

### Base URL
```
http://localhost:4000
```

### Endpoints

| Method | Endpoint     | Description               | Request Body               | Response                   |Status Code | 
|--------|--------------|---------------------------|----------------------------|----------------------------|-------------
| GET    | /tasks       | Get all tasks             | -                          | Array of task objects      | 200
| POST   | /tasks       | Create a new task         | { title, description, status } | Created task object        | 201
| PUT    | /tasks/:id   | Update an existing task   | { title, description, status } | Updated task object        | 200
| DELETE | /tasks/:id   | Delete a task             | -                          | - | 204

### Task Object Structure

```json
{
  "id": 1,
  "title": "Example Task",
  "description": "This is an example task description",
  "status": "Done",
  "created_at": "2023-04-01T12:00:00.000Z"
}
```

### Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 503: Database Connection Error