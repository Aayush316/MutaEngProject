const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ success: false, message: "User not logged in" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Token is not valid" });
        }
        req.user = user; 
        next(); 
    });
};
