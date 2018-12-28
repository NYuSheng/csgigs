const httpMocks = require("node-mocks-http");
const task_controller = require("../controllers/task.controller");
var mongoose = require("mongoose");
const test_util = require("../utils/test.util");

xdescribe("Task Controller Tests", () => {
  beforeAll(() => {
    test_util.setup(mongoose);
  });

  afterAll(() => {
    test_util.cleanUp(mongoose);
  });

  function createHttpMockRequest(bodyObj, paramObj, requestType) {
    return (request = httpMocks.createRequest({
      method: requestType,
      url: "/wew", //url here does not matter, this is just a mock
      body: bodyObj,
      params: paramObj
    }));
  }

  describe("Create Task", () => {
    test("with required parameters should return created task, status 200", () => {
      var body = {
        gig_name: "hkt2018",
        task_name: "book venue",
        points: 20,
        completeAt: null
      };

      const request = createHttpMockRequest(body, {}, "POST");

      const response = httpMocks.createResponse();

      return task_controller.create_tasks(request, response).then(() => {
        const responseData = response._getData();
        expect(response.statusCode).toBe(200);
        expect(responseData.task.gig_name).toBe("hkt2018");
        expect(responseData.task.task_name).toBe("book venue");
        expect(responseData.task.points).toBe(20);
      });
    });

    test("create another task with same gig_name, status 200", () => {
      var body = {
        gig_name: "hkt2018",
        task_name: "food",
        points: 30,
        completeAt: null
      };

      const request = createHttpMockRequest(body, {}, "POST");

      const response = httpMocks.createResponse();

      return task_controller.create_tasks(request, response).then(() => {
        const responseData = response._getData();
        expect(response.statusCode).toBe(200);
        expect(responseData.task.gig_name).toBe("hkt2018");
        expect(responseData.task.task_name).toBe("food");
        expect(responseData.task.points).toBe(30);
      });
    });
  });

  describe("Retrieve All task undre given GIG", () => {
    test("should return array of tasks with status 200", () => {
      const request = createHttpMockRequest({}, { gigname: "hkt2018" }, "POST");

      const response = httpMocks.createResponse();

      return task_controller.get_tasks_gigs(request, response).then(() => {
        const responseData = response._getData();
        expect(response.statusCode).toBe(200);
        expect(responseData.tasks.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
