import userModel from "../DB/models/userModel.js";
import AppError from "../utils/ErrorHandling/AppError.js";
import asyncHandler from "../utils/ErrorHandling/asyncHandler.js";



class UserService {
    constructor(userModel) {
        this.userModel = userModel;

    }

    createUser = asyncHandler(async (userData) => {
        const user = new this.userModel(userData);
        await user.save();
        return user;
    });

    setCaregiverProperties = asyncHandler(async (id, caregiverPropertiesId) => {
        // check.caregiverProperties = caregiverPropertiesId;
        // await check.save();
        // return check;
        const user = await this.userModel.findByIdAndUpdate(id,
            {caregiverProperties: caregiverPropertiesId},
            {new: true});
        if (!user) {
            throw new AppError(`User with ID ${id} is not caregiver so cant set those properties`, 404);
        }
        return user;
    });

    getUserByEmail = asyncHandler(async (email) =>{
        return  await this.userModel.findOne({ email });
    });

    getDeactivatedUser = asyncHandler(async (email,) =>{
        return await this.userModel.findOne({ email,isDeleted: true });
    });

    getUserById = asyncHandler(async (id) => {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }
        return user;
    });

    updateUserById = asyncHandler(async (id, userData) => {
        const user = await this.userModel.findByIdAndUpdate(id, userData, { new: true });
        if (!user)
            throw new AppError(`User with ID ${id} is not found`, 404);
        return user;
    });

    updateUser= asyncHandler(async (id,obj) =>{
        const user = await this.userModel.updateOne({ _id: id }, obj);
        return user.modifiedCount > 0;
    });


    deleteUser = asyncHandler(async (id) => {
        const user = await this.userModel.findByIdAndDelete(id);
        if (!user) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }
        return user;
    });

    getUser = asyncHandler(async (queryParams) => {
        return await this.userModel.findOne({...queryParams});
    });

    getAllUsers = asyncHandler(async () => {
        return await this.userModel.find({});
    });

    isCaregiver = asyncHandler(async (id) => {
        const check = await userModel.findOne({_id:id, role:"caregiver"});
        if (!check) {
            throw new AppError(`you are not a Caregiver service , Caregiver with ID ${id} is not found`, 404);
        }
        return check;
    });
}

export default UserService;