import UserService from "./userService.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import {hashPassword} from "../utils/hashing/hashPassword.js";
import {compareHashedPassword} from "../utils/hashing/compareHashedPassword.js";
import {createToken} from "../utils/token/createToken.js";
import cloudinary from "../services/cloudinary.js";
import logger from "../utils/logger/logger.js";
import userModel from "../DB/models/userModel.js";
import EmailSender from "../services/sendMail.js";
import {nanoid} from "nanoid";
import asyncHandler from "../utils/ErrorHandling/asyncHandler.js";




class UserController {
    constructor() {
        this.userService = new UserService(userModel);
        this.emailSender = new EmailSender({
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASS,
            },
        });
    }

    /**
     * Register a new user
     *
     * @desc Register a new user with email and password
     * @route POST /api/users/register
     * @access Public
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @throws {AppError} If a user with the provided email already exists.
     * @returns {Promise<void>} A promise that resolves with the created user object.
     */
    register = asyncHandler(async (req, res) => {
        const checkUser = await this.userService.getUserByEmail(req.body.email);
        if (checkUser) {
            throw new AppError(`User with email ${req.body.email} already exists`, 400);
        }
        const hash = hashPassword(req.body.password);

        if (!req.file)
            throw new AppError("Please upload a your image", 400);
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
            {
                folder: `${process.env.PROJECT_FOLDER}/Users`
            });
        const data = {
            username:req.body.username,
            email:req.body.email,
            password:hash,
            phone:req.body.phone,
            age:req.body.age,
            image: {secure_url, public_id},
            role: req.body.role,
            address: req.body.address
        };
        const user = await this.userService.createUser(data);
        if (!user) {
            await cloudinary.uploader.destroy(public_id);
            throw new AppError('User not created Database error try again', 500);
        }
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: user
        });
    });

    /**
     * Log in a user with the given email and password.
     *
     * @async
     * @function logIn
     * @access public
     * @route POST /login
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @throws {AppError} If the user with the given email is not found.
     * @throws {AppError} If the password is incorrect.
     * @returns {Promise<void>}
     */
    logIn = asyncHandler(async (req, res) => {
        const {email, password} = req.body;
        const user = await this.userService.getUserByEmail(email);
        if (!user)
            throw new AppError(`User with this email ${email} not found Register please`, 404);

        if(user.isDeleted===true)
            throw new AppError(`User with this email ${email} is deactivated soft delete `, 404);

        const isMatch = compareHashedPassword(password, user.password);
        // console.log(isMatch,hashPassword(password), user.password);

        if (!isMatch)
            throw new AppError('Invalid email or password', 400);

        const token = createToken({id: user._id})
        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            data: {/*user,*/ token}
        });
    });

    /**
     * Update the profile of the currently logged-in user.
     *
     * @async
     * @function
     * @access protected
     * @route PUT /update-profile
     *
     * @param {Object} req - The request object representing the incoming HTTP request.
     * @param {Object} res - The response object representing the HTTP response that will be sent.
     * @throws {AppError} If an error occurs during the user update process.
     * @returns {Promise<void>}
     */
    updateUserProfile = asyncHandler(async (req, res) => {
        const {_id} = req.user;
        const user = await this.userService.updateUser(_id, req.body);
        if (!user) {
            throw new AppError(`error happened try again`, 404);
        }
        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: user
        });
    });

    /**
     * Get user profile by ID.
     *
     * @async
     * @function
     * @access protected
     * @route POST /profile/:id
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @throws {AppError} If no user is found with the provided ID.
     * @returns {Promise<void>}
     */
    userProfile = asyncHandler(async (req,res) => {
        const {id} = req.params;
        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new AppError(`no user with this ${id}`, 404);
        }
        res.status(200).json({
            status: 'success',
            message: `User with ${id} Profile`,
            data: user
        });
    });

    /**
     * Soft delete the user account by setting the 'isDeleted' flag to true.
     *
     * @function
     * @async
     * @access protected
     * @route POST /soft-delete
     *
     * @param {Object} req - The request object representing the incoming HTTP request.
     * @param {Object} res - The response object representing the HTTP response that will be sent.
     * @throws {AppError} If an error occurs during the user update process.
     * @returns {Promise<void>}
     */
    // deactivate
    softDelete = asyncHandler(async (req, res) => {
        const {_id} = req.user;
        const user = await this.userService.updateUser(_id,{isDeleted: true});
        if (!user)
            throw new AppError(`error happened please try again`, 404);

        res.status(200).json({
            status: 'success',
            message: `this account has been deactivated`,
        });
    });

    /**
     * Send an email to the user with a confirmation code to undo the soft delete.
     *
     * @function
     * @async
     * @access public
     * @route GET /mailundosoftdelete/:email
     *
     * @param {Object} req - The request object representing the incoming HTTP request.
     * @param {Object} res - The response object representing the HTTP response that will be sent.
     * @throws {AppError} If the provided email is not associated with a deactivated user.
     * @throws {AppError} If the user's account is already confirmed and not soft-deleted.
     * @returns {Promise<void>}
     */
    undoSoftDeleteSendMail = asyncHandler(async (req, res) => {
        const {email} = req.params;
        const user = await this.userService.getDeactivatedUser(email);
        if(!user)
            throw AppError("in-valid email you are not registered ", 400);
        if(user.isDeleted === false)
            throw new AppError("you are already confirmed login please ", 400);
        const code = nanoid( 6, "123456789");
        const message = `this is your code ${code} to undo soft delete`;
        const mail =await this.emailSender.sendEmail({
            to: user.email,
            message,
            subject: "Undo Soft Delete"
        });
        if(!mail)
            throw new AppError("could not send you mail plz try again", 400);
        await user.updateOne({$set:{undoIsDeletedCode:code}})
        return res.status(200).json({message: "check your inbox"});
    });


    /**
     * Undo the soft delete for a user account using the provided confirmation code.
     *
     * @function
     * @async
     * @access public
     * @route PATCH /undosoftdelete/:email
     *
     * @param {Object} req - The request object representing the incoming HTTP request.
     * @param {Object} res - The response object representing the HTTP response that will be sent.
     * @throws {AppError} If the provided email and undoIsDeletedCode combination is not valid.
     * @returns {Promise<void>}
     */
    undoSoftDelete = asyncHandler(async (req, res) => {
        const {email} = req.params;
        const { undoIsDeletedCode } = req.body;
        const user = await this.userService.getUser({email, undoIsDeletedCode});
        console.log(user)
        if(!user)
            throw new AppError("you are not signed up register plz", 400);
        console.log(undoIsDeletedCode,user.undoIsDeletedCode)
        if(user.undoIsDeletedCode !== undoIsDeletedCode)
            throw new AppError("in-valid code", 400);
        await user.updateOne({$set:{undoIsDeletedCode:null, isDeleted:false}});
        return res.status(200).json({ message: "welcome please login", user});
    });

    /**
     * Update the user's password with a new one.
     *
     * @function
     * @async
     * @access protected
     * @route PATCH /password
     *
     * @param {Object} req - The request object representing the incoming HTTP request.
     * @param {Object} res - The response object representing the HTTP response that will be sent.
     * @throws {AppError} If the current password provided is incorrect.
     * @returns {Promise<void>}
     */
    updatePassword = asyncHandler(async (req, res) => {
        const {currentPassword ,newPassword} = req.body;
        const {_id} = req.user;
        const checkUser = await this.userService.getUserById(_id);
        if(!compareHashedPassword(currentPassword,checkUser.password))
            throw new AppError("in-valid current password", 400);
        //happened by Joi
        // if(newPassword !== newConfirmationPassword)
        //     throw new AppError("new password and new confirmation password are not same", 400);
        const hashedPassword = hashPassword(newPassword);
        const flag = await this.userService.updateUser(_id,{password:hashedPassword});
        if(!flag)
            throw new AppError("could not update password please try again", 400);
        return res.json({ message: "password changed log in again", flag });
    });


}

export default UserController;