const TaskHashTag = require('../models/taskhashtag.model');
const asyncMiddleware = require('../utils/asyncMiddleware');

exports.taskhashtag_create = asyncMiddleware(async (req, res, next) => {
    let tag = new TaskHashTag(
        {
            name :req.body.name,
            description : req.body.description
        }
    );

    return tag.save().then(tagCreated => {
        res.status(200).send({
            "tag" : tagCreated
        });
    }).catch(err => {
        console.log(err);
        res.status(400).send({error : err});
    });
});

exports.taskhashtags_details = asyncMiddleware(async (req, res, next) => {

    return TaskHashTag.find({}).exec().then((tags) => {
        res.status(200).send({
            "tags" : tags
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send({error : err});
    });
});