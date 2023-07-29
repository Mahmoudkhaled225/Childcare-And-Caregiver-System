import http from 'http';
import App from './app.js';
import connectionDB from "./DB/connection.js";
import logger from "./utils/logger/logger.js";

class Server {
    constructor() {
        this.app = new App().getApp();
        this.server = http.createServer(this.app);
        this.port = process.env.PORT || 8000;
    }

    start() {
        this.server.listen(this.port, async() => {
            logger.info(`Server is running on port ${this.port}`);
            logger.info(`http://localhost:${this.port}${process.env.URL}`);
            await connectionDB();
        });

        this.server.on('error', (error) => {
            logger.error(`Error starting server: ${error.message}`);
        });

        process.on('unhandledRejection', (error) => {
            logger.error(`Unhandled rejection: ${error}`);
            process.exit(1);
        });

        process.on('uncaughtException', (error) => {
            logger.error(`Uncaught exception: ${error.message}`);
            process.exit(1);
        });
    }
}

const server = new Server();
server.start();


