const httpMocks = require("node-mocks-http");
const user_controller = require("../controllers/user.controller");
const User = require("../models/user.model");
var mongoose = require("mongoose");

xdescribe("User Controller Tests", () => {
  describe("Authenticate User", () => {
    xtest("valid username and password should return authentication token with status 200", () => {});

    //unauthorized
    xtest("invalid username/password should return status 401", () => {});
  });

  describe("Retrieve User by Username", () => {
    xtest("valid username should return a valid user object with status 200", () => {});

    xtest("invalid username should return status 400", () => {});
  });
});
