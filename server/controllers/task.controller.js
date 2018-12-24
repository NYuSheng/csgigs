const Task = require('../models/task.model');

exports.create_tasks = function (req, res, next) {
    let task = new Task(
        {
            gig_name: req.body.gig_name,
            task_name:req.body.task_name,
            task_description:req.body.task_description,
            points: 0,
            task_category: req.body.task_category,
            users_assigned: [],
            completeAt: null
        }
    );

    return task.save().then(taskCreated => {
        res.status(200).send({
            "task" : taskCreated
        });
    }).catch(err => {
        console.log(err);
        res.status(400).send({error : err});
    });
};

exports.get_tasks_gigs = function (req, res, next) {
    return Task.find({gig_name:req.params.gigname}).exec().then((tasks_retrieved) => {
        if(tasks_retrieved.length === 0){
            return res.status(400).send({
                error: 'Cannot related task for GIG: ' + req.params.gigname
            });
        }
        res.status(200).send({
            tasks: tasks_retrieved
        });
    }).catch(err=>{
        res.status(400).send({error: err});
    })
}

exports.update_task = function (req, res, next) {
    Task.findByIdAndUpdate(req.params.taskid, {$set: req.body}, function (err, task) {
        if (err) return next(err);
        res.status(200).send('Task udpated.');
    });
};

exports.update_points_allocation = function (req, res, next) {
    const tasks = req.body.tasks;
    tasks.forEach(function (task) {
        Task.findByIdAndUpdate(task._id, {$set: task}, function (err, task) {
            if (err) return next(err);
        });
    });
    res.status(200).send('Points udpated.');
};

exports.remove_task = function (req, res, next) {
    Task.findByIdAndRemove(req.params.taskid, (err, task) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Task successfully deleted",
            id: task._id
        };
        return res.status(200).send(response);
    });
};

