//@ts-check

//TODO: this is a copy from the bot project. Merge the two projects
const fetch = require("node-fetch");
const LogConfig = require("../log-config");

function url(name) {
  const { CSGIGS_ROCKET_API_URL } = process.env;
  return `${CSGIGS_ROCKET_API_URL}${name}`;
}

async function api(endPointUrl, method, authToken, userId, payload) {
  const headers = { "Content-Type": "application/json" };

  if (authToken) {
    headers["X-Auth-Token"] = authToken;
    headers["X-User-Id"] = userId;
  }
  try {
    const response = await fetch(endPointUrl, {
      method,
      body: payload ? JSON.stringify(payload) : undefined,
      headers
    });

    const result = await response.json();
    if (result.success === false) {
      LogConfig.error(
        `API ${endPointUrl} did not return success: ${JSON.stringify(result)}`
      );
    }
    return result;
  } catch (err) {
    return JSON.stringify(err);
  }
}

function get(name, authToken, userId, payload) {
  const esc = encodeURIComponent;
  const query = payload
    ? "?" +
      Object.keys(payload)
        .map(k => esc(k) + "=" + esc(payload[k]))
        .join("&")
    : "";

  const endPointUrl = `${url(name)}${query}`;
  return api(endPointUrl, "get", authToken, userId);
}

function post(name, authToken, userId, payload) {
  return api(url(name), "post", authToken, userId, payload);
}

async function loginAsBot() {
  const {
    CSGIGS_ROCKET_API_USER: user,
    CSGIGS_ROCKET_API_PASSWORD: password
  } = process.env;

  const response = await fetch(url("login"), {
    method: "post",
    body: JSON.stringify({ user, password }),
    headers: { "Content-Type": "application/json" }
  });

  const result = await response.json();
  if (result.status !== "success") {
    LogConfig.error(result);
    throw new Error("Bot authentication error");
  }

  const { authToken, userId } = result.data;
  return { authToken, userId };
}

// async function getMessage(msgId) {
//   const { authToken, userId } = await loginAsBot();

//   const { message } = await get("chat.getMessage", authToken, userId, {
//     msgId
//   });

//   return { message: message.msg };
// }

module.exports = { loginAsBot, get, post, url, api };
