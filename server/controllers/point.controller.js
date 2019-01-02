const Point = require("../models/point.model");
const ObjectID = require('mongodb').ObjectID;

exports.assign_points = function (req, res) {
    let points_assigned = new Point(
        {
            user_id: req.params.user_id,
            gig_id: ObjectID(req.body.gig_id),
            points:req.body.points
        }
    );

    return points_assigned.save().then(result => {
        res.status(200).send({
            "points_record" : result
        });
    }).catch(err => {
        console.log(err);
        res.status(400).send({error : err});
    });
};

exports.get_points_gig = function (req, res) {
    return Point.find({gig_id: ObjectID(req.params.gig_id)}).exec().then((result) => {
        if (result.length === 0) {
            return res.status(400).send({
                error: "Cannot find any points allocation for gig: " + req.params.gig_id
            });
        }
        res.status(200).send({
            gig_points_record: result
        });
    }).catch(err => {
        res.status(400).send({error: err});
    });
};