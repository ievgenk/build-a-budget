//MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  app
} = require('../server');
const mongoose = require('mongoose')
const {
  User,
  Transaction,
  Category,
  Subcategory,
  Month
} = require('../models/budget');
// VARIABLES

const expect = chai.expect;
chai.use(chaiHttp);

//TESTS

describe('REST API ENDPOITNS', function () {

  let token;
  let month;
  let subCat;
  let cat;

  beforeEach(async function () {
    let newUser = await chai.request(app)
      .post('/api/user/signup')
      .send({
        email: 'test@testdb.com',
        password: 'testDb'
      })

    const userToken = await chai.request(app)
      .post('/api/user/login')
      .send({
        email: 'test@testdb.com',
        password: 'testDb'
      })
    token = userToken.body.token


    month = await new Month({
      user: mongoose.Types.ObjectId(userToken.body.user),
      month: 1,
      budget: 100
    })

    subCat = await new Subcategory({
      title: 'Superstore',
      budgeted: 0,
      spent: 0
    })

    cat = await new Category({
      name: 'Bills',
      month: mongoose.Types.ObjectId(month._id)
    })

  })

  before(async function () {
    await mongoose.connect('mongodb://localhost:27017/BuildABudgetTest')

  })

  afterEach(async function () {
    try {
      [await mongoose.connection.db.dropCollection('categories'),
        await mongoose.connection.db.dropCollection('months'),
        await mongoose.connection.db.dropCollection('subcategories'),
        await mongoose.connection.db.dropCollection('transactions'),
        await mongoose.connection.db.dropCollection('users')
      ]
    } catch (err) {

    }
  })

  after(async function () {
    mongoose.disconnect();
  })


  describe('GET ENDPOINT FOR HOME PAGE LOADING', function () {

    it('should return status 200 & HTML', function () {
      return chai.request(app)
        .get('/')
        .then(result => {
          expect(result).to.have.status(200);
          expect(result).to.have.property('type', 'text/html');
        })
        .catch(err => {
          console.log(err)
        })
    })
  })

  describe('CATEGORY ROUTE ENDPOINTS', function () {

    it('Should create a new category', async function () {
      let category = await chai.request(app)
        .post('/api/categories')
        .set('authorization', token)
        .send({
          categoryName: 'Groceries',
          monthId: month._id
        })

      let findCategory = await Category.findOne({
        name: "Groceries"
      })
      expect(findCategory.name).to.equal('Groceries')
      expect(category).to.have.status(200)
    })

    it('SHOULD NOT CREATE A NEW CATEGORY DUE TO ABSENSE OF VALID CATEGORY NAME', async function () {
      let category = await chai.request(app)
        .post('/api/categories')
        .set('authorization', token)
        .send({
          categoryName: '',
          monthId: month._id
        })
      expect(category.body.message).to.equal('Category name should have atleast 1 character and maximum 35')
      expect(category).to.have.status(400)
    })

    it('SHOULD NOT CREATE A NEW CATEGORY DUE TO ABSENSE OF A CATEGORY NAME', async function () {
      let category = await chai.request(app)
        .post('/api/categories')
        .set('authorization', token)
        .send({
          monthId: month._id
        })
      expect(category).to.have.status(500)
    })

    it('Should delete an existing category', async function () {

      let category = await chai.request(app)
        .delete(`/api/categories/${cat._id}`)

      let deletedCat = await Category.find({
        name: 'Bills'
      })

      expect(category).to.have.status(202)
    })

  })

  describe('MONTLY-BUDGET ROUTE ENDPOINTS', function () {

    it('SHOULD GET MONTLY BUDGET', async function () {
      let monthlyBudget = await chai.request(app)
        .get('/api/monthlyBudget/1')
        .set('authorization', token)
      expect(monthlyBudget).to.have.status(200);
      expect(monthlyBudget.body).to.contain.keys('month', 'budget', 'transactions', 'categories')
    })

    it('SHOULD FAIL TO GET MONTHLY BUDGET', async function () {
      try {
        let monthlyBudget = await chai.request(app)
          .get('/api/monthlyBudget/a')
          .set('authorization', token)
        expect(monthlyBudget).to.have.status(500)
      } catch (err) {
        console.log(err)
      }
    })

    it('SHOULD FAIL TO MODIFY EXISTING MONTH\'S BUDGET DUE TO SENDING NOT A NUMBER', async function () {
      try {
        let monthlyBudget = await chai.request(app)
          .put('/api/monthlyBudget/1')
          .set('authorization', token)
          .send({
            budget: 'not a number'
          })
        expect(monthlyBudget).to.have.status(400)
        expect(monthlyBudget.body.message).to.equal('Please only input numbers')
      } catch (err) {
        console.log(err)
      }
    })

    it('SHOULD UPDATE THE BUDGET AMOUNT OF AN EXISTING MONTH', async function () {
      let monthlyBudget = await chai.request(app)
        .put('/api/monthlyBudget/1')
        .set('authorization', token)
        .send({
          budget: 200
        })
      expect(monthlyBudget).to.have.status(200)
      expect(monthlyBudget.body.month).to.equal(1)
      expect(monthlyBudget.body.budget).to.equal(200)
    })

    it('SHOULD DEDUCT PROVIDED AMOUNT FROM MONTLY BUDGET AND MOVE IT TO SELECTED SUBCATEGORY', async function () {
      let monthlyBudget = await chai.request(app)
        .put('/api/monthlyBudget')
        .set('authorization', token)
        .send({
          monthId: month._id,
          value: 10,
          subCategoryId: subCat._id
        })
      expect(monthlyBudget).to.have.status(204)
    })

    it('SHOULD FAIL TO DEDUCT PROVIDED AMOUNT FROM MONTLY BUDGET AND MOVE IT TO SELECTED SUBCATEGORY', async function () {
      let monthlyBudget = await chai.request(app)
        .put('/api/monthlyBudget')
        .set('authorization', token)
      expect(monthlyBudget).to.have.status(500)
    })


  })
})