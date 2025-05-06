import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes'; 
import { errorHandler } from './exception/errorHandler'; 

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check endpoint
app.get("/healthz", (req, res) => {
    res.status(200).json({ message: "Backend is running!" });
});

export default app;