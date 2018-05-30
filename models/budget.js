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
  budgeted: {
    type: Number,
    default: 0
  },
  spent: {
    type: Number,
    default: 0
  }
}).plugin(autopopulate)



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
  }],
  month: {
    type: Schema.Types.ObjectId,
    ref: 'Month',
    autopopulate: true
  }
}).plugin(autopopulate)


let Category = mongoose.model('Category', categoriesSchema);

const transactionSchema = new Schema({
  category: {
    type: String
  },
  subCategory: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  description: String,
  month: {
    type: Schema.Types.ObjectId,
    ref: 'Month'
  }
}).plugin(autopopulate)

let Transaction = mongoose.model('Transaction', transactionSchema);


const MonthSchema = new Schema({
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
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    autopopulate: true
  }]
}).plugin(autopopulate)

let Month = mongoose.model('Month', MonthSchema);


const monthlyBudgetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  month: {
    type: Schema.Types.ObjectId,
    ref: 'Month'
  }
}).plugin(autopopulate)


let MonthlyBudget = mongoose.model('MonthlyBudget', monthlyBudgetSchema);






module.exports = {
  User,
  MonthlyBudget,
  Transaction,
  Category,
  Subcategory,
  Month
}