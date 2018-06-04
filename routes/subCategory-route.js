const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const validator = require('validator');

router.use(express.json());

const {
  User,
  Transaction,
  Category,
  Subcategory,
  Month
} = require('../models/budget');


router.post('/', (req, res) => {

  if (validator.isLength(req.body.title, {
      min: 1,
      max: 35
    }) === false) {
    res.status(400).json({
      message: 'Subcategory name should have atleast 1 character and maximum 35'
    })
  }

  new Subcategory({
      category: req.body.category,
      title: req.body.title
    })
    .save()
    .then(subCategory => {
      let category = Category.findByIdAndUpdate(req.body.category, {
        $push: {
          listOfSubCategories: subCategory
        }
      }).then(categoryFound => {
        res.status(200).json(subCategory);
      });
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

router.delete('/:id', (req, res) => {
  Subcategory.findOneAndRemove({
      _id: req.params.id
    })
    .then(result => {
      Month.findByIdAndUpdate(req.body.monthID, {
          $inc: {
            budget: req.body.budgeted
          }
        })
        .then(() => {
          res.status(202).end();
        })
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

module.exports = router;