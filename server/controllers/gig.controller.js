//@ts-check

const Gig = require("../models/gig.model");
const asyncMiddleware = require("../utils/asyncMiddleware");
const ObjectID = require("mongodb").ObjectID;
const rc_controller = require("../controllers/rc.controller");

exports.create_gig = asyncMiddleware(async (req, res, next) => {
  const gig = new Gig({
    name: req.body.name,
    description: req.body.description,
    photo: req.body.photo,
    points_budget: req.body.points_budget,
    status: "Draft",
    user_admins: req.body.user_admins.map(admin => admin.name),
    //Possible required fields in creation
    user_participants: [],
    user_attendees: []
  });
  try {
    const gig_created = await gig.save();

    if (gig_created === null) {
      return res.status(400).send({
        error: "Error encountered while creating gig: " + req.body.name
      });
    }

    const authSet = {
      XAuthToken: req.body.XAuthToken,
      XUserId: req.body.XUserId
    };

    //publish_bot with broadcast_test channel
    // const {
    //   CSGIGS_ROCKET_BOT_USER: botUserId,
    //   CSGIGS_ROCKET_BOT_PASSWORD: botXAuthToken,
    //   CSGIGS_ROCKET_BROADCAST_CHANNEL: roomId
    // } = process.env;

    // //publish_bot with broadcast_test channel
    // const authSet_bot = {
    //   XAuthToken: botXAuthToken,
    //   XUserId: botUserId
    // };
    const authSet_bot = {
      XAuthToken: "VynD2oNIieXVkn_nkqBSq1DKv5_5LhC1-ZKrz9q-bwl",
      XUserId: "Zjh2Hmnsbwq5MGMv8"
    };
    const roomId = "2EvneDEerT9jGLYYf";

    const gig_id_and_name = {
      _id: gig_created._id,
      name: gig_created.name
    };

    gig_created.user_admins = gig_created.user_admins.filter(
      admin => admin !== req.body.user
    );

    const created_group = await rc_controller.create_group(
      gig_created,
      authSet
    );
    if (created_group) {
      const gig_owners = req.body.user_admins
        .filter(admin => admin.name !== req.body.user)
        .map(admin => admin._id);
      rc_controller.add_owners_to_group(created_group._id, gig_owners, authSet);
      Gig.findByIdAndUpdate(
        gig_created._id,
        { rc_channel_id: created_group },
        function(err, gig) {
          if (err) return next(err);
        }
      );
      const message =
        "Please reply 'Attend' for event: *" + gig_created.name + "*";
      rc_controller.publish_broadcast_message(roomId, message, authSet_bot);
    }

    res.status(200).send({
      gig: gig_id_and_name
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

exports.get_gig_by_id = asyncMiddleware(async (req, res, next) => {
  return Gig.find({ _id: ObjectID(req.params.id) })
    .exec()
    .then(gig => {
      if (gig == null) {
        return res.status(400).send({
          error: "Cannot find Gig with id: " + req.params.id
        });
      }
      res.status(200).send({
        gig: gig[0]
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

exports.get_gig_name = asyncMiddleware(async (req, res, next) => {
  return Gig.find({ _id: ObjectID(req.params.id) })
    .exec()
    .then(gig => {
      if (gig == null) {
        return res.status(400).send({
          error: "Cannot find Gig with id: " + req.params.id
        });
      }
      res.status(200).send({
        gig_name: gig[0].name
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

exports.get_user_all_gigs = asyncMiddleware(async (req, res, next) => {
  let status = req.query.status.split(",");
  const matchCriteria = {
    user_admins: { $in: [req.params.user_id] },
    status: { $in: status }
  };
  return Gig.find(matchCriteria)
    .exec()
    .then(gigs => {
      res.status(200).send({
        gigs: gigs
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ error: err });
    });
});

exports.update_gig = function(req, res, next) {
  Gig.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, gig) {
    if (err) return next(err);
    res.send("Gig updated.");
  });
};

exports.gigs_by_status = function(req, res) {
  return Gig.find({ status: req.params.status })
    .exec()
    .then(gigs_retrieved => {
      if (gigs_retrieved.length === 0) {
        return res.status(400).send({
          error: "Cannot find any GIGs under status: " + req.params.status
        });
      }
      res.status(200).send({
        gigs: gigs_retrieved
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
};

exports.get_user_admins = asyncMiddleware(async (req, res, next) => {
  const matchCriteria = { $match: { _id: new ObjectID(req.params.id) } };
  return Gig.aggregate(gig_aggregation_with_user_admin(matchCriteria))
    .exec()
    .then(gig_retrieved => {
      if (gig_retrieved === null) {
        return res.status(400).send({
          error: "Cannot find gig of id " + req.params.id
        });
      }

      res.status(200).send({
        user_admins: gig_retrieved[0].user_admins
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

exports.add_user_admin = asyncMiddleware(async (req, res, next) => {
  return Gig.findOneAndUpdate(
    { _id: new ObjectID(req.params.id) },
    { $addToSet: { user_admins: req.body.user_id } }, //addToSet ensures no duplicate names in array
    { new: true },
    function(err, gig) {
      if (err || gig == null) {
        console.log(err);
        return res.status(400).send({
          error: "Cannot find gig of name " + req.params.name
        });
      } else {
        res.status(200).send({
          gig: gig
        });
      }
    }
  );
});

exports.delete_user_admin = asyncMiddleware(async (req, res, next) => {
  return Gig.findOneAndUpdate(
    { _id: new ObjectID(req.params.id) },
    { $pullAll: { user_admins: [req.body.user_id] } }, //remove all instances of the user admin
    { new: true }, // return updated new array
    function(err, gig) {
      if (err || gig == null) {
        console.log(err);
        return res.status(400).send({
          error: "Cannot find admin of id " + req.body.user_id
        });
      } else {
        res.status(200).send({
          gig: gig
        });
      }
    }
  );
});

function gig_aggregation_with_user_admin(matchCriteria) {
  return [
    matchCriteria,
    {
      $lookup: {
        from: "users",
        localField: "user_admins",
        foreignField: "_id",
        as: "user_admins"
      }
    }
  ];
}

exports.get_user_participants = asyncMiddleware(async (req, res, next) => {
  const matchCriteria = { $match: { _id: new ObjectID(req.params.id) } };
  return Gig.aggregate(gig_aggregation_with_user_participant(matchCriteria))
    .exec()
    .then(gig_retrieved => {
      if (gig_retrieved === null) {
        return res.status(400).send({
          error: "Cannot find Gig of id " + req.params.id
        });
      }
      res.status(200).send({
        gig: gig_retrieved[0]
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

exports.add_user_participant = asyncMiddleware(async (req, res, next) => {
  return Gig.findOneAndUpdate(
    { _id: new ObjectID(req.params.id) },
    { $addToSet: { user_participants: req.body.user_id } }, //addToSet ensures no duplicate names in array
    { new: true },
    function(err, gig) {
      if (err || gig == null) {
        console.log(err);
        return res.status(400).send({
          error: "Cannot find Gig of id " + req.params.id
        });
      } else {
        res.status(200).send({
          gig: gig
        });
      }
    }
  );
});

exports.delete_user_participant = asyncMiddleware(async (req, res, next) => {
  return Gig.findOneAndUpdate(
    { _id: new ObjectID(req.params.id) },
    { $pullAll: { user_participants: [req.body.user_id] } }, //remove all instances of the user admin
    { new: true }, // return updated new array
    function(err, gig) {
      if (err || gig == null) {
        console.log(err);
        console.log(gig);
        return res.status(400).send({
          error: "Cannot find participant of id " + req.body.user_id
        });
      } else {
        res.status(200).send({
          gig: gig
        });
      }
    }
  );
});

function gig_aggregation_with_user_participant(matchCriteria) {
  return [
    matchCriteria,
    {
      $lookup: {
        from: "users",
        localField: "user_participants",
        foreignField: "_id",
        as: "user_participants"
      }
    }
  ];
}
