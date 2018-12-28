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

  const headers = get_headers(req.body);
  rc_set_read_only_channel(headers, body, res);
};

exports.create_group = function(auth_set, name, members) {
  const body = {
    name,
    members
  };
  const headers = get_headers(auth_set);
  return rc_create_group(headers, body);
};

exports.add_owners_to_group = function(rc_group_id, gig_owners, auth_set) {
  const headers = get_headers(auth_set);
  gig_owners.forEach(gig_owner => {
    const body = {
      roomId: rc_group_id,
      userId: gig_owner
    };
    rc_add_owner_to_group(headers, body);
  });
};

exports.set_group_type = function(req, res) {
  const headers = get_headers(req.body);
  const body = {
    roomId: req.body.roomId,
    type: req.body.type
  };
  rc_set_group_type(headers, body, res);
};

function get_headers(input) {
  return {
    "Content-Type": "application/json",
    "X-Auth-Token": input.XAuthToken,
    "X-User-Id": input.XUserId
  };
}

exports.publish_message = function(req, res) {
  const headers = get_headers(req.body);
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

function rc_add_owner_to_group(headers, body) {
  fetch("https://csgigs.com/api/v1/groups.addOwner", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(output => output.json())
    .then(data => {
      if (!data.success) {
        console.log("Unable to add owner to group");
      }
    });
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

async function rc_create_group(headers, body) {
  const response = await fetch("https://csgigs.com/api/v1/groups.create", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!data.success) {
    console.log("Unable to create group");
    return null;
  } else {
    return data.group;
  }
}
