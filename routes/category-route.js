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

router.get('/', (req, res) => {
  Category.find({})
    .then(categories => {
      res.status(200).json(categories);
    })
    .catch(err => {
      console.log(err)
    })
});

router.post('/', (req, res) => {
  let categoryName = req.body.categoryName;
  let monthId = req.body.monthId;
  new Category({
      name: categoryName,
      month: monthId
    })
    .save()
    .then(category => {
      let chosenMonth = Month.findByIdAndUpdate(req.body.monthId, {
          $push: {
            categories: category
          }
        })
        .then(month => {
          res.status(200).json(month)
        })
    })
    .catch(err => {
      res.status(err.status || 500).json(err)
    })
})


router.delete('/:id', (req, res) => {
  Category.findOneAndRemove({
      _id: req.params.id
    })
    .then(result => {
      Month.findByIdAndUpdate(req.body.monthId, {
          $inc: {
            budget: req.body.value
          }
        })
        .then(() => {
          Subcategory.deleteMany({
              _id: {
                $in: req.body.subCatArr
              }
            })
            .then(() => {
              res.status(202).end();
            })
        })
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router;