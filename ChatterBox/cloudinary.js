const cloudinary = require('cloudinary').v2;

try {
    cloudinary.config({
        cloud_name: process.env.Cloudinary_Name,
        api_key: process.env.Cloudinary_API_Key,
        api_secret: process.env.Cloudinary_API_Secret   
    });
    console.log("Cloudinary connected successfully");
} catch (err) {
    console.log("Cannot "+err);
}


module.exports = cloudinary;
