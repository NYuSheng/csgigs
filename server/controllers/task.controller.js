const Task = require("../models/task.model");
const ObjectID = require("mongodb").ObjectID;
const asyncMiddleware = require("../utils/asyncMiddleware");
const LogConfig = require("../log-config");

exports.create_tasks = asyncMiddleware(async (req, res) => {
  let task = new Task({
    gig_id: ObjectID(req.body.gig_id),
    task_name: req.body.task_name,
    task_description: req.body.task_description,
    task_category: req.body.task_category,
    users_assigned: [],
    completeAt: null
  });
  try {
    let task_created = await task.save();
    res.status(200).send({
      task: task_created
    });
  } catch (ex) {
    LogConfig.error(JSON.stringify(ex));
    const { error } = ex;
    res.status(400).send({ error: error });
  }
});

exports.get_tasks_gigs = asyncMiddleware(async (req, res) => {
  const matchCriteria = { $match: { gig_id: new ObjectID(req.params.gig_id) } };

  try {
    let tasks_retrieved = await Task.aggregate(
      task_aggregation_with_user_assigned(matchCriteria)
    );
    res.status(200).send({
      tasks: tasks_retrieved
    });
  } catch (ex) {
    LogConfig.error(JSON.stringify(ex));
    const { error } = ex;
    res.status(400).send({ error: error });
  }
});

exports.update_task = asyncMiddleware(async function(req, res) {
  try {
    let task = await Task.findByIdAndUpdate(req.params.task_id, {
      $set: req.body
    });
    if (!task) {
      res.status(404).send({
        error: "task of id " + req.params.task_id + "does not exist."
      });
    }
    res.status(200).send("Task updated.");
  } catch (ex) {
    LogConfig.error(JSON.stringify(ex));
    const { error } = ex;
    res.status(400).send({ error: error });
  }
});

exports.remove_task = asyncMiddleware(async (req, res) => {
  try {
    let task = await Task.findByIdAndRemove(req.params.task_id);
    if (!task) {
      res.status(404).send({
        error: "task of id " + req.params.task_id + "does not exist."
      });
    }
    const response = {
      message: "Task successfully deleted",
      id: task._id
    };
    res.status(200).send(response);
  } catch (ex) {
    LogConfig.error(JSON.stringify(ex));
    const { error } = ex;
    res.status(400).send({ error: error });
  }
});

exports.get_users_assigned_tasks_in_gigs = asyncMiddleware(async (req, res) => {
  const matchCriteria = {
    gig_id: new ObjectID(req.params.gig_id),
    users_assigned: req.params.user_id
  };

  try {
    const tasks = await Task.find(matchCriteria);
    res.status(200).send({ tasks: tasks });
  } catch (ex) {
    LogConfig.error(JSON.stringify(ex));
    const { error } = ex;
    res.status(500).send({ error: error });
  }
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
