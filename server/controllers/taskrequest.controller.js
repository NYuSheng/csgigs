const Task_Request = require("../models/taskrequest.model");
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
      console.log(task_requests);
      res.status(200).send({
        task_requests: task_requests
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
};

exports.create_task_request = function(req, res) {
  let task_request = new Task_Request({
    task_id: req.body.task_id,
    user_name: req.body.user_name
  });

  return task_request
    .save()
    .then(taskRequestCreated => {
      res.status(200).send({
        task_request: taskRequestCreated
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send({ error: err });
    });
};

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
