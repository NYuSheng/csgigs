const Point = require("../models/point.model");
const ObjectID = require("mongodb").ObjectID;
const LogConfig = require("../log-config");

exports.assign_points = function(req, res) {
  const points_assigned = new Point({
    user_id: req.params.user_id,
    gig_id: ObjectID(req.body.gig_id),
    points: req.body.points
  });

  return points_assigned
    .save()
    .then(result => {
      res.status(200).send({
        points_record: result
      });
    })
    .catch(err => {
      LogConfig.error(JSON.stringify(err));
      res.status(500).send({ error: err });
    });
};

exports.get_points_gig = function(req, res) {
  return Point.find({ gig_id: ObjectID(req.params.gig_id) })
    .then(result => {
      if (!result) {
        return res.status(404).send({
          error:
            "Cannot find any points allocation for gig: " + req.params.gig_id
        });
      }
      res.status(200).send({
        gig_points_record: result
      });
    })
    .catch(err => {
      LogConfig.error(JSON.stringify(err));
      res.status(500).send({ error: err });
    });
};
