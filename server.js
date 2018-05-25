// Modules
const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config');
const mongoose = require('mongoose');
const {
  User,
  MonthlyBudget,
  Transaction,
  Category,
  Subcategory
} = require('./models/budget');
const autopopulate = require('mongoose-autopopulate');

//ROUTES

const categoryRoute = require('./routes/category-route');
const budgetRoute = require('./routes/budget-route');
const subCategoryRoute = require('./routes/subCategory-route');

// DataBase Connection
mongoose.connect('mongodb://localhost:27017/BuildABudget')
  .then(() => {
    console.log('Connected to DB sucesfully');
  })
  .catch((err) => {
    console.error(err);
  })



// Middleware

app.use(express.static('public'));
app.use(cors());
app.use('/api/categories', categoryRoute);
app.use('/api/budget', budgetRoute);
app.use('/api/subcategories', subCategoryRoute);


// Server Funcationality



app.use((err, req, res, next) => {
  res.status(err.status || 500).json(err).end();
})

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`)
})


module.exports = {
  app
}