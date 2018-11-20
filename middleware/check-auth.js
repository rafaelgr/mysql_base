const Jwt = require('jsonwebtoken');
const Dotenv = require('dotenv');

module.exports = (req, res, next) => {
    Dotenv.config();
    if (!req.headers.authorization) return next({ status: 400, message: 'Auth failed no token present' });
    let token = req.headers.authorization.split(' ')[1];
    try {
        let decode = Jwt.verify(token, process.env.BASE_JWT_KEY);
        next();
    } catch (error) {
        next({ status: 401, message: `Auth failed` });
    }
};
