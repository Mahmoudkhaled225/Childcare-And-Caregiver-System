import {Router} from "express";
import UserController from "./userController.js";
import {validation} from "../middleware/validation.js";
import * as userValidation from "./userValidation.js";
import {fileUpload} from "../services/multer.js";
import authentication from "../middleware/authentication.js";
import authorization from "../middleware/authorization.js";
import accessRoles from "../EndPoints.js";
import Authentication from "../middleware/authentication.js";



/**
 * The UserRouter class is responsible for setting up the routes
 * for user-related HTTP requests in an Express.js application.
 */
class UserRouter {
    /**
     * Initializes a new instance of the UserRouter class
     * and sets up the routing for the user-related HTTP requests.
     */
    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.auth = new Authentication();

        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/signup',
            fileUpload({}).single("image"),
            validation(userValidation.registerValidation),
            this.userController.register);

        this.router.post('/login',
            validation(userValidation.loginValidation),
            this.userController.logIn);

        this.router.patch("/update",
            this.auth.middleware(),
            authorization([accessRoles.user, accessRoles.caregiver]),
            validation(userValidation.updateProfileValidation),
            this.userController.updateUserProfile)

        this.router.get("/profile/:id",
            this.auth.middleware(),
            authorization([accessRoles.user,accessRoles.caregiver]),
            validation(userValidation.userProfileValidation),
            this.userController.userProfile)

        this.router.patch("/deactivate",
            this.auth.middleware(),
            authorization([accessRoles.user,accessRoles.caregiver]),
            this.userController.softDelete)

        this.router.get("/mailundosoftdelete/:email",
            this.userController.undoSoftDeleteSendMail)

        this.router.patch("/undosoftdelete/:email",
            this.userController.undoSoftDelete)

        this.router.patch("/password",
            this.auth.middleware(),
            authorization([accessRoles.user,accessRoles.caregiver]),
            validation(userValidation.updatePasswordValidation),
            this.userController.updatePassword)


    }

    /**
     * Returns the Router object that was set up in the setupRoutes method.
     * @returns {object} The Express.js Router object.
     */
    getRouter() {
        return this.router;
    }
}

export default UserRouter;

