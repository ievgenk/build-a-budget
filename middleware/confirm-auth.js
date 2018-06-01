const jwt = require('jsonwebtoken');
const {
  secretJWT
} = require('../config');

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretJWT)
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed"
    })
  }
}


module.exports = {
  checkAuth
}