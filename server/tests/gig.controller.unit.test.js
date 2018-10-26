const httpMocks = require('node-mocks-http');
const gig_controller = require('../controllers/gig.controller');
const Gig = require('../models/gig.model');
var mongoose = require('mongoose');
const test_util = require('../utils/test.util');


describe("Gig Controller Tests", () => {
    beforeAll(()=> {
        test_util.setup(mongoose);
    });

    afterAll(() => {
        test_util.cleanUp(mongoose);
    });

    function createHttpMockRequest(bodyObj, paramObj, requestType){
        return request = httpMocks.createRequest({
            method : requestType,
            url : '/wew', //url here does not matter, this is just a mock
            body : bodyObj,
            params : paramObj
        });
    }
    
    describe('Create Gig', () => {
        
        test('with required parameters should return created gig, empty admin/participant/attendee array, status 200', () => {
            
            var body = {
                name :'ポケモンサファリ＠台南',
                points_budget : 100,
                status : "NOT STARTED"
            };
            
            const request = createHttpMockRequest(body, {}, 'POST');
            
            const response = httpMocks.createResponse();
            
            return gig_controller.gig_create(request, response).then(() =>{
                const responseData = response._getData();
                expect(response.statusCode).toBe(200);
                expect(responseData.gig.name).toBe('ポケモンサファリ＠台南');
                expect(responseData.gig.user_admins.length).toBe(0);
                expect(responseData.gig.user_participants.length).toBe(0);
                expect(responseData.gig.user_attendees.length).toBe(0);
            });
        });

        //TBC
        test('while specifying admins should return created gig, filled admin array, empty participant/attendee array, status 200', () => {
            var body = {
                name :'ジャンプフォース２０１８',
                points_budget : 100,
                status : "NOT STARTED",
                user_admins: ['brandon','dewang','kevin','yusheng','ernest']
            };
            
            const request = createHttpMockRequest(body, {}, 'POST');
            
            const response = httpMocks.createResponse();
            
            return gig_controller.gig_create(request, response).then(() =>{
                const responseData = response._getData();
                console.log(responseData);
                expect(response.statusCode).toBe(200);
                expect(responseData.gig.name).toBe('ジャンプフォース２０１８');
                expect(responseData.gig.user_admins.length).toBe(5);
                expect(responseData.gig.user_participants.length).toBe(0);
                expect(responseData.gig.user_attendees.length).toBe(0);
            });
        });

        //conflict
        test('with a duplicate name should return status 400', () => {
            var body = {
                name :'ジャンプフォース２０１８',
                points_budget : 150,
                status : "NOT STARTED",
                user_admins: ['brandon','dewang','kevin','yusheng']
            };

            const request = createHttpMockRequest(body, {}, 'POST');
            
            const response = httpMocks.createResponse();
            
            return gig_controller.gig_create(request, response).then(() =>{
                const responseData = response._getData();
                expect(response.statusCode).toBe(400);
            });
        });
        
        //bad request
        test('without all required parameters should return status 400', () => {
            var body = {
                name :'アホの森',
                status : "NOT STARTED",
                user_admins: ['ernest']
            };
            
            const request = createHttpMockRequest(body, {}, 'POST');
            
            const response = httpMocks.createResponse();
            
            return gig_controller.gig_create(request, response).then(() =>{
                const responseData = response._getData();
                expect(response.statusCode).toBe(400);
            });
        });

        //bad request (TBC)
        xtest('while specifying invalid admins should return status 400', () => {
            
        });
    });
    
    describe('Retrieve All Gigs', () =>{

        test('should return array of gigs with status 200', () =>{

            const request = createHttpMockRequest({}, {}, 'GET');
    
            const response = httpMocks.createResponse();
    
            return gig_controller.gigs_details(request, response).then(() =>{
                const responseData = response._getData();
                //_getData is already formed as an object here.
                expect(response.statusCode).toBe(200);
                expect(responseData.gigs.length).toBeGreaterThanOrEqual(1);
            });
        });
    });

    describe('Retrieve Gig By Id', () => {
        test('valid gig name should return gig with status 200', () => {
            const request = createHttpMockRequest({}, {name:'ポケモンサファリ＠台南'}, 'GET');
            const response = httpMocks.createResponse();
    
            return gig_controller.gig_details(request, response).then(() =>{
                const responseData = response._getData();
                expect(response.statusCode).toBe(200);
                expect(responseData.gig.name).toBe('ポケモンサファリ＠台南');
                expect(responseData.gig.points_budget).toBe(100);
            });
        });

        //bad request
        test('invalid gig name should return status 400', () => {
            const request = createHttpMockRequest({}, {name:''}, 'GET');
            const response = httpMocks.createResponse();

            return gig_controller.gig_details(request, response).then(() =>{
                console.log(response._getData());
                expect(response.statusCode).toBe(400);
            });
        });
        
    });

    //testing function directly
    //commented out until we've found a way to do unit testing for the db
    //currently this test will fail once anyone tampers/edit the data in gigs collection
    // test('retrieve all gigs', () =>{
        //     return gig_controller.wew().then((result) =>{
            //         expect(result).toHaveLength(2);
            //     });
            // });
});

        
        