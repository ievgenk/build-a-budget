const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
  checkAuth
} = require('../middleware/confirm-auth');
const validator = require('validator');
router.use(express.json());

const {
  User,
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
    .catch(error => {
      res.status(500).send(error)
    })
});

router.post('/', (req, res) => {

  if (validator.isAlphanumeric(req.body.categoryName) || validator.isLength(req.body.categoryName, {
      min: 1,
      max: 35
    }) === false) {
    res.status(400).json({
      message: 'Category name should have atleast 1 character and maximum 35'
    })
  }

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
        .exec()
        .then(month => {
          res.status(200).json(month)
        })
    })
    .catch(error => {
      res.status(500).send(error)
    })
})


router.delete('/:id', (req, res) => {
  Category.findOneAndRemove({
      _id: req.params.id
    })
    .then(result => {
      return Month.findByIdAndUpdate(req.body.monthId, {
          $pull: {
            categories: mongoose.Types.ObjectId(req.params.id)
          },
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
    .catch(error => {
      res.status(500).send(error)
    })
})

module.exports = router;