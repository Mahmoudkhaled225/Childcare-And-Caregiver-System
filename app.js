import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import errorHandlerMW from "./middleware/errorHandlerMW.js";
import logger from "./utils/logger/logger.js";
import {config} from "dotenv";
import UserRouter from "./user/userRouter.js";
import CaregiverRouter from "./caregiver/caregiverRouter.js";


class App {
    constructor() {

        // Load environment variables
        config({ path: './config/dot.env' });
        const URL = process.env.URL;

        // Set up express app
        this.app = express();

        // Set up middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(morgan('dev'));
        this.app.use(helmet());
        this.app.use(cors());


        //Mount routes
        // const userRouterObj = new userRouter(UserService);
        const userRouterObj = new UserRouter();
        const caregiverRouterObj = new CaregiverRouter()
        this.app.use(`${URL}/users`,userRouterObj.getRouter());
        this.app.use(`${URL}/caregiver`,caregiverRouterObj.getRouter());


        this.app.get(`/`,(req, res) => {
            return res.send('Hello, world!');
        });
        this.app.get(`${process.env.URL}`,(req, res) => {
            return res.send('caregiver website!');
        });

        this.app.all("*", (req, res/*,next*/) => {
            //next(new AppError(`In-valid Routing `+req.originalUrl,404));
            logger.error(`In-valid Routing `+req.originalUrl);
            res.status(404).json({
                status: "Fail",
                message: `In-valid Routing `+req.originalUrl
            });
        });

        // Error handling middleware
        this.app.use(errorHandlerMW);
    }

    getApp() {
        return this.app;
    }


}

export default App;
