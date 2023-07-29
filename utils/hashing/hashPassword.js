// import bcrypt from "bcryptjs";
//
// class BcryptJS {
//     constructor() {
//         this.saltRounds = +process.env.SALT_ROUNDS || 10; // default to 10 if SALT_ROUNDS is not set
//     }
//
//     hashPassword(password) {
//         return bcrypt.hashSync(password, this.saltRounds);
//     }
// }
//
// export default BcryptJS;


import bcrypt from "bcryptjs";

export const hashPassword = (pass,saltRound=+process.env.SALT_ROUNDS) => {
    return bcrypt.hashSync(pass, saltRound);
};
