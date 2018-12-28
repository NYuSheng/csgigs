import { NotificationManager } from "react-notifications";

export const getUserParticipantsByGigId = function(gigId, callback) {
  fetch(`/admin-ui/api/gigs/${gigId}/getUserParticipants`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
    } else {
      data.json().then(json => {
        callback(json.user_participants);
      });
    }
  });
};
