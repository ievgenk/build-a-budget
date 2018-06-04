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

    it('Should return categories JSON', function () {
      return chai.request(app)
        .get('/api/categories')
        .then(result => {
          expect(result).to.have.status(200);
          expect(result).to.be.json;
          expect(result.body).to.be.a('array');
        })
        .catch(err => {
          // console.log(err)
        })
    })

    let testCategory;

    it('Should create a new category', async function () {
      let month = await new Month({
          month: 7
        })
        .save()
      return chai.request(app)
        .post('/api/categories')
        .send({
          'categoryName': 'anotherTest',
          'monthId': month._id
        })
        .then(result => {
          testCategory = result.body
          expect(result).to.have.status(200);
          expect(result).to.be.json;
          expect(mongoose.Types.ObjectId(result.body._id)).to.deep.equal(mongoose.Types.ObjectId(month._id));
          expect(result.body.month).to.equal(month.month)
        })
      // .catch(err => console.log(err))
    })

    it('Should delete an existing category', async function () {
      console.log(mongoose.connection.db)
      let month = await new Month({
          month: 8
        })
        .save()
      let category = await new Category({
          month: mongoose.Types.ObjectId(month._id),
          name: 'Delete Test Category'
        })
        .save()

      return chai.request(app)
        .delete(`/api/categories/${category._id}`)
        .then(result => {
          expect(result).to.have.status(202)
        })
      // .catch(err => console.log(err))
    })

  })

  describe('MONTLY-BUDGET ROUTE ENDPOINTS', function () {

    it('GET MONTLY BUDGET', async function () {
      console.log(token)
      let monthlyBudget = await chai.request(app)
        .get('/api/monthlyBudget/1')
        .set('authorization', token)
      expect(monthlyBudget).to.have.status(200);
      expect(monthlyBudget.body).to.have.keys('month', 'budget', 'transactions', 'categories')
    })
  })

})