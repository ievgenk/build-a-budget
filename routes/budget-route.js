const express = require('express');
const router = express.Router();
const {
  User,
  MonthlyBudget,
  Transaction,
  Category,
  Subcategory
} = require('../models/budget');

const autopopulate = require('mongoose-autopopulate');

router.use(express.json());

router.get('/:year/:month', (req, res) => {

  MonthlyBudget.findOne({
      year: parseInt(req.params.year),
      month: parseInt(req.params.month)
    })
    .then(budget => {
      if (!budget) {
        budget = new MonthlyBudget({
            year: parseInt(req.params.year),
            month: parseInt(req.params.month)
          })
          .save()
      }
      return budget;
    })
    .then(budget => {
      res.status(200).json(budget);
    })
})

router.put('/:year/:month', (req, res) => {

  MonthlyBudget.findOneAndUpdate({
      year: parseInt(req.params.year),
      month: parseInt(req.params.month)
    }, {
      budget: req.body.budget
    }, {
      new: true
    })
    .then(updatedBudget => {
      res.status(200).json(updatedBudget);
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router;