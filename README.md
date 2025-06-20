[![Integration Workflow](https://github.com/ishreyasp/task-manager-app/actions/workflows/ci.yml/badge.svg)](https://github.com/ishreyasp/task-manager-app/actions/workflows/ci.yml)
[![Deployment Workflow](https://github.com/ishreyasp/task-manager-app/actions/workflows/cd.yml/badge.svg)](https://github.com/ishreyasp/task-manager-app/actions/workflows/cd.yml)

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

6. Build the app code:
   ```bash
   npm run build
   ```

7. To run ESLint for backend and frontend:
   ```bash
   npm run lint
   ```

8. To run test for backend:
    ```bash
    cd backend
    npm run test
    ```

9. To run test for backend with coverage report:
    ```bash
    cd backend
    npm run test:coverage
    ```
             
10. Start backend and frontend server with live reload:
    ```bash
    npm run dev
    ```   

## Frontend is deployed at: https://task-manager-fuk6kzhlc-shreyas-purkars-projects.vercel.app

## To deploy backend on EC2 follow the below steps:
1. Go to terraform directory
   ```bash
   cd terraform
   ```

2. Run terraform init
   ```bash
   terraform init
   ```
   
3. Provision infrastructure
   ```bash
   terraform apply -var-file=dev.tfvars
   ```

4. Add EC2 IP address in Github Secrets and ALB DNS in Vercel environment (REACT_APP_API_BASE_URL)  

5. To destroy infrastructure 
   ```bash
   terraform destroy -var-file-dev.tfvars
   ```
   
## API Documentation   
Visit https://github.com/ishreyasp/task-manager-app/tree/main/backend#api-documentation for more information

## Regression Testing
Import `task-manager-app-regression.postman_collection` from regression directory into postion and run it for regression testing

## Screenshots of App
Visit https://github.com/ishreyasp/task-manager-app/tree/main/screenshots to see results for:
- Backend Restful APIs
- UI/UX
- Regression Tests

## Notes
### PM2 Process Manager
PM2 is utilized in this project to ensure backend application runs reliably in production. It provides:
- Continuous Operation: Automatically restarts the application if it crashes
- Startup Management: Ensures the application launches automatically when the server reboots
- Process Monitoring: Tracks application health, memory usage, and CPU consumption
- Log Management: Centralizes application logs for easier troubleshooting

The deployment workflow in this project automatically configures PM2 to manage the backend service, providing a resilient production environment with minimal downtime. 

Check out the [PM2 Documentation][pm2-docs] for more details.

[pm2-docs]: https://pm2.keymetrics.io/docs/usage/quick-start/

### Vercel Rewrites
This project utilizes Vercel's rewrites functionality to seamlessly connect the frontend and backend services. This is configured through a vercel.json file that contains rewrite rules.
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://[ALB-URL]/$1"
    }
  ]
}
```
These rewrites provide:
- API Proxying: Redirects API requests from the frontend to our AWS-hosted backend
- CORS Avoidance: Eliminates cross-origin issues by having requests appear from the same domain
- Certificate Handling: Manages HTTPS certificate validation between services
- Simplified Frontend Code: Allows the frontend to use relative API paths instead of absolute URLs

This approach creates a seamless integration between our Vercel-hosted frontend and AWS-hosted backend services, improving both security and developer experience.