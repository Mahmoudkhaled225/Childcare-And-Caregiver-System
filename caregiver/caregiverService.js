import caregiverModel from "../DB/models/caregiverModel.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import asyncHandler from "../utils/ErrorHandling/asyncHandler.js";
import userModel from "../DB/models/userModel.js";
import ApiFeatures from "../services/ApiFeatures.js";




class CaregiverService {
    constructor(caregiverModel) {
        this.caregiverModel = caregiverModel;
    }

    createCaregiver = asyncHandler(async (Data) => {
        const properties = new this.caregiverModel(Data);
        await properties.save();
        return properties;
    });

    updateCaregiverPropertiesById = asyncHandler(async (id, userData) => {
        const caregiver = await this.caregiverModel.findByIdAndUpdate(id, userData, { new: true });
        if (!caregiver)
            throw new AppError(`User with ID ${id} is not found`, 404);
        return caregiver;
    });

    getCaregiverById = asyncHandler(async (id) => {
        const caregiver = await this.caregiverModel.findById(id);
        if (!caregiver) {
            throw new AppError(`Caregiver with ID ${id} not found`, 404);
        }
        return caregiver;
    });

    getAllCaregivers = asyncHandler(async () => {
        const apiFeatures = new ApiFeatures(userModel.find({role:"caregiver"})
            .populate([{path: "caregiverProperties"}]),{})
            .filter()
            .sort()
            // .paginate()
            .searchByQuery()
            .limitFields()
        return await apiFeatures.query;

        // return await userModel.find({role:"caregiver"}).populate([{path: "caregiverProperties"}]);
    });


}

export default CaregiverService;