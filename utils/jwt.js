const jwt = require('jsonwebtoken');

const sign = function(user) {
    const { id, name, email } = user;
    return jwt.sign({ id, name, email }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
        algorithm: 'HS256'
    })
}

const verify = function(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

const Jwt = {
    sign, verify
}

module.exports = Jwt;