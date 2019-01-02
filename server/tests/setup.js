global.fetch = require("jest-fetch-mock");

jest.setMock("node-fetch", global.fetch);
