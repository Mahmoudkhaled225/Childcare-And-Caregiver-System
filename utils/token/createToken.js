import jwt from "jsonwebtoken";

export const createToken = (payload = {}) => {
    (!Object.keys(payload).length) && false;
    return jwt.sign(payload, process.env.TOKEN_SIGNATURE,
        {expiresIn: process.env.TOKEN_EXPIRE} );
};
