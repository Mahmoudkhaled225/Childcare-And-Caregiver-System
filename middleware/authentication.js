import AppError from "../utils/ErrorHandling/AppError.js";
import userModel from "../DB/models/userModel.js";
import {decodedToken} from "../utils/token/decodedToken.js";
import UserService from "../user/userService.js";
import asyncHandler from "../utils/ErrorHandling/asyncHandler.js";

class Authentication {
    constructor() {
        this.userService = new UserService(userModel);
    }

    /**
     * Get the authentication middleware function
     * @returns {Function} The authentication middleware function
     */
    middleware() {
        return asyncHandler(async (req, res, next) => {
            const { token } = req.headers;
            if (!token) {
                throw new AppError("Please enter your token", 400);
            }
            const decoded = decodedToken(token);
            if (!decoded || !decoded.id) {
                throw new AppError("Invalid token", 400);
            }
            const user = await this.userService.getUserById(decoded.id);
            if (!user) {
                throw new AppError("Not authorized", 400);
            }
            req.user = user;
            next();
        });
    }
}

export default Authentication;

// const userService = new UserService(userModel);
//
// const authentication = () => {
//     return async (req, res, next) => {
//         const { token } = req.headers;
//         if(!token)
//             throw new AppError("please enter your token" , 400);
//         const decode = decodedToken(token);
//         if(!decode || !decode.id)
//             throw new AppError("in-valid token" , 400);
//         const user = await userService.getUserById(decode.id);
//         if(!user)
//             throw new AppError("not authorized" , 400);
//         req.user = user;
//         next();
//     };
// };
// export default authentication;
