const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: "Authorization header missing",
            success: false
        });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: "Bearer token missing",
            success: false
        });
    }

    try {
        const decoded_Token = jwt.verify(token,process.env.secret_key);
        req.user = { id: decoded_Token.userId };

        next();
    } catch (err) {
        res.status(401).json({
            message: err,
            success: false
        });
    }
};
