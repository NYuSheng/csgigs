const Task = require('../models/task.model');

//Simple version, without validation or sanitation
exports.create_tasks = function (req, res, next) {
    let task = new Task(
        {
            gig_name: req.body.gig_name,
            task_name:req.body.task_name,
            points: req.body.points,
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
