const httpMocks = require('node-mocks-http');
const gig_controller = require('../controllers/gig.controller');
const Gig = require('../models/gig.model');
var mongoose = require('mongoose');


describe("Testing Gigs Controller", () => {
    beforeAll(()=> {
        var dev_db_url = 'mongodb://test1:test123@ds031895.mlab.com:31895/projectgigstest';
        var mongoDB = process.env.MONGODB_URI || dev_db_url;
        mongoose.connect(mongoDB);
        mongoose.Promise = global.Promise;
    });

    afterAll(() => {
        mongoose.disconnect();
    });

    function createHttpMockRequest(bodyObj){
        return request = httpMocks.createRequest({
            method: 'POST',
            url: '/wew', //url here does not matter, this is just a mock
            body: bodyObj
        });
    }

    test('creating gigs with required parameters should give status 200', () => {

        var body = {
            channelId: "D1234",
            name: "Pokemon Tour",
            browniePoints: 100,
            status: "NOT STARTED"
        };

        const request = createHttpMockRequest(body);

        const response = httpMocks.createResponse();

        return gig_controller.gig_create(request, response).then(() =>{
            console.log(response._getData());
            const responseData = response._getData();
            expect(responseData.status).toBe(200);
        });
    });

    test('retrieving gigs should give status 200', () =>{

        const request = createHttpMockRequest({});

        const response = httpMocks.createResponse();

        return gig_controller.gigs_details(request, response).then(() =>{
            const responseData = response._getData();
            //_getData is already formed as an object here.
            expect(responseData.status).toBe(200);
        });
    });

    xtest('should not be able to create two gigs of same name', () => {

    });

    xtest('creating gig without specifying admins should return empty admin array', () => {

    });

    xtest('creating gig while specifying admins should return a filled admin array', () => {

    });

    xtest('creating gig while specifying invalid admins should return error', () => {

    });

    //testing function directly
    //commented out until we've found a way to do unit testing for the db
    //currently this test will fail once anyone tampers/edit the data in gigs collection
    // test('retrieve all gigs', () =>{
    //     return gig_controller.wew().then((result) =>{
    //         expect(result).toHaveLength(2);
    //     });
    // });
})

