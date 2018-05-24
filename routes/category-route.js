const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.use(express.json());

const {
  User,
  MonthlyBudget,
  Transaction,
  Category,
  Subcategory
} = require('../models/budget');

router.get('/', (req, res) => {
  Category.find({})
    .then(categories => {
      res.status(200).json(categories);
    })
});

router.post('/', (req, res) => {
  let categoryName = req.body.categoryName;
  new Category({
      name: categoryName
    })
    .save()
    .then(category => {
      res.status(200).json(category)
    })
    .catch(err => {
      res.status(err.status || 500).json(err)
    })
})

module.exports = router;