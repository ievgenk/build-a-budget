//MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  app
} = require('../server');
const mongoose = require('mongoose')
// VARIABLES

const expect = chai.expect;
chai.use(chaiHttp);

//TESTS




describe('REST API ENDPOITNS', function () {

  before(() => {
    return mongoose.connect('mongodb://localhost:27017/BuildABudgetTest')
  })
  after(() => {
    //mongoose.connection.db.dropCollection('categories');
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
        })
        .catch(err => {
          console.log(err)
        })
    })


    it('Should create a new category', function () {
      return chai.request(app)
        .post('/api/categories')
        .send({
          'categoryName': 'anotherTest'
        })
        .then(result => {
          expect(result).to.have.status(200);
          expect(result).to.be.json;
          expect(result.body.name).to.equal('anotherTest');
        })
        .catch(err => console.log(err))
    })

  })


  describe('BUDGET ROUTE ENDPOINTS', function () {

    it('SHOULD CREATE / RETRIEVE A BUDGET FOR A PARTICULAR YEAR AND MONTH', function () {
      return chai.request(app)
        .get('api/budget/2018/5')
        .then(monthlyBudget => {

          expect(monthlyBudget).to.have.status(200);
          expect(monthlyBudget).to.be.json;
        })
    })

  })


})