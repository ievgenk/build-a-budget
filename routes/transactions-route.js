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

  new Transaction({
      category: req.body.category,
      subCategory: req.body.subCategory,
      value: req.body.value,
      description: req.body.description,
      month: req.body.monthId
    })
    .save()
    .then(transaction => {
      Month.findByIdAndUpdate(req.body.monthId, {
          $push: {
            transactions: transaction
          }
        })
        .then(() => {
          Subcategory.findByIdAndUpdate(req.body.subCategoryId, {
              $inc: {
                budgeted: req.body.value,
                spent: (req.body.value) * -1
              }
            })
            .then(() => {
              res.status(200).json(transaction)
            })
        })
    })
    .catch(err => {
      throw new Error(err)
    })
})



module.exports = router;