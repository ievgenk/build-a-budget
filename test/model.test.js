const chai = require('chai');
const {
  Year,
  Budget
} = require('../models/budget');
const mongoose = require('mongoose')

// VARIABLES

const expect = chai.expect;

describe('save a year', () => {
  beforeEach(() => {
    return mongoose.connect('mongodb://localhost:27017/BuildABudgetTest')
  })
  afterEach(() => {
    mongoose.disconnect();
  })
  it('can be saved', () => {
    return new Year({
        year: 2018
      }).save()
      .then(year =>
        new Budget({
          selectedYear: 2018,
          selectedMonth: 5,
          byYear: [year._id]
        }).save())
      .then(budget => {
        expect(budget.byYear).to.not.equal(undefined);
        expect(budget.byYear.length).to.equal(1);
      })
  })
})