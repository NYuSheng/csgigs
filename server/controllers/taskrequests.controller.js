const Task_Requests = require("../models/taskrequests.model");
const task_status = 'Pending';

exports.get_requests_by_id = function (req, res) {
    const task_id = req.params.task_id;
    return Task_Requests.find({task_id: task_id, status: task_status}).exec().then((task_requests) => {
        console.log(task_requests);
        res.status(200).send({
            task_requests: task_requests
        });
    }).catch(err => {
        res.status(400).send({error: err});
    });
};

exports.create_task_request = function (req, res) {
    let task_request = new Task_Requests(
        {
            task_id: req.body.task_id,
            user_name:req.body.user_name
        }
    );

    return task_request.save().then(taskRequestCreated => {
        res.status(200).send({
            "task_request" : taskRequestCreated
        });
    }).catch(err => {
        console.log(err);
        res.status(400).send({error : err});
    });
};

exports.update_request_status = function (req, res, next) {
    Task_Requests.findByIdAndUpdate(req.params.task_request_id, {status: req.body.status}, function (err, gig) {
        if (err) return next(err);
        res.send("Task request updated.");
    });
};
