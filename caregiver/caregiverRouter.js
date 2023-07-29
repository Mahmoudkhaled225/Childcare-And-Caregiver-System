import {Router} from "express";
import {validation} from "../middleware/validation.js";
import * as caregiverValidation from "./caregiverValidation.js";

import authorization from "../middleware/authorization.js";
import accessRoles from "../EndPoints.js";
import Authentication from "../middleware/authentication.js";
import CaregiverController from "./caregiverController.js";




class CaregiverRouter {
    constructor() {
        this.router = Router();
        this.caregiverController = new CaregiverController();
        this.auth = new Authentication();

        this.setupRoutes();
    }


    setupRoutes() {
        this.router.post('/:id',
            validation(caregiverValidation.caregiverPropertiesValidation),
            this.caregiverController.caregiverProperties);

        this.router.patch('/update',
            this.auth.middleware(),
            authorization([accessRoles.caregiver]),
            validation(caregiverValidation.updateCaregiverPropertiesValidation),
            this.caregiverController.updateCaregiverProperties);

        this.router.get('/all',
            // this.auth.middleware(),
            // authorization([accessRoles.user,accessRoles.admin,accessRoles.caregiver]),
            this.caregiverController.getAllCaregivers);

    };


    /**
     * Returns the Router object that was set up in the setupRoutes method.
     * @returns {object} The Express.js Router object.
     */
    getRouter() {
        return this.router;
    }
}

export default CaregiverRouter;

