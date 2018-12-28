const httpMocks = require("node-mocks-http");
const gigController = require("../controllers/gig.controller");
const mongoose = require("mongoose");
const test_util = require("../utils/test.util");
const mockRes = require("jest-mock-express").response;

const GigsMock = require("../models/gig.model");

jest
  .spyOn(GigsMock.prototype, "save")
  .mockImplementationOnce(() => Promise.resolve(null));

const createRequest = () => {
  return {
    body: {
      name: "testgig",
      user_admins: [],
      points_budget: 500
    }
  };
};

describe("Gig Controller Tests", () => {
  let res;
  beforeEach(() => {
    res = mockRes();
    jest.clearAllMocks();
  });

  it("should return an error if unable to create a gig", async () => {
    GigsMock.save = async () => Promise.resolve(null);

    await gigController.create_gig(createRequest(), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: "Error encountered while creating gig: testgig"
    });
  });
});

xdescribe("Gig Controller Tests", () => {
  beforeAll(() => {
    test_util.setup(mongoose);
  });

  afterAll(() => {
    test_util.cleanUp(mongoose);
  });

  describe("Create Gig", () => {
    test("with required parameters should return created gig, empty admin/participant/attendee array, status 200", () => {
      var body = {
        name: "ポケモンサファリ＠台南",
        points_budget: 100,
        status: "NOT STARTED"
      };

      const request = test_util.createHttpMockRequest(body, {}, "POST");

      const response = httpMocks.createResponse();

      return gig_controller.gig_create(request, response).then(() => {
        const responseData = response._getData();
        expect(response.statusCode).toBe(200);
        expect(responseData.gig.name).toBe("ポケモンサファリ＠台南");
        expect(responseData.gig.user_admins.length).toBe(0);
        expect(responseData.gig.user_participants.length).toBe(0);
        expect(responseData.gig.user_attendees.length).toBe(0);
      });
    });

    //TBC
    test("while specifying admins should return created gig, filled admin array, empty participant/attendee array, status 200", () => {
      var body = {
        name: "ジャンプフォース２０１８",
        points_budget: 100,
        status: "NOT STARTED",
        user_admins: ["brandon", "dewang", "kevin", "yusheng", "ernest"]
      };

      const request = test_util.createHttpMockRequest(body, {}, "POST");

      const response = httpMocks.createResponse();

      return gig_controller.gig_create(request, response).then(() => {
        const responseData = response._getData();
        expect(response.statusCode).toBe(200);
        expect(responseData.gig.name).toBe("ジャンプフォース２０１８");
        expect(responseData.gig.user_admins.length).toBe(5);
        expect(responseData.gig.user_participants.length).toBe(0);
        expect(responseData.gig.user_attendees.length).toBe(0);
      });
    });

    //conflict
    test("with a duplicate name should return status 400", () => {
      var body = {
        name: "ジャンプフォース２０１８",
        points_budget: 150,
        status: "NOT STARTED",
        user_admins: ["brandon", "dewang", "kevin", "yusheng"]
      };

      const request = test_util.createHttpMockRequest(body, {}, "POST");

      const response = httpMocks.createResponse();

      return gig_controller.gig_create(request, response).then(() => {
        const responseData = response._getData();
        expect(response.statusCode).toBe(400);
      });
    });

    //bad request
    test("without all required parameters should return status 400", () => {
      var body = {
        name: "アホの森",
        status: "NOT STARTED",
        user_admins: ["ernest"]
      };

      const request = test_util.createHttpMockRequest(body, {}, "POST");

      const response = httpMocks.createResponse();

      return gig_controller.gig_create(request, response).then(() => {
        const responseData = response._getData();
        expect(response.statusCode).toBe(400);
      });
    });

    //bad request (TBC)
    xtest("while specifying invalid admins should return status 400", () => {});
  });

  describe("Retrieve All Gigs", () => {
    test("should return array of gigs with status 200", () => {
      const request = test_util.createHttpMockRequest({}, {}, "GET");

      const response = httpMocks.createResponse();

      return gig_controller.gigs_details(request, response).then(() => {
        const responseData = response._getData();
        //_getData is already formed as an object here.
        expect(response.statusCode).toBe(200);
        expect(responseData.gigs.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("Retrieve Gig By Id", () => {
    test("valid gig name should return gig with status 200", () => {
      const request = test_util.createHttpMockRequest(
        {},
        { name: "ポケモンサファリ＠台南" },
        "GET"
      );
      const response = httpMocks.createResponse();

      return gig_controller.gig_details(request, response).then(() => {
        const responseData = response._getData();
        expect(response.statusCode).toBe(200);
        expect(responseData.gig.name).toBe("ポケモンサファリ＠台南");
        expect(responseData.gig.points_budget).toBe(100);
      });
    });

    //bad request
    test("invalid gig name should return status 400", () => {
      const request = test_util.createHttpMockRequest({}, { name: "" }, "GET");
      const response = httpMocks.createResponse();

      return gig_controller.gig_details(request, response).then(() => {
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
