const express = require('express');
const axios = require('axios');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const Promise = require('bluebird');
const expect = chai.expect;
const supertest = require('supertest');

chai.use(sinonChai);

describe('Case Controller Tests', () => {

  describe('findByContactId Success Tests', () => {
    let axiosGetStub;
    let axiosGetSpy;
    let findById;
    let request;
    let app;

    beforeEach(() => {
      axiosGetStub = (url, body, params) => {
        return new Promise((resolve, reject) => {
          resolve({ data: 'TEST CASE DATA'});
        });
      }

      axiosGetSpy = sinon.spy(axiosGetStub);

      findByContactId = proxyquire('../../server/controllers/salesforce/case.js', {
        axios: {
          get: axiosGetSpy
        }
      }).findByContactId;

      app = express();
      request = supertest(app);

      app.get('/test', findByContactId);
    });

    it('Should make an axios GET request', (done) => {
      request.get('/test').query({ id: 0000000}).end((err, res) => {
        expect(axiosGetSpy).to.have.been.called;
        done();
      });
    });

    it('Should add an authorization header to the axios GET request', (done) => {
      request.get('/test').query({ id: 0000000}).expect(200, (err, res) => {
        const headers = axiosGetSpy.args[0][1].headers;
        expect(headers).to.have.keys('Authorization');
        done();
      });
    })

    it('Should send the case data in the response', (done) => {
      request.get('/test').query({ id: 0000000}).expect(200, (err, res) => {
        const expectedResponse = 'TEST CASE DATA';
        const actualResponse = res.text;
        expect(actualResponse).to.equal(expectedResponse);
        done();
      });
    })


  });
});