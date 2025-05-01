# Task Manager App Backend

Backend for the Task Manager application built with Node.js, Express, and PostgreSQL.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- pg (PostgreSQL client)
- dotenv (Environment variable management)
- cors (Cross-Origin Resource Sharing)

## Setup and Installation

1. Make sure you have Node.js and PostgreSQL installed on your system.

2. Create a PostgreSQL database named `taskmanager` (or update the connection settings in the code).

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory with the following content (adjust as needed):
   ```
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=taskmanager
   ```

5. Build the TypeScript code:
   ```bash
   npm run build
   ```

6. Start the server:
   ```bash
   npm start
   ```

7. For development with live reload:
   ```bash
   npm run dev
   ```

## API Documentation

### Base URL
```
http://localhost:4000
```

### Endpoints

| Method | Endpoint     | Description               | Request Body               | Response                   |
|--------|--------------|---------------------------|----------------------------|----------------------------|
| GET    | /tasks       | Get all tasks             | -                          | Array of task objects      |
| POST   | /tasks       | Create a new task         | { title, description, status } | Created task object        |
| PUT    | /tasks/:id   | Update an existing task   | { title?, description?, status? } | Updated task object        |
| DELETE | /tasks/:id   | Delete a task             | -                          | - |

### Task Object Structure

```json
{
  "id": 1,
  "title": "Example Task",
  "description": "This is an example task description",
  "status": "Pending",
  "created_at": "2023-04-01T12:00:00.000Z"
}
```

### Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 503: Database Connection Error