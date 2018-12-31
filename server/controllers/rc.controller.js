const fetch = require("node-fetch");

exports.rc_user_login = function(body, res) {
  fetch("https://csgigs.com/api/v1/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(loginoutput => loginoutput.json())
    .then(data => {
      if (data.status !== "success") {
        res.status(400).send({
          error: "Incorrect username/password"
        });
      } else {
        res.status(200).send({
          user: data.data
        });
      }
    });
};

exports.set_read_only_channel = function(req, res, next) {
  const body = {
    roomId: req.body.roomId,
    readOnly: req.body.readOnly
  };

  const headers = get_headers(req.headers);
  rc_set_read_only_channel(headers, body, res);
};

exports.create_group = async function(auth_set, name, members) {
  const body = {
    name,
    members
  };
  const headers = get_headers(auth_set);
  const response = await fetch("https://csgigs.com/api/v1/groups.create", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  });
  const data = await response.json();
  return data.success ? data.group : null;
};

exports.add_owners_to_group = async function(groupId, gigOwners, authSet) {
  const headers = get_headers(authSet);
  const calls = [];
  if (!gigOwners.length) {
    return Promise.resolve();
  }
  for (let gigOwner of gigOwners) {
    const body = {
      roomId: groupId,
      userId: gigOwner
    };
    const call = rc_add_owner_to_group(headers, body);
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

exports.publish_broadcast_message = function(room_id, message, auth_set) {
  const headers = get_headers(auth_set);
  const body = {
    roomId: room_id,
    text: message
  };

  fetch("https://csgigs.com/api/v1/chat.postMessage", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(output => output.json())
    .then(data => {
      if (!data.success) {
      }
    });
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

async function rc_add_owner_to_group(headers, body) {
  const response = await fetch("https://csgigs.com/api/v1/groups.addOwner", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!data.success) {
    throw {
      success: false,
      userId: body.userId,
      roomId: body.roomId
    };
  }
  return { success: true };
}

function rc_set_read_only_channel(headers, body, res) {
  fetch("https://csgigs.com/api/v1/channels.setReadOnly", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(output => output.json())
    .then(data => {
      if (!data.success) {
        res.status(400).send({
          error: "Unable to set channel to Read-Only"
        });
      } else {
        res.status(200).send();
      }
    });
}
