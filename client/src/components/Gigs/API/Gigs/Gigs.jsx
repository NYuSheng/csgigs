import { NotificationManager } from "react-notifications";
import UserProfile from "components/Gigs/Authentication/UserProfile";
import {
  setRoomToReadOnly,
  publishMessage
} from "components/Gigs/API/RocketChat/RocketChat";

export const create = function(step, callback) {
  const gigCreator = UserProfile.getUser();
  const authSet = UserProfile.getAuthSet();
  step.selectedAdmins.push(gigCreator.me);
  fetch("/admin-ui/api/gigs/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": authSet.token,
      "x-user-id": authSet.userId
    },
    body: JSON.stringify({
      name: step.name,
      description: step.gigDescription,
      points_budget: step.budget,
      status: "Draft",
      user_admins: step.selectedAdmins,
      photo: step.gigImage
    })
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
    } else {
      data.json().then(json => {
        callback(json.gig);
      });
    }
  });
};

export const getUserGigs = function(loadingCallback, gigsCallback, status) {
  const user = UserProfile.getUser();
  loadingCallback(true);

  if (user.me.roles.includes("admin")) {
    const url = `/admin-ui/api/gigs/get_all_gigs?status=${status}`;
    getGigs(loadingCallback, gigsCallback, status, url);
  } else {
    const url = `/admin-ui/api/gigs/${user.me._id}?status=${status}`;
    getGigs(loadingCallback, gigsCallback, status, url);
  }
};

export const getGigs = function(loadingCallback, gigsCallback, status, url) {
  const user = UserProfile.getUser();
  console.log(url);
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
    } else {
      data.json().then(json => {
        gigsCallback(json.gigs);
      });
    }
    loadingCallback(false);
  });
};

export const getUserGig = function(gigId, gigsCallback) {
  const user = UserProfile.getUser();
  fetch(`/admin-ui/api/gigs/${user.me._id}/${gigId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
    } else {
      data.json().then(json => {
        gigsCallback(json.gig);
      });
    }
  });
};

export const getGigUsers = function(gigId, callback) {
  fetch(`/admin-ui/api/gigs/${gigId}/getUsers`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
    } else {
      data.json().then(json => {
        callback(json.user_result);
      });
    }
  });
};

export const update = function(gigId, payload, statusCallback) {
  const user = UserProfile.getUser();
  if (statusCallback) statusCallback("loading");
  fetch(`/admin-ui/api/gigs/${user.me._id}/${gigId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
      if (statusCallback) statusCallback("working");
    } else {
      if (statusCallback) statusCallback("success");
    }
  });
};

export const cancel = function(gigId, gigRoomId, payload, statusCallback) {
  const user = UserProfile.getUser();
  if (statusCallback) statusCallback("loading");
  fetch(`/admin-ui/api/gigs/${user.me._id}/${gigId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
      if (statusCallback) statusCallback("working");
    } else {
      publishMessage(buildPublishMessage(gigRoomId, payload.status));
      setRoomToReadOnly(gigRoomId);
      if (statusCallback) statusCallback("success");
    }
  });
};

export const complete = function(gigId, gigRoomId, payload, statusCallback) {
  const user = UserProfile.getUser();
  if (statusCallback) statusCallback("loading");
  fetch(`/admin-ui/api/gigs/${user.me._id}/${gigId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
      if (statusCallback) statusCallback("working");
    } else {
      publishMessage(buildPublishMessage(gigRoomId, payload.status));
      if (statusCallback) statusCallback("success");
    }
  });
};

function buildPublishMessage(gigRoomId, status) {
  return {
    roomId: gigRoomId,
    message: "_This gig has been " + status + "_"
  };
}
