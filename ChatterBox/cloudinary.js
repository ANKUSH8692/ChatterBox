const cloudinary = require('cloudinary').v2;

try {
    cloudinary.config({
        cloud_name: 'dnflur8ec',
        api_key: '956926461534744',
        api_secret: 'cw2-DEDVTZD8x80WM0cLCJnbP-o'
    });
    console.log("Cloudinary connected successfully");
} catch (err) {
    console.log("Cannot "+err);
}


module.exports = cloudinary;
