const api = require("../utils/api");
const LogConfig = require("../log-config");
const asyncMiddleware = require("../utils/asyncMiddleware");

const getCachedApiAuth = request => request.app.locals.apiAuth;

exports.rc_user_login = async function(body, res) {
  const data = await api.post("login", null, null, body);

  if (data.status !== "success") {
    LogConfig.stream.write("Failed login attempt");
    return res.status(401).send({
      error: "Incorrect username/password"
    });
  }

  res.status(200).send({
    user: data.data
  });
};

exports.set_read_only_channel = asyncMiddleware(async function(req, res, next) {
  const authSetBot = getCachedApiAuth(req);

  const result = await api.post(
    "channels.setReadOnly",
    authSetBot.authToken,
    authSetBot.userId,
    {
      roomId: req.body.roomId,
      readOnly: req.body.readOnly
    }
  );

  if (!result.success) {
    return res.status(500).send({
      error: "Unable to set channel to Read-Only"
    });
  }

  res.sendStatus(200);
});

exports.create_group = async function(authSetBot, name, members) {
  const result = await api.post(
    "groups.create",
    authSetBot.authToken,
    authSetBot.userId,
    {
      name,
      members
    }
  );

  return result.success && result.group ? result.group : null;
};

exports.add_owners_to_group = async function(authSetBot, gigOwners, groupId) {
  const calls = [];
  if (!gigOwners.length) {
    LogConfig.info("No users to add as the owner. Ignoring.");
    return Promise.resolve();
  }
  for (let gigOwner of gigOwners) {
    const call = addOwnerToGroup(authSetBot, gigOwner, groupId);
    calls.push(call);
  }
  return Promise.all(calls)
    .then(() => Promise.resolve({ success: true }))
    .catch(error => Promise.resolve(error));
};

exports.set_group_type = async function(req, res) {
  const authSetBot = getCachedApiAuth(req);
  const data = await api.post(
    "groups.setType",
    authSetBot.authToken,
    authSetBot.userId,
    {
      roomId: req.body.roomId,
      type: req.body.type
    }
  );

  if (!data.success) {
    return res.status(500).send({
      error: "Unable to set group to " + req.body.type
    });
  }

  res.status(200).send({
    group: data.group
  });
};

exports.publish_message = async function(req, res) {
  const authSetBot = getCachedApiAuth(req);
  const data = await api.post(
    "chat.postMessage",
    authSetBot.authToken,
    authSetBot.userId,
    {
      roomId: req.body.roomId,
      text: req.body.message
    }
  );

  if (!data.success) {
    return res.status(500).send({
      error: "Unable to publish message to " + req.body.roomId
    });
  }
  res.status(200).send({
    message: data.message
  });
};

exports.publishMessageWithReplyOptions = asyncMiddleware(async function(
  req,
  res
) {
  const authSetBot = getCachedApiAuth(req);
  const data = await api.post(
    "chat.postMessage",
    authSetBot.authToken,
    authSetBot.userId,
    {
      roomId: req.body.roomId,
      text: req.body.message,
      attachments: [
        {
          title: req.body.optionsTitle,
          collapsed: false,
          actions: req.body.replyOptions.map(x => ({
            type: "button",
            text: x.label,
            msg: x.reply,
            msg_in_chat_window: true
          }))
        }
      ]
    }
  );

  if (!data.success) {
    return res.status(500).send({
      error: "Unable to publish message to " + req.body.roomId
    });
  }
  res.status(200).send({
    message: data.message
  });
});

exports.publishBroadcastMessage = async function(authSetBot, roomId, text) {
  const result = await api.post(
    "chat.postMessage",
    authSetBot.authToken,
    authSetBot.userId,
    {
      roomId,
      text
    }
  );

  return result.success;
};

exports.add_user_participant = function(authSetBot, roomId, userId) {
  return api.post("groups.invite", authSetBot.authToken, authSetBot.userId, {
    roomId,
    userId
  });
};

exports.kick_user = function(authSetBot, roomId, userId) {
  return api.post("groups.kick", authSetBot.authToken, authSetBot.userId, {
    roomId,
    userId
  });
};

exports.kick_user = async function(req, res) {
  const authSetBot = getCachedApiAuth(req);
  const data = await api.post(
    "groups.kick",
    authSetBot.authToken,
    authSetBot.userId,
    {
      roomId: req.body.roomId,
      userId: req.body.userId
    }
  );

  if (!data.success) {
    return res.status(500).send({
      error: "Unable to kick " + req.body.userId
    });
  }
  res.status(200).send({
    success: data.success
  });
};

exports.get_user_info = function(authSetBot, userId) {
  return api.get("users.info", authSetBot.authToken, authSetBot.userId, {
    userId
  });
};

async function addOwnerToGroup(authSetBot, userId, roomId) {
  const result = await api.post(
    "groups.addOwner",
    authSetBot.authToken,
    authSetBot.userId,
    {
      userId,
      roomId
    }
  );

  if (!result.success) {
    throw {
      success: false,
      userId,
      roomId
    };
  }
}

exports.remove_owner_from_group = async function(req, res) {
  const authSetBot = getCachedApiAuth(req);
  const data = await api.post(
    "groups.removeOwner",
    authSetBot.authToken,
    authSetBot.userId,
    {
      roomId: req.body.roomId,
      userId: req.body.userId
    }
  );

  if (!data.success) {
    return res.status(500).send({
      error: "Unable to remove " + req.body.userId + " as owner"
    });
  }
  res.status(200).send({
    success: data.success
  });
};
