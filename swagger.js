import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import UserController from "./user/userController.js";

const options = {
    apis: [UserController],
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "API documentation for my app",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
};

const specs = swaggerJSDoc(options);

export default (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};