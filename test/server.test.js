//MODULES
const chai = require('chai');
const chaid = require('chaid');
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
chai.use(chaid);
chai.use(chaiHttp);

//TESTS







describe('USER ENDPOINTS', function () {


  before(async function () {
    await mongoose.connect('mongodb://localhost:27017/build-a-budge-test')
  })


  after(async function () {
    await mongoose.connection.db.dropCollection('users')
    mongoose.disconnect();
  })

  it('SHOULD REGISTER A NEW USER', async function () {

    let registeredUser = await chai.request(app)
      .post('/api/user/signup')
      .send({
        email: 'amazing@email.com',
        password: 'supersecure'
      })
    expect(registeredUser).to.have.status(201)
    expect(registeredUser.body.message).to.equal('User Created')

  })

  it('SHOULD FAIL TO REGISTER A NEW USER DUE TO INVALID EMAIL', async function () {

    let registeredUser = await chai.request(app)
      .post('/api/user/signup')
      .send({
        email: 'invalidemail',
        password: 'supersecure'
      })
    expect(registeredUser).to.have.status(500)
    expect(registeredUser.body.message).to.equal('This is an Invalid Email')

  })

  it('SHOULD FAIL TO REGISTER A NEW USER BECAUE IT ALREADY EXISTS', async function () {

    let registeredUser = await chai.request(app)
      .post('/api/user/signup')
      .send({
        email: 'amazing@email.com',
        password: 'supersecure'
      })
    expect(registeredUser).to.have.status(409)
    expect(registeredUser.body.message).to.equal('This email already exists')

  })

  it('SHOULD FAIL TO REGISTER A NEW USER', async function () {

    let registeredUser = await chai.request(app)
      .post('/api/user/signup')
    expect(registeredUser).to.have.status(500)

  })

  it('SHOULD LOGIN A USER SUCCESFULLY', async function () {
    let logUser = await chai.request(app)
      .post('/api/user/login')
      .send({
        email: 'amazing@email.com',
        password: 'supersecure'
      })
    expect(logUser.body).to.contain.keys('token', 'redirect', 'user')
    expect(logUser).to.have.status(200)
  })

  it('SHOULD FAIL TO LOGIN A USER SUCCESFULLY', async function () {
    let logUser = await chai.request(app)
      .post('/api/user/login')
      .send({
        email: 'amazing@email.com',
        password: 'notsosecure'
      })
    expect(logUser.body.message).to.equal('Auth Failed')
    expect(logUser).to.have.status(401)
  })

  it('SHOULD DELETE A USER SUCCESFULLY', async function () {

    let existingUser = await User.findOne({
      email: 'amazing@email.com'
    })

    let logUser = await chai.request(app)
      .delete(`/api/user/${existingUser._id}`)

    expect(logUser).to.have.status(202)
    expect(logUser.body.message).to.equal("User Deleted")
  })

  it('SHOULD FAIL TO DELETE A USER SUCCESFULLY', async function () {
    let logUser = await chai.request(app)
      .delete(`/api/user/123`)

    expect(logUser).to.have.status(500)
  })


})




describe('REST API ENDPOITNS', function () {

  let token;
  let month;
  let subCat;
  let cat;
  let subCateg;
  let transac;

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

    subCateg = await new Subcategory({
      category: mongoose.Types.ObjectId(cat._id),
      title: 'Vegetables',
      budgeted: 0,
      spent: 0
    })

    transac = new Transaction({
      category: 'Bills',
      subCategory: 'Internet',
      value: 100,
      month: month._id
    })

  })

  before(async function () {
    await mongoose.connect('mongodb://localhost:27017/build-a-budge-test')

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

    it('SHOULD DELETE AN EXISTING CATEGORY', async function () {

      let category = await chai.request(app)
        .delete(`/api/categories/${cat._id}`)
        .set('authorization', token)
        .send({
          monthId: month._id,
          value: 0
        })

      let deletedCat = await Category.find({
        name: 'Bills'
      })
      expect(deletedCat).to.be.a('array')
      expect(deletedCat).to.have.length(0)
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

    it('SHOULD FAIL TO UPDATE THE BUDGET AMOUNT OF AN EXISTING MONTH, WHEN MONGOOSE FAILS', async function () {
      const oldFindAndUpdate = Month.findOneAndUpdate
      Month.findOneAndUpdate = () => Promise.reject('Deliberate Error')
      try {
        let monthlyBudget = await chai.request(app)
          .put('/api/monthlyBudget/1')
          .set('authorization', token)
          .send({
            budget: 200
          })
        expect(monthlyBudget).to.have.status(500)
      } catch (err) {
        console.log(err)
      } finally {
        Month.findOneAndUpdate = oldFindAndUpdate
      }
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

  describe('SUBCATEGORY ENDPOINTS', function () {

    it('SHOULD CREATE NEW SUBCATEGORY', async function () {
      let subCategory = await chai.request(app)
        .post('/api/subcategories')
        .set('authorization', token)
        .send({
          category: cat._id,
          title: 'Internet Provider'
        })
      expect(subCategory.body).to.contain.keys('budgeted', 'spent', '_id', 'category', 'title')
      expect(subCategory.body.title).to.equal('Internet Provider')
      expect(subCategory).to.have.status(200)
    })

    it('SHOULD FAIL CREATING NEW SUBCATEGORY BECAUSE OF INADEQUATE TITLE LENGTH', async function () {
      let subCategory = await chai.request(app)
        .post('/api/subcategories')
        .set('authorization', token)
        .send({
          category: cat._id,
          title: ''
        })
      expect(subCategory.body.message).to.equal('Subcategory name should have atleast 1 character and maximum 35')
      expect(subCategory).to.have.status(400)
    })

    it('SHOULD FAIL CREATING A NEW SUBCATEGORY', async function () {
      let subCategory = await chai.request(app)
        .post('/api/subcategories')
        .set('authorization', token)
        .send({
          category: cat._id
        })
      expect(subCategory).to.have.status(500)
    })

    it('SHOULD DELETE SPECIFIC SUBCATEGORY', async function () {
      let subCategory = await chai.request(app)
        .delete(`/api/subcategories/${subCateg._id}`)
        .set('authorization', token)
        .send({
          monthID: month._id,
          budgeted: 0
        })

      let deletedSubCat = await Subcategory.find({
        title: 'Vegetables'
      })
      expect(deletedSubCat).to.be.a('array')
      expect(deletedSubCat).to.have.length(0)
      expect(subCategory).to.have.status(202)
    })

    it('SHOULD FAIL DELETING A SUBCATEGORY', async function () {
      let subCategory = await chai.request(app)
        .delete(`/api/subcategories/a`)
        .set('authorization', token)
        .send({
          budget: 0
        })
      expect(subCategory).to.have.status(500)
    })
  })

  describe('TRANSACTIONS ENDPOINTS', function () {

    it('SHOULD CREATE A NEW TRANSACTIONS', async function () {
      let transaction = await chai.request(app)
        .post('/api/transactions')
        .set('authorization', token)
        .send({
          category: cat._id,
          subCategory: subCateg._id,
          value: 10,
          monthId: month._id
        })
      expect(transaction.body).to.contain.keys('_id', 'category', 'subCategory', 'value', 'month')
      expect(transaction.body.value).to.equal(10)
      expect(transaction).to.have.status(200)
    })

    it('SHOULD FAIL TO CREATE A NEW TRANSACTION', async function () {
      let transaction = await chai.request(app)
        .post('/api/transactions')
        .set('authorization', token)
        .send({
          category: cat._id
        })
      expect(transaction).to.have.status(500)
    })

    it('SHOULD FAIL TO DELETE A TRANSACTION', async function () {
      let transaction = await chai.request(app)
        .delete(`/api/transactions/${transac._id}`)
        .set('authorization', token)
        .send({
          monthID: transac.month
        })
      expect(transaction).to.have.status(500)
    })

  })




})