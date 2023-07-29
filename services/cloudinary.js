import cloudinary from 'cloudinary';

cloudinary.v2.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.api_key,
   api_secret: process.env.api_secret,
   secure: true,
});
export default cloudinary.v2;