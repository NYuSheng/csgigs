const User = require("../models/user.model");
const asyncMiddleware = require("../utils/asyncMiddleware");
const rc_controller = require("../controllers/rc.controller");

exports.user_create = function(req, res, next) {
  let user = new User({
    id: req.body.id,
    channelId: req.body.channelId,
    name: req.body.name,
    password: req.body.password,
    authToken: req.body.authToken
  });

  user.save(function(err) {
    if (err) {
      return next(err);
    }
    res.send("User Created successfully");
  });
};

exports.user_login = function(req, res, next) {
  const loginDetails = {
    user: req.body.username,
    password: req.body.password
  };

  rc_controller.rc_user_login(loginDetails, res);
};

exports.get_user_by_prefix = asyncMiddleware(async function(req, res, next) {
  try {
    const users_retrieved = await User.find({
      name: { $regex: ".*" + req.body.name + ".*", $options: "i" }
    });
    const users = users_retrieved.map(x => {
      return {
        _id: x._id,
        name: x.name,
        username: x.username
      };
    });

    res.status(200).send({
      users
    });
  } catch (error) {
    res.status(400).send({ error });
  }
});
