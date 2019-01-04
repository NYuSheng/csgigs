import { NotificationManager } from "react-notifications";
import { publishMessage } from "components/Gigs/API/RocketChat/RocketChat";

export const getGigAllocations = function(gigId, callback) {
  fetch(`/admin-ui/api/points/gigs/${gigId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
    } else {
      data.json().then(json => {
        callback(json.gig_points_record);
      });
    }
  });
};

export const assignPointsToUser = function(
  user,
  gigId,
  points,
  gigRoomId,
  callback,
  statusCallback
) {
  statusCallback("loading");
  const assignPointsPayload = {
    gig_id: gigId,
    points: points
  };

  fetch(`/admin-ui/api/points/${user._id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignPointsPayload)
  }).then(data => {
    statusCallback("success");
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
    } else {
      NotificationManager.success("Points allocated");
      publishMessage({
        message: `_${points} points have been allocated to ${user.name}_`,
        roomId: gigRoomId
      });
      callback(user._id, points);
    }
  });
};
