const Task = require("../models/task.model");
const ObjectID = require("mongodb").ObjectID;
const asyncMiddleware = require("../utils/asyncMiddleware");

exports.create_tasks = async function(req, res, next) {
  let task = new Task({
    gig_id: ObjectID(req.body.gig_id),
    task_name: req.body.task_name,
    task_description: req.body.task_description,
    task_category: req.body.task_category,
    users_assigned: [],
    completeAt: null
  });
  try{
    let taskCreated = await task.save();
    res.status(200).send({
      task: taskCreated
    });
  }catch (ex) {
    LogConfig.error(JSON.stringify(ex));
    const { error } = ex;
    let message = defaultErrorMessage;
    res.status(400).send({ error: err });
  }
};

exports.get_tasks_gigs = function(req, res, next) {
  const matchCriteria = { $match: { gig_id: new ObjectID(req.params.gig_id) } };
  return Task.aggregate(task_aggregation_with_user_assigned(matchCriteria))
    .exec()
    .then(tasks_retrieved => {
      res.status(200).send({
        tasks: tasks_retrieved
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
};

exports.update_task = function(req, res, next) {
  Task.findByIdAndUpdate(req.params.task_id, { $set: req.body }, function(
    err,
    task
  ) {
    if (err) return next(err);
    res.status(200).send("Task udpated.");
  });
};

exports.remove_task = function(req, res, next) {
  Task.findByIdAndRemove(req.params.task_id, (err, task) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Task successfully deleted",
      id: task._id
    };
    return res.status(200).send(response);
  });
};

exports.get_users_assigned_tasks_in_gigs = asyncMiddleware(async (req, res) => {
  const matchCriteria = {
    gig_id: new ObjectID(req.params.gig_id),
    users_assigned: req.params.user_id
  };
  return Task.find(matchCriteria)
    .exec()
    .then(tasks => {
      res.status(200).send({
        tasks: tasks
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ error: err });
    });
});

function task_aggregation_with_user_assigned(matchCriteria) {
  return [
    matchCriteria,
    {
      $lookup: {
        from: "users",
        localField: "users_assigned",
        foreignField: "_id",
        as: "users_assigned"
      }
    }
  ];
}
