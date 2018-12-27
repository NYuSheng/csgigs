const Point = require("../models/point.model");

exports.assign_points = function (req, res) {
    let points_assigned = new Point(
        {
            user_id: ObjectID(req.params.user_id),
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
