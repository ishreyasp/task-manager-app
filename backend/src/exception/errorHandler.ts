import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Custom error class for database related errors
 * Used when database operations fail or are unavailable
 */
export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}

/**
 * Custom error class for validation errors
 * Used when request data fails validation checks
 */
export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Custom error class for resource not found errors
 * Used when requested resources cannot be located
 */
export class NotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'NotFoundError';
    }
}

/**
 * Global error handling middleware for Express
 * Processes errors and returns appropriate HTTP responses based on error type
 * 
 * @param err - The error object thrown in the application
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function (required for error middleware)
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction  // This parameter is required for Express to recognize it as an error handler
): void => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });

    if (err instanceof DatabaseError) {
        res.status(503).json({
            error: 'Database Error',
            message: err.message
        });
    } else if (err instanceof ValidationError) {
        res.status(400).json({
            error: 'Validation Error',
            message: err.message
        });
    } else if (err instanceof NotFoundError) {
        res.status(404).json({
            error: 'Resource Not Found Error',
            message: err.message
        });
    } else {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred'
        });
    }
};