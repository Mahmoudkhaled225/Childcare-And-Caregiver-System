import winston from 'winston';
import dotenv from 'dotenv';
dotenv.config({ path: './config/dot.env' });

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    // defaultMeta: { service: 'my-app' },
    transports: [
        new winston.transports.File({ filename: process.env.ERR_LOGOS_FILE_PATH , level: 'error' }),
        new winston.transports.File({ filename: process.env.COMBINED_LOGOS_FILE_PATH }),
    ],

});
logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}));



export default logger;
