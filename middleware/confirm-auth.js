const jwt = require('jsonwebtoken');
const {
  PORT,
  JWT_SECRET,
  MONGODB_URI
} = require('../config');

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization
    const decodedToken = jwt.verify(token, JWT_SECRET)
    req.decodedToken = decodedToken
    req.userId = decodedToken.userId
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