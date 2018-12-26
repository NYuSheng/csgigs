const Task_Requests = require("../models/taskrequests.model");

exports.get_requests_by_id = function (req, res, next) {
    const task_id = req.params.task_id;
    return Task_Requests.find({task_id: task_id}).exec().then((task_requests) => {
        res.status(200).send({
            task_requests: task_requests
        });
    }).catch(err => {
        res.status(400).send({error: err});
    });
};