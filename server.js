// Modules
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const {
  User,
  MonthlyBudget,
  Transaction,
  Category,
  Subcategory,
  Month
} = require('./models/budget');
const autopopulate = require('mongoose-autopopulate');

//ROUTES
const userRoute = require('./routes/user-route');
const categoryRoute = require('./routes/category-route');
const subCategoryRoute = require('./routes/subCategory-route');
const transactionsRoute = require('./routes/transactions-route');
const monthlyBudgetRoute = require('./routes/monthlyBudget-route');

// DataBase Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to DB sucesfully');
  })
  .catch((err) => {
    console.error(err);
  })



// Middleware

app.use(express.static('public'));
app.use(cors());
app.use(express.json())
app.use('/api/user', userRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/subcategories', subCategoryRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/monthlyBudget', monthlyBudgetRoute);


// Server Funcationality



app.use((err, req, res, next) => {
  res.status(err.status || 500).json(err).end();
})

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})


module.exports = {
  app
}