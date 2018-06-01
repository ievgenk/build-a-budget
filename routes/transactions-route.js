const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.use(express.json());

const {
  User,
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

router.delete('/:id', (req, res) => {
  Transaction.findOneAndRemove({
      _id: req.params.id
    })
    .then((found) => {
      if (!found) {
        throw new Error('ID not found')
      }
      return Month.findByIdAndUpdate(req.body.monthID, {
        $pull: {
          transactions: mongoose.Types.ObjectId(req.params.id)
        }
      })
    })
    .then(() => {
      if (req.body.subCategory !== undefined) {
        Subcategory.findByIdAndUpdate(req.body.subCategory, {
            $inc: {
              budgeted: -req.body.value,
              spent: req.body.value
            }
          })
          .then((result) => {
            res.status(202).end();
          })
      } else if (req.body.subCategory === undefined) {
        Month.findByIdAndUpdate(req.body.monthID, {
            $inc: {
              budget: -req.body.value
            }
          })
          .then((result) => {
            res.status(202).end();
          })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
})



module.exports = router;