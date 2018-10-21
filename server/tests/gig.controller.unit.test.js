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

    test('creating gigs with required parameters should give 200', () => {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/wew', //url here does not matter, this is just a mock
            body: {
                channelId: "D1234",
                name: "Pokemon Tour",
                browniePoints: 100,
                status: "NOT STARTED"
            }
        });

        const response = httpMocks.createResponse();

        return gig_controller.gig_create(request, response).then(() =>{
            console.log(response._getData());
            const responseData = response._getData();
            expect(responseData.status).toBe(200);
        });
    });

    //testing endpoint
    test('/gigs should give status 200', () =>{

        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/wew' //url here does not matter, this is just a mock
        });

        const response = httpMocks.createResponse();

        return gig_controller.gigs_details(request, response).then(() =>{
            const responseData = response._getData();
            //_getData is already formed as an object here.
            expect(responseData.status).toBe(200);
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
})

