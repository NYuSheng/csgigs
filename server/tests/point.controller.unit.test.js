const mockRes = require("jest-mock-express").response;
const PointMock = require("../models/point.model");
const pointController = require("../controllers/point.controller");
const ObjectID = require("mongodb").ObjectID;

const gig_id = ObjectID(123);

const createRequest = () => {
  return {
    headers: {},
    body: {
      gig_id: gig_id,
      points: 500
    },
    params: {
      user_id: "user123"
    }
  };
};

const getPointsRequest = () => {
  return {
    params: {
      gig_id: gig_id
    }
  };
};

describe("Point Controller", () => {
  let res;
  beforeEach(() => {
    res = mockRes();
    global.fetch.resetMocks();
    jest.clearAllMocks();
  });

  describe("assign points: failure", () => {
    it("should return an error if unable to assign points", async () => {
      jest
        .spyOn(PointMock.prototype, "save")
        .mockImplementationOnce(() => Promise.reject("Internal Server Error"));
      await pointController.assign_points(createRequest(), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "Internal Server Error"
      });
    });
  });

  describe("assign points: success", () => {
    it("should return assigned record if successfully assign points", async () => {
      jest
        .spyOn(PointMock.prototype, "save")
        .mockImplementationOnce(() =>
          Promise.resolve({ gig_id: gig_id, points: 500, user_id: "user123" })
        );
      await pointController.assign_points(createRequest(), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        points_record: { gig_id: gig_id, points: 500, user_id: "user123" }
      });
    });
  });

  describe("get gig points: failure", () => {
    it("should return an error if unable to get gig points", async () => {
      jest
        .spyOn(PointMock, "find")
        .mockImplementationOnce(() => Promise.reject("Internal Server Error"));
      await pointController.get_points_gig(getPointsRequest(), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "Internal Server Error"
      });
    });
  });

  describe("get gig points: failure", () => {
    it("should return not found message if unable to get gig points", async () => {
      jest
        .spyOn(PointMock, "find")
        .mockImplementationOnce(() => Promise.resolve(null));
      await pointController.get_points_gig(getPointsRequest(), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: `Unable to find point allocations for gig: ${gig_id}`
      });
    });
  });

  describe("get gig points: success", () => {
    it("should return points  if successfully get gig points", async () => {
      jest.spyOn(PointMock, "find").mockImplementationOnce(() =>
        Promise.resolve({
          user_id: "user123",
          git_id: "gig123",
          points: 20000
        })
      );
      await pointController.get_points_gig(getPointsRequest(), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        gig_points_record: {
          git_id: "gig123",
          points: 20000,
          user_id: "user123"
        }
      });
    });
  });
});
