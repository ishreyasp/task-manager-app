import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from '../utils/logger';

// Load environment variables
dotenv.config();

/**
 * Initialize Sequelize ORM with database connection parameters
 */
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as any, 
    port: parseInt(process.env.DB_PORT || '5432') 
});

/**
 * Self-executing async function to:
 * 1. Test the database connection
 * 2. Synchronize the database schema with defined models
 */
export const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Connection to the database has been established successfully.');

        await sequelize.sync({ force: false });
        logger.info('Database synchronized successfully.');
        return true;
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        throw error;
    }
};

export default sequelize;