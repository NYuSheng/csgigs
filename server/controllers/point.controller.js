const Point = require("../models/point.model");
const ObjectID = require("mongodb").ObjectID;
const LogConfig = require("../log-config");
const asyncMiddleware = require("../utils/asyncMiddleware");

exports.assign_points = asyncMiddleware(async function(req, res) {
  const points_assigned = new Point({
    user_id: req.params.user_id,
    gig_id: ObjectID(req.body.gig_id),
    points: req.body.points
  });
  try {
    const assigned_points = await points_assigned.save();
    if (!assigned_points) {
      throw `Unable to assign points to ${req.params.user_id}`;
    }
    res.status(200).send({
      points_record: assigned_points
    });
  } catch (error) {
    LogConfig.error(JSON.stringify(error));
    res.status(500).send({ error: error });
  }
});

exports.get_points_gig = asyncMiddleware(async function(req, res) {
  const matchCriteria = {
    gig_id: ObjectID(req.params.gig_id)
  };
  try {
    const points_gig = await Point.find(matchCriteria);
    if (!points_gig) {
      throw `Unable to find point allocations for gig: ${req.params.gig_id}`;
    }
    res.status(200).send({
      gig_points_record: points_gig
    });
  } catch (error) {
    LogConfig.error(JSON.stringify(error));
    res.status(500).send({ error });
  }
});
