module.exports = {
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET || 'Wolf',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1/buildABudget'
}