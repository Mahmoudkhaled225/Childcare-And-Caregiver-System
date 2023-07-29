import joi from "joi"
import {generalFields} from "../middleware/validation.js";


// i just stopped password.general fields for easier testing
export const registerValidation = joi.object({
    username : joi.string().min(2).max(30).required(),
    email: generalFields.email,
    // password: generalFields.password,
    password : joi.string().min(2).max(30).required(),
    confirmationPassword: generalFields.confirmationPassword,
    age: joi.number().min(18).required(),
    phone: generalFields.phone,
    file: generalFields.file,
    role:joi.string().valid("user","caregiver"),
    address: joi.string().required(),
}).required();


export const loginValidation = joi.object({
    email: generalFields.email,
    password : joi.string().min(2).max(30).required(),
    // password: generalFields.password,
}).required();

export const updateProfileValidation = joi.object({
    username : joi.string().min(2).max(30),
    age: joi.number().min(18),
    phone: generalFields.phone,
    address: joi.string(),
}).required();

export const userProfileValidation = joi.object({
    id: generalFields.id
}).required();


export const updatePasswordValidation = joi.object({
    currentPassword:joi.string().min(2).max(30).required(),
    newPassword: generalFields.password,
    newConfirmationPassword: generalFields.newConfirmationPassword,
}).required();




// /**
//  * Defines validation schemas for user-related requests.
//  */
// export const userValidation = {
//     /**
//      * A Joi schema for validating user registration requests.
//      */
//     registerValidation: joi.object({
//         username: joi.string().min(2).max(30).required(),
//         email: joi.string().email().required(),
//         password: joi.string().min(2).max(30).required(),
//         confirmationPassword: joi.ref("password"),
//         age: joi.number().min(18).required(),
//         phone: joi.string(),
//         file: joi.any(),
//         role: joi.string().valid("user", "caregiver"),
//         address: joi.string().required(),
//     }).required(),
//
//     /**
//      * A Joi schema for validating user login requests.
//      */
//     loginValidation: joi.object({
//         email: joi.string().email().required(),
//         password: joi.string().min(2).max(30).required(),
//     }).required(),
//
//     /**
//      * A Joi schema for validating user profile update requests.
//      */
//     updateProfileValidation: joi.object({
//         username: joi.string().min(2).max(30),
//         age: joi.number().min(18),
//         phone: joi.string(),
//         address: joi.string().required(),
//     }).required(),
//
//     /**
//      * A Joi schema for validating user profile requests.
//      */
//     userProfileValidation: joi.object({
//         id: joi.string().required(),
//     }).required(),
//
//     /**
//      * A Joi schema for validating user password update requests.
//      */
//     updatePasswordValidation: joi.object({
//         currentPassword: joi.string().min(2).max(30).required(),
//         newPassword: joi.string().min(2).max(30).required(),
//         newConfirmationPassword: joi.ref("newPassword"),
//     }).required(),
// };
//
// export default userValidation;