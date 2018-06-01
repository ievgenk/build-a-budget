const jwt = require('jsonwebtoken');
const {
  secretJWT
} = require('../config');

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization
    const decodedToken = jwt.verify(token, secretJWT)
    req.decodedToken = decodedToken
    req.userId = decodedToken.userId
    console.log(decodedToken)
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      message: "Auth failed"
    })
  }
}


module.exports = {
  checkAuth
}