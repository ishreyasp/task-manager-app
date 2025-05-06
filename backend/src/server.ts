import app from './app';
import dotenv from 'dotenv';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

// Initialize server port
const PORT = process.env.PORT || 4000;

/**
 * Function to start the server
 */
const startSrv = async () => {
    try {
        // Start the server
        app.listen(PORT, () => {    
            logger.info(`Server is running on port ${PORT}`);
        });
        
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1); 
    }
}

startSrv();