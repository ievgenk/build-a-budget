const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.use(express.json());

const {
  User,
  MonthlyBudget,
  Transaction,
  Category,
  Subcategory,
  Month
} = require('../models/budget');

router.post('/', (req, res) => {

})



module.exports = router;