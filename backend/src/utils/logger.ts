import * as winston from 'winston';
const { format, transports } = winston;

/**
 * Logger configuration using Winston.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', 
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(), 
    format.json()
  ),
  defaultMeta: { service: 'api-service' }, 
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info: winston.Logform.TransformableInfo) => {
          const { timestamp, level, message, ...meta } = info;
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }`;
        })
      )
    }),
  ]
});

export default logger;