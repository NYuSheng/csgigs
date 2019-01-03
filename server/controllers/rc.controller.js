const fetch = require("node-fetch");
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
    return res.status(400).send({
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

  return result.group ? result.group : null;
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

exports.set_group_type = function(req, res) {
  const headers = get_headers(req.headers);
  const body = {
    roomId: req.body.roomId,
    type: req.body.type
  };
  rc_set_group_type(headers, body, res);
};

function get_headers(input) {
  return {
    "Content-Type": "application/json",
    "X-Auth-Token": input["x-auth-token"],
    "X-User-Id": input["x-user-id"]
  };
}

exports.publish_message = function(req, res) {
  const headers = get_headers(req.headers);
  const body = {
    roomId: req.body.roomId,
    text: req.body.message
  };

  rc_publish_message(headers, body, res);
};

function rc_publish_message(headers, body, res) {
  fetch("https://csgigs.com/api/v1/chat.postMessage", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(output => output.json())
    .then(data => {
      if (!data.success) {
        res.status(400).send({
          error: "Unable to publish message to " + body.roomId
        });
      } else {
        res.status(200).send({
          message: data.message
        });
      }
    });
}

exports.publishBroadcastMessage = async function(authSetBot, roomId, text) {
  const payload = {
    roomId,
    text
  };

  const result = await api.post(
    "chat.postMessage",
    authSetBot.authToken,
    authSetBot.userId,
    payload
  );

  return result.success;
};

exports.add_user_participant = async function(authSetBot, roomId, userId) {
  const payload = {
    roomId,
    userId
  };

  return await api.post(
    "groups.invite",
    authSetBot.authToken,
    authSetBot.userId,
    payload
  );
};

function rc_set_group_type(headers, body, res) {
  fetch("https://csgigs.com/api/v1/groups.setType", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(output => output.json())
    .then(data => {
      if (!data.success) {
        res.status(400).send({
          error: "Unable to set group to " + body.type
        });
      } else {
        res.status(200).send({
          group: data.group
        });
      }
    });
}

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
