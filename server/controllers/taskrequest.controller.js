const Task_Request = require("../models/taskrequest.model");
const User = require("../models/user.model");
const asyncMiddleware = require("../utils/asyncMiddleware");
const getCachedApiAuth = request => request.app.locals.apiAuth;
const LogConfig = require("../log-config");
const rc_controller = require("../controllers/rc.controller");
const task_status = "Pending";

exports.get_requests_by_id = function(req, res) {
  const task_id = req.params.task_id;
  const match_criteria = {
    $match: {
      task_id: task_id,
      status: task_status
    }
  };

  return Task_Request.aggregate(aggregation_with_users(match_criteria))
    .exec()
    .then(task_requests => {
      res.status(200).send({
        task_requests: task_requests
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
};

exports.create_task_request = asyncMiddleware(async (req, res) => {
  try {
    const task_request = new Task_Request({
      task_id: req.body.task_id,
      user_id: req.body.user_id
    });
    const authSetBot = getCachedApiAuth(req);
    const request_user = await User.find({ _id: req.body.user_id });
    if (request_user.length === 0) {
      //call rc
      const retrieved_user = await rc_controller.get_user_info(
        authSetBot,
        req.body.user_id
      );
      if (!retrieved_user.success) {
        throw `Unable retrieve user from rocket chat db`;
      }

      const new_user = new User({
        _id: retrieved_user.user._id,
        username: retrieved_user.user.username,
        name: retrieved_user.user.name
      });

      const result = await new_user.save();
      if (!result) {
        throw `Unable to create new user in db`;
      }
    }

    const saved_request = await task_request.save();
    if (!saved_request) {
      return res.status(500).send({
        error: "The request is not saved"
      });
    }
    res.status(200).send({
      task_request: saved_request
    });
  } catch (error) {
    LogConfig.error(JSON.stringify(error));
    throw `Internal Server Error`;
  }
});

exports.update_request_status = function(req, res, next) {
  Task_Request.findByIdAndUpdate(
    req.params.task_request_id,
    { status: req.body.status },
    function(err, result) {
      if (err) return next(err);
      res.send("Task request updated.");
    }
  );
};

function aggregation_with_users(match_criteria) {
  return [
    match_criteria,
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "userObject"
      }
    },
    {
      $project: {
        _id: "$_id",
        task_id: "$task_id",
        user: { $arrayElemAt: ["$userObject", 0] },
        status: "$status"
      }
    }
  ];
}
