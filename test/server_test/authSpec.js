const express = require('express');
const axios = require('axios');
const sinon = require('sinon');
const supertest = require('supertest');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const Promise = require('bluebird');
const expect = chai.expect;

chai.use(sinonChai);

describe('Saleforce Auth Controller Tests', () => {

  describe('Success Tests', () => {
    const testMiddleWare = require('../test_helpers/testMiddleWare.js');
    let axiosPostStub;
    let getToken;
    let nextStub;
    let nextSpy;
    let mockRequest;
    let mockResponse;
    let axiosPostErrStub;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {send: sinon.spy()};

      axiosPostStub = (url, body, params) => {
            return new Promise((resolve, reject) => {
              resolve({data: {access_token: '00DQ000000GKkqu!AQsAQAxMs'}});
            });
          }

      axiosPostSpy = sinon.spy(axiosPostStub);

      nextSpy = sinon.spy();

      getToken = proxyquire('../../server/controllers/salesforce/auth.js', {
        axios: {
          post: axiosPostSpy
        }
      }).getToken;
    });

    it('Should make a POST request with axios to the Salesforce auth server', (done) => {
      getToken(mockRequest, mockResponse, nextSpy);
      expect(axiosPostSpy).to.have.been.calledWith(`https://test.salesforce.com/services/oauth2/token`);
      done();
    });

    it('Should contain all Salesforce auth params', (done) => {
      getToken(mockRequest, mockResponse, nextSpy);
      const params = axiosPostSpy.args[0][2].params;
      expect(params).to.have.keys('grant_type', 'client_id', 'client_secret', 'username', 'password');
      done()
    });

    it(`Should have a grant_type of 'password'`, (done) => {
      getToken(mockRequest, mockResponse, nextSpy);
      const params = axiosPostSpy.args[0][2].params;
      expect(params.grant_type).to.equal('password');
      done()
    });

    it(`Should attach token to next request`, (done) => {
      getToken(mockRequest, mockResponse, nextSpy);
      testMiddleWare(getToken, done, (req, res) => {
        expect(req.access_token).to.equal('00DQ000000GKkqu!AQsAQAxMs');
      })
    });
  })

  describe('Failure Tests', () => {
    const testMiddleWare = require('../test_helpers/testMiddleWare.js');
    let axiosPostStub;
    let getToken;
    let nextStub;
    let nextSpy;
    let mockRequest;
    let mockResponse;
    let axiosPostErrStub;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {send: sinon.spy()};

      axiosPostErrStub = (url, body, params) => {
            return new Promise((resolve, reject) => {
              reject({response: {data: 'TEST ERROR'}});
            });
          }

      axiosPostSpy = sinon.spy(axiosPostErrStub);

      nextSpy = sinon.spy();

      getToken = proxyquire('../../server/controllers/salesforce/auth.js', {
        axios: {
          post: axiosPostSpy
        }
      }).getToken;
    });


    it(`Should send error data`, (done) => {
      testMiddleWare(getToken, done, (req, res) => {
        expect(res.send).to.have.been.called({response: {data: 'TEST ERROR'}})
      })
    });
  })



});