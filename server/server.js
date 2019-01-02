require("dotenv").config();
const LogConfig = require("./log-config");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const api = require("./utils/api");

const user = require("./routes/user.route");
const rc = require("./routes/rc.route");
const gig = require("./routes/gig.route");
const task = require("./routes/task.route");
const task_request = require("./routes/taskrequest.route");
const points = require("./routes/point.route");

// Set up mongoose connection
require("./connection-db");

function validateEnvironmentVariables() {
  const validateEnvironmentVariable = name => process.env[name] != null;
  const all = [
    "CSGIGS_ROCKET_API_USER",
    "CSGIGS_ROCKET_API_PASSWORD",
    "CSGIGS_ROCKET_API_URL",
    "CSGIGS_ROCKET_BROADCAST_CHANNEL"
  ];

  let hasInvalid = false;
  for (let name of all) {
    if (validateEnvironmentVariable(name)) {
      LogConfig.info(`Found environment variable ${name}`);
    } else {
      hasInvalid = true;
      LogConfig.error(`Missing environment variable ${name}. Refer to README`);
    }
  }
  return hasInvalid === false;
}

async function bootstrapApp() {
  const app = express();

  LogConfig.info("Attempting to login as the API bot user...");
  app.locals.apiAuth = await api.loginAsBot();
  LogConfig.info("Logged in as API bot user and have auth details...");

  const roomName = process.env.CSGIGS_ROCKET_BROADCAST_CHANNEL;
  LogConfig.info(
    `Attempting to get the room id of broadcast channel '${roomName}'...`
  );
  const response = await api.get(
    "channels.info",
    app.locals.apiAuth.authToken,
    app.locals.apiAuth.userId,
    {
      roomName
    }
  );
  app.locals.broadcastChannelName = response.channel._id;
  LogConfig.info("Found broadcast channel room id");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use("/admin-ui", express.static(path.join(__dirname, "./public")));
  app.use("/admin-ui/api/users", user);
  app.use("/admin-ui/api/rc", rc);
  app.use("/admin-ui/api/gigs", gig);
  app.use("/admin-ui/api/tasks", task);
  app.use("/admin-ui/api/task_requests", task_request);
  app.use("/admin-ui/api/points", points);

  app.get("/admin-ui/*", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  const appPort = 5000;

  app.listen(appPort, () => {
    LogConfig.info("Server is up and running on port number " + appPort);
  });
}

LogConfig.info("Attempting to start app...");
if (validateEnvironmentVariables()) {
  bootstrapApp().catch(LogConfig.error);
}
