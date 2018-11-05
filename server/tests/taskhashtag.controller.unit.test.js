const httpMocks = require('node-mocks-http');
const taskhashtag_controller = require('../controllers/taskhashtag.controller');
var mongoose = require('mongoose');
const test_util = require('../utils/test.util');

describe('Task Hash Tag Controller', () => {
    beforeAll(() => {
        test_util.setup(mongoose);
    });

    afterAll(() => {
        test_util.cleanUp(mongoose);
    });

    describe('Create Task Hash Tag', () => {
        test('with required parameters should return created hash tag, status 200', () => {

            var body = {
                name :'ポケモン',
                description : 'ポケモンに対する情報と攻略方法'
            };

            const request = test_util.createHttpMockRequest(body, {}, 'POST');

            const response = httpMocks.createResponse();
            
            return taskhashtag_controller.taskhashtag_create(request, response).then(() =>{
                const responseData = response._getData();
                expect(response.statusCode).toBe(200);
                expect(responseData.tag.name).toBe('ポケモン');
                expect(responseData.tag.description).toBe('ポケモンに対する情報と攻略方法');
            });
        });

        //conflict
        test('with a duplicate name should return status 400', () => {
            var body = {
                name :'ポケモン',
                description : 'ポケモンに対する情報と攻略方法'
            };

            const request = test_util.createHttpMockRequest(body, {}, 'POST');

            const response = httpMocks.createResponse();
            
            return taskhashtag_controller.taskhashtag_create(request, response).then(() =>{
                const responseData = response._getData();
                expect(response.statusCode).toBe(400);
            });
        });

        //bad request
        test('without all required parameters should return status 400', () => {
            var body = {
                name :'アニメ'
            };
            
            const request = test_util.createHttpMockRequest(body, {}, 'POST');
            
            const response = httpMocks.createResponse();
            
            return taskhashtag_controller.taskhashtag_create(request, response).then(() =>{
                const responseData = response._getData();
                expect(response.statusCode).toBe(400);
            });
        });

        describe('Retrieve All Task Hash Tags', () =>{

            test('should return array of tags with status 200', () =>{
    
                const request = test_util.createHttpMockRequest({}, {}, 'GET');
        
                const response = httpMocks.createResponse();
        
                return taskhashtag_controller.taskhashtags_details(request, response).then(() =>{
                    const responseData = response._getData();
                    //_getData is already formed as an object here.
                    expect(response.statusCode).toBe(200);
                    expect(responseData.tags.length).toBeGreaterThanOrEqual(1);
                });
            });
        });

        describe('Retrieve Task Hash Tag by Specific Name', () => {
            xtest('valid tag name should return gig with status 200', () => {

            });

            xtest('invalid tag name should return status 400', () => {

            });
        });

        describe('Retrieve Task Hash Tags by Prefix', () =>{
            xtest('valid prefix should return array of tags with status 200', () => {

            });

            xtest('prefix with no relevance should return empty array of tags with status 200', () => {

            });
        });
    });
});