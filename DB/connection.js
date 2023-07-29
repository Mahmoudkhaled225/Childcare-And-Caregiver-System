import mongoose from 'mongoose';
import logger from "../utils/logger/logger.js";

const connectionDB = async () => {
    return await mongoose
        .connect(process.env.DATABASE)
        .then(() => logger.info("DB connection successful!"))
        .catch((err) => logger.error(err));
};

mongoose.set("strictQuery", true);
export default connectionDB;