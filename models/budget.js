const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

const userSchema = new Schema({
  email: {
    type: String,
    min: 5,
    max: 20,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 70
  }

})

let User = mongoose.model('User', userSchema);

const subcategorySchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    autopopulate: {
      maxDepth: 2
    }
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
  name: {
    type: String
  },
  listOfSubCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Subcategory',
    autopopulate: {
      maxDepth: 2
    }
  }],
  month: {
    type: Schema.Types.ObjectId,
    ref: 'Month',
    autopopulate: {
      maxDepth: 2
    }
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
    ref: 'Month',
    autopopulate: {
      maxDepth: 2
    }
  }
}).plugin(autopopulate)

let Transaction = mongoose.model('Transaction', transactionSchema);


const MonthSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: {
      maxDepth: 2
    }
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
    autopopulate: {
      maxDepth: 2
    }
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    autopopulate: {
      maxDepth: 2
    }
  }]
}).plugin(autopopulate)

let Month = mongoose.model('Month', MonthSchema);






module.exports = {
  User,
  Transaction,
  Category,
  Subcategory,
  Month
}