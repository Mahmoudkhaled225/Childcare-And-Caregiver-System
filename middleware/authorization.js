import appError from "../utils/ErrorHandling/AppError.js";

/**
 * authorization middleware for verifying user access roles
 * @returns {Function} The authorization middleware function
 */

const authorization = (accessRoles) => {
    return (req, res, next) => {
        if (accessRoles.includes(req.user.role))
            next()
        else
            throw new appError('Forbidden', 403)
    };
};

export default authorization;