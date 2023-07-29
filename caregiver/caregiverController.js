import UserService from "../user/userService.js";
import userModel from "../DB/models/userModel.js";
import EmailSender from "../services/sendMail.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import caregiverModel from "../DB/models/caregiverModel.js";
import logger from "../utils/logger/logger.js";
import CaregiverService from "./caregiverService.js";
import asyncHandler from "../utils/ErrorHandling/asyncHandler.js";



class CaregiverController {
    constructor() {
        this.caregiverService = new CaregiverService(caregiverModel);
        this.userService = new UserService(userModel);
    }

    /**
     * function add caregiver properties.
     * @async
     * @function caregiverProperties
     *
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @returns {Promise<void>} A Promise that resolves when the processing is done.
     * @throws {AppError} If the user with the given ID is not a caregiver or not found.
     *
     * @access Public
     * @route POST /caregivers/:id/
     */
    caregiverProperties = asyncHandler(async (req, res, next) => {
        const {id} = req.params;
        const check = await userModel.findOne({_id:id, role:"caregiver"});
        if (!check)
            return next(new AppError(`you are not a Caregiver controller , Caregiver with ID ${id} is not found`, 404));
        const data = {
            availability:req.body.availability,
            hourlyRate:req.body.hourlyRate,
        };
        const caregiver = await this.caregiverService.createCaregiver(data);
        const user = await this.userService.setCaregiverProperties(id, caregiver._id);
        res.status(201).json({
            status: 'success',
            message: 'Fulfilled caregiver data',
            data: caregiver, user
        });
    });

    /**
     * Update caregiver properties.
     *
     * @function
     * @async
     * @access protected
     * @route PATCH /caregiver/properties
     *
     * @param {Object} req - The request object representing the incoming HTTP request.
     * @param {Object} res - The response object representing the HTTP response that will be sent.
     * @throws {AppError} If the caregiver properties update fails.
     * @returns {Promise<void>} A Promise that resolves when the caregiver properties are updated successfully.
     */
    updateCaregiverProperties = asyncHandler(async (req, res) => {
        const id = req.user.caregiverProperties;
        console.log(id)
        const data = {
            availability:req.body.availability,
            hourlyRate:req.body.hourlyRate,
        };
        const caregiver = await this.caregiverService.updateCaregiverPropertiesById(id, data);
        res.status(201).json({
            status: `success`,
            message: `caregiver data had been updated`,
            data: caregiver
        });
    });

    /**
     * Get all caregivers.
     *
     * @function
     * @async
     * @access public
     * @route GET /caregiver/all
     *
     * @param {Object} req - The request object representing the incoming HTTP request.
     * @param {Object} res - The response object representing the HTTP response that will be sent.
     * @throws {AppError} If fetching all caregivers fails.
     * @returns {Promise<void>} A Promise that resolves with the list of all caregivers.
     */
    getAllCaregivers = asyncHandler(async (req, res) => {
        const caregivers = await this.caregiverService.getAllCaregivers();
        res.status(200).json({
            status: 'success',
            message: 'All caregivers',
            data: caregivers
        });
    });




}

export default CaregiverController;