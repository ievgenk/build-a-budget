const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;


// const subcategorySchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//     min: 3,
//     max: 25
//   },
//   budgeted: Number,
//   spent: Number
// })

// let Subcategory = mongoose.model('Subcatregory', subcategorySchema)

// const categoriesSchema = new Schema({
//   name: {
//     type: String
//   },
//   listOfSubCategories: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Subcatregory'
//   }]
// })

// let Category = mongoose.model('Category', categoriesSchema);

// const transactionSchema = new Schema({
//   category: {
//     type: String,
//     required: true,
//     min: 3,
//     max: 25
//   },
//   subCategory: {
//     type: String,
//     required: true,
//     min: 3,
//     max: 45
//   },
//   value: {
//     type: Number,
//     required: true
//   },
//   positive: Boolean,
//   negative: Boolean,
//   description: String
// })

// let Transaction = mongoose.model('Transaction', transactionSchema);

// const monthSchema = new Schema({
//   month: {
//     type: Number,
//     required: true
//   },
//   budget: {
//     type: Number,
//     required: true
//   },
//   transactions: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Transaction'
//   }],
//   categories: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Category'
//   }]
// })


// let Month = mongoose.model('Month', monthSchema);

const yearSchema = new Schema({
  year: {
    type: Number,
    required: true
  }
  // byMonth: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Month'
  // }]
})

let Year = mongoose.model('Year', yearSchema);

const budgetSchema = new Schema({
  selectedYear: {
    type: Number,
    default: moment().year()
  },
  selectedMonth: {
    type: Number,
    default: moment().month()
  },
  byYear: [{
    type: Schema.Types.ObjectId,
    ref: 'Year'
  }]
})

let Budget = mongoose.model('Budget', budgetSchema);

module.exports = {
  Budget,
  Year
}