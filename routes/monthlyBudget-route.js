const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
  checkAuth
} = require('../middleware/confirm-auth');

router.use(express.json());

const {
  User,
  Transaction,
  Category,
  Subcategory,
  Month
} = require('../models/budget');


router.get('/:month', checkAuth, (req, res) => {
  Month.findOne({
      month: req.params.month,
      user: req.userId
    })
    .then(existingMonth => {
      if (!existingMonth) {
        existingMonth = new Month({
            month: parseInt(req.params.month),
            user: req.userId
          })
          .save()
      }
      return existingMonth;
    })
    .then(existingMonth => {
      res.status(200).send(existingMonth)
    })
    .catch(err => {
      res.status(500).send(err)
    })

})


router.put('/:month', checkAuth, (req, res) => {

  Month.findOneAndUpdate({
      month: parseInt(req.params.month),
      user: req.userId
    }, {
      budget: req.body.budget
    }, {
      new: true
    })
    .then(updatedBudget => {
      res.status(200).json(updatedBudget);
    })
    .catch(error => {
      res.status(500).send(error)
    })

})

router.put('/', checkAuth, (req, res) => {

  Month.findOneAndUpdate({
      _id: req.body.monthId,
      user: req.userId
    }, {
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
    .catch(error => {
      res.status(500).send(error)
    })
})





module.exports = router;