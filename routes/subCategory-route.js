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


router.post('/', (req, res) => {
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
    .catch(err => {
      console.log(err);
    })
})

router.delete('/:id', (req, res) => {
  Subcategory.findOneAndRemove({
      _id: req.params.id
    })
    .then(result => {
      res.status(202).end();
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router;