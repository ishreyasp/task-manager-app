import app from './app';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize server port
const PORT = process.env.PORT;

/**
 * Function to start the server
 */
const startSrv = async () => {
    try {
        // Start the server
        app.listen(PORT, () => {    
            console.log(`Server is running on port ${PORT}`);
        });
        
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1); 
    }
}

startSrv();