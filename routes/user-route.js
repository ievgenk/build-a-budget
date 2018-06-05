const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');


router.use(express.json());

const {
  User,
  Transaction,
  Category,
  Subcategory,
  Month
} = require('../models/budget');


router.post('/signup', (req, res) => {

  let validEmail = validator.isEmail(req.body.email);

  if (!validEmail) {
    return res.status(500).json({
      message: "This is an Invalid Email"
    })
  }

  User.findOne({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: 'This email already exists'
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            })
          } else {
            new User({
                email: req.body.email,
                password: hash
              })
              .save()
              .then(newUser => {
                res.status(201).json({
                  message: 'User Created'
                })
              })
              .catch(error => {
                res.status(500).send(error)
              })

          }
        })
      }
    })
})

router.post('/login', (req, res) => {
  User.findOne({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth Failed'
        })
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth Failed'
          })
        }
        if (result) {
          const token = jwt.sign({
              email: user.email,
              userId: user._id
            },
            process.env.JWT_SECRET, {
              expiresIn: "1h"
            }
          )
          return res.status(200).json({
            redirect: '/app-ui.html',
            token,
            user: user._id
          })



        }
        return res.status(401).json({
          message: 'Auth Failed'
        })
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error)
    })
})


router.delete('/:userId', (req, res) => {
  User.findByIdAndRemove(req.params.userId)
    .exec()
    .then(result => {
      res.status(202).json({
        message: "User Deleted"
      })
    })
    .catch(error => {
      res.status(500).send(error)
    })
})




module.exports = router;