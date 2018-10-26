const httpMocks = require('node-mocks-http');
const gig_controller = require('../controllers/gig.controller');
const Gig = require('../models/gig.model');
var mongoose = require('mongoose');


describe("Gig Controller Tests", () => {
    beforeAll(()=> {
        var dev_db_url = 'mongodb://test1:test123@ds031895.mlab.com:31895/projectgigstest';
        var mongoDB = process.env.MONGODB_URI || dev_db_url;
        mongoose.connect(mongoDB);
        mongoose.Promise = global.Promise;
    });

    afterAll(() => {
        // mongoose.connection.db.dropDatabase();
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove({});
        }
        mongoose.disconnect();
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
        
        test('creating gigs with required parameters should return created gig with status 200', () => {
            
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
            });
        });
        
        //bad request
        xtest('creating gigs without all required parameters should return status 400', () => {
            
        });
        
        //bad request
        xtest('creating gig while specifying invalid admins should return status 400', () => {
            
        });
        
        //conflict
        xtest('creating a gig with a duplicate name should return status 409', () => {
            
        });
        
        //TBC
        xtest('creating gig without specifying admins should return gig with empty admin array', () => {
            
        });
        
        //TBC
        xtest('creating gig while specifying admins should return gig with filled admin array', () => {
            
        });
        
    });
    
    describe('Retrieve All Gigs', () =>{

        test('retrieving gigs should return array of gigs with status 200', () =>{

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
        test('valid Gig ID should return gig with status 200', () => {
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
        test('invalid Gig ID should return status 400', () => {
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

        
        