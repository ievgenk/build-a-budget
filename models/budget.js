const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

const userSchema = new Schema({
  userName: {
    type: String,
    min: 5,
    max: 20
  }
})

let User = mongoose.model('User', userSchema);

const subcategorySchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    autopopulate: true
  },
  title: {
    type: String,
    required: true,
    min: 3,
    max: 25
  },
  budgeted: Number,
  spent: Number
})


let Subcategory = mongoose.model('Subcategory', subcategorySchema)


const categoriesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  name: {
    type: String
  },
  listOfSubCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Subcategory',
    autopopulate: true
  }]
}).plugin(autopopulate)

categoriesSchema.index({
  user: 1,
  name: 1
}, {
  unique: true
})

let Category = mongoose.model('Category', categoriesSchema);

const transactionSchema = new Schema({
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Subcategory',
    autopopulate: true
  },
  value: {
    type: Number,
    required: true
  },
  positive: Boolean,
  negative: Boolean,
  description: String,
  monthlyBudget: {
    type: Schema.Types.ObjectId,
    ref: 'MonthlyBudget',
    autopopulate: true
  }
})



let Transaction = mongoose.model('Transaction', transactionSchema);

const monthlyBudgetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    default: 0
  },
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
    autopopulate: true
  }],
  allTransactionsCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    autopopulate: true
  }]
}).plugin(autopopulate)


let MonthlyBudget = mongoose.model('MonthlyBudget', monthlyBudgetSchema);






module.exports = {
  User,
  MonthlyBudget,
  Transaction,
  Category,
  Subcategory
}