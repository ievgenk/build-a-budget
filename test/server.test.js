//MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  app
} = require('../server');

// VARIABLES

const expect = chai.expect;
chai.use(chaiHttp);

//TESTS

describe('REST API ENDPOITNS', function () {
  describe('GET ENDPOINT', function () {

    it('should return status 200 & HTML', function () {
      return chai.request(app)
        .get('/')
        .then(result => {
          expect(result).to.have.status(200);
          expect(result).to.have.property('type', 'text/html');
        })
    })
  })
})