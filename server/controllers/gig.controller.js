//@ts-check
const LogConfig = require("../log-config");
const Gig = require("../models/gig.model");
const User = require("../models/user.model");
const asyncMiddleware = require("../utils/asyncMiddleware");
const ObjectID = require("mongodb").ObjectID;
const rc_controller = require("../controllers/rc.controller");

const getCachedApiAuth = request => request.app.locals.apiAuth;
const getCachedBroadcastRoomId = request =>
  request.app.locals.broadcastChannelName;

const trySaveOrThrow = async gig => {
  let saved;
  const defaultErrorMessage =
    "Error encountered while creating gig: " + gig.name;
  try {
    saved = await gig.save();
  } catch (ex) {
    LogConfig.error(JSON.stringify(ex));
    const { error } = ex;
    let message;
    if (error.code === 11000) {
      message = `The gig ${gig.name} already exists. Please try another name.`;
    } else {
      message = defaultErrorMessage;
    }
    throw message;
  }
  if (!saved) throw defaultErrorMessage;
  return saved;
};

exports.create_gig = asyncMiddleware(async (req, res) => {
  const gig = new Gig({
    name: req.body.name.trim(),
    description: req.body.description,
    photo: req.body.photo,
    points_budget: req.body.points_budget,
    createdBy: req.body.createdBy._id,
    status: "Draft",
    user_admins: req.body.user_admins.map(admin => admin._id),
    type: req.body.type,
    owner: req.body.owner ? req.body.owner._id : "",
    venue: req.body.venue,
    address: req.body.address,
    region: req.body.region,
    channel: req.body.channel,
    contact: req.body.contact,
    timeZone: req.body.timeZone,
    registrationRequired: req.body.registrationRequired === "Y" ? true : false,
    maxParticipants: req.body.maxParticipants,
    relatedLink: req.body.relatedLink,
    startDate: req.body.startDate,
    endDate: req.body.endDate,

    //Possible required fields in creation
    user_participants: []
    // user_attendees: []
  });
  try {
    if (!gig.owner) {
      throw `No owner specified for ${gig.name}`;
    }

    if (!gig.user_admins.length) {
      throw `No admin specified for ${gig.name}`;
    }

    const gig_created = await trySaveOrThrow(gig);
    const authSetBot = getCachedApiAuth(req);

    //publish_bot with broadcast_test channel

    const roomId = getCachedBroadcastRoomId(req);

    const gig_id_and_name = {
      _id: gig_created._id,
      name: gig_created.name
    };

    req.body.user_admins.push(req.body.createdBy);
    const members = req.body.user_admins.map(admin => admin.username);

    const created_group = await rc_controller.create_group(
      authSetBot,
      gig_created.name,
      members
    );
    if (!created_group) {
      const gig_deleted = await Gig.findByIdAndRemove(gig_created._id);
      if (gig_deleted._id) {
        throw `Unable to create group ${gig_created.name} in RC`;
      } else {
        throw `Unable to create group ${
          gig_created.name
        } in RC, but record in MongoDB still persists. Please contact administrator to delete record.`;
      }
    }
    const gig_owners = req.body.user_admins.map(admin => admin._id);

    const addOwners = await rc_controller.add_owners_to_group(
      authSetBot,
      gig_owners,
      created_group._id
    );

    if (!addOwners.success) {
      const user = req.body.user_admins.find(x => x._id === addOwners.userId);
      throw `Unable to add user ${user.name} as an owner of group ${gig.name}`;
    }

    await Gig.findByIdAndUpdate(gig_created._id, {
      rc_channel_id: created_group
    });

    const message = `Please reply 'attend' for event: **${gig_created.name}**`;
    const broadcastMessage = await rc_controller.publishBroadcastMessage(
      authSetBot,
      roomId,
      message
    );
    if (!broadcastMessage) {
      throw `Unable to publish broadcast message for ${gig_created.name}`;
    }

    res.status(200).send({
      gig: gig_id_and_name
    });
  } catch (error) {
    LogConfig.error(JSON.stringify(error));
    res.status(500).send({ error: error });
  }
});

exports.get_gig_by_id = asyncMiddleware(async (req, res) => {
  try {
    const result = await Gig.find({ _id: new ObjectID(req.params.id) });
    if (result.length === 0) {
      throw "error: Cannot find Gig with id: " + req.params.id;
    }
    res.status(200).send({
      gig: result[0]
    });
  } catch (error) {
    LogConfig.error(JSON.stringify(error));
    res.status(500).send({ error });
  }
});

exports.get_gig_name = asyncMiddleware(async (req, res) => {
  try {
    const gig = await Gig.find({ _id: new ObjectID(req.params.id) });
    if (gig == null) {
      throw "Cannot find Gig with id: " + req.params.id;
    }
    res.status(200).send({
      gig_name: gig[0].name
    });
  } catch (error) {
    LogConfig.error(JSON.stringify(error));
    res.status(500).send({ error });
  }
});

exports.get_user_all_gigs = asyncMiddleware(async (req, res) => {
  const status = req.query.status.split(",");
  const matchCriteria = {
    $or: [
      { user_admins: { $in: [req.params.user_id] } },
      { createdBy: req.params.user_id }
    ],
    status: { $in: status }
  };
  return Gig.find(matchCriteria)
    .exec()
    .then(gigs => {
      res.status(200).send({
        gigs: gigs
      });
    })
    .catch(error => {
      LogConfig.error(JSON.stringify(error));
      res.status(500).send({ error });
    });
});

exports.get_all_gigs_by_statuses = asyncMiddleware(async (req, res) => {
  let status = req.query.status.split(",");
  const matchCriteria = {
    status: { $in: status }
  };
  return Gig.find(matchCriteria)
    .exec()
    .then(gigs => {
      res.status(200).send({
        gigs: gigs
      });
    })
    .catch(error => {
      LogConfig.error(JSON.stringify(error));
      res.status(500).send({ error });
    });
});

exports.update_gig = function(req, res, next) {
  Gig.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err) {
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

exports.get_user_admins = asyncMiddleware(async (req, res) => {
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

exports.get_user_participants = asyncMiddleware(async (req, res) => {
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
        user_participants: gig_retrieved[0].user_participants
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

exports.get_users = asyncMiddleware(async (req, res) => {
  const matchCriteria = { $match: { _id: new ObjectID(req.params.id) } };
  return Gig.aggregate(gig_aggregation_with_users(matchCriteria))
    .exec()
    .then(gig_retrieved => {
      if (gig_retrieved === null) {
        return res.status(400).send({
          error: "Cannot find Gig of id " + req.params.id
        });
      }
      const user_admins = gig_retrieved[0].user_admins;
      const user_participants = gig_retrieved[0].user_participants;
      res.status(200).send({
        user_result: user_admins.concat(user_participants)
      });
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

exports.add_user_participant = asyncMiddleware(async (req, res) => {
  try {
    const validation_result = await user_validation(
      req.body.user_id,
      req.body.gig_name
    );
    if (validation_result.length !== 0) {
      throw `User is already a participants.`;
    }
    const authSetBot = getCachedApiAuth(req);
    const request_user = await User.find({ _id: req.body.user_id });

    if (request_user.length === 0) {
      //call rc, retrieve new user info
      const retrieved_user = await rc_controller.get_user_info(
        authSetBot,
        req.body.user_id
      );
      if (!retrieved_user.success) {
        throw `Unable to retrieve user from rocket chat db`;
      }

      const new_user = new User({
        _id: retrieved_user.user._id,
        username: retrieved_user.user.username,
        name: retrieved_user.user.name
      });

      const result = await new_user.save();
      if (!result) {
        throw `Unable to create new user in admin db, try again.`;
      }
    }

    const gig = await Gig.findOneAndUpdate(
      { name: req.body.gig_name },
      { $addToSet: { user_participants: req.body.user_id } }, //addToSet ensures no duplicate names in array
      { new: true }
    );

    if (gig == null) {
      throw "Cannot find Gig of id " + req.body.gig_name;
    }

    const room_id = gig.rc_channel_id._id;
    const user_id = req.body.user_id;

    const result = await rc_controller.add_user_participant(
      authSetBot,
      room_id,
      user_id
    );

    if (!result.success) {
      throw `Unable to add user ${user_id} to room ${room_id}`;
    }
    res.status(200).send(gig);
  } catch (error) {
    LogConfig.error(JSON.stringify(error));
    res.status(500).send({ error });
  }
});

exports.delete_user_participant = asyncMiddleware(async (req, res) => {
  return Gig.findOneAndUpdate(
    { _id: new ObjectID(req.params.id) },
    { $pullAll: { user_participants: [req.body.user_id] } }, //remove all instances of the user admin
    { new: true }, // return updated new array
    function(err, gig) {
      if (err || gig == null) {
        LogConfig.error(JSON.stringify(err));
        LogConfig.error(gig);
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

function gig_aggregation_with_users(matchCriteria) {
  return [
    matchCriteria,
    {
      $lookup: {
        from: "users",
        localField: "user_participants",
        foreignField: "_id",
        as: "user_participants"
      }
    },
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

async function user_validation(user_id, gig_name) {
  const matchCriteria = {
    $and: [
      {
        $or: [
          { user_admins: { $in: [user_id] } },
          { user_participants: { $in: [user_id] } }
        ]
      },
      { name: gig_name }
    ]
  };
  const validate_result = await Gig.find(matchCriteria);
  return validate_result;
}
