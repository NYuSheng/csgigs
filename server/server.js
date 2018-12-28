require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const user = require("./routes/user.route");
const rc = require("./routes/rc.route");
const gig = require("./routes/gig.route");
const task = require("./routes/task.route");
const task_request = require("./routes/taskrequests.route");
const points = require("./routes/point.route");

const app = express();

// Set up mongoose connection
require("./connection-db");

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
  // eslint-disable-next-line no-console
  console.log("Server is up and running on port number " + appPort);
});
