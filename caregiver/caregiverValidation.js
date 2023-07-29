import joi from "joi";
import {generalFields} from "../middleware/validation.js";


export const caregiverPropertiesValidation = joi.object({
    hourlyRate :joi.number().min(0).required(),
    availability :joi.array().items(
        joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').required())
        .required(),
    id: generalFields.id,
}).required();

export const updateCaregiverPropertiesValidation = joi.object({
    hourlyRate :joi.number().min(0).optional(),
    availability :joi.array().items(
        joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'))
        .optional(),
    // id: generalFields.id,
}).required();
