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


router.get('/:month', (req, res) => {
  Month.findOne({
      month: req.params.month
    })
    .then(month => {
      if (!month) {
        month = new Month({
            month: parseInt(req.params.month)
          })
          .save()
      }
      return month;
    })
    .then(month => {
      res.status(200).json(month);
    })
    .catch(error => {
      console.log(error)
    })
})


router.put('/:month', (req, res) => {

  Month.findOneAndUpdate({
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

router.put('/', (req, res) => {

  Month.findByIdAndUpdate(req.body.monthId, {
      $inc: {
        budget: -(req.body.value)
      }
    })
    .then(() => {
      Subcategory.findByIdAndUpdate(req.body.subCategoryId, {
          $inc: {
            budgeted: req.body.value
          }
        })
        .then(() => {
          res.status(204).end()
        })
    })
    .catch(err => console.log(err))

})





module.exports = router;