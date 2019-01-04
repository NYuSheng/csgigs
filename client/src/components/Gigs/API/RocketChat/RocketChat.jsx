import { NotificationManager } from "react-notifications";
import UserProfile from "components/Gigs/Authentication/UserProfile";
import { update } from "components/Gigs/API/Gigs/Gigs";

export const publishMessage = function(payload) {
  const authSet = UserProfile.getAuthSet();
  fetch(`/admin-ui/api/rc/publish_message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": authSet.token,
      "x-user-id": authSet.userId
    },
    body: JSON.stringify(payload)
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error);
      });
    }
  });
};

export const setRoomToReadOnly = function(gigRoomId) {
  const authSet = UserProfile.getAuthSet();
  const setReadOnlyPayload = {
    roomId: gigRoomId,
    readOnly: true
  };

  fetch(`/admin-ui/api/rc/set_read_only_channel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": authSet.token,
      "x-user-id": authSet.userId
    },
    body: JSON.stringify(setReadOnlyPayload)
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error);
      });
    }
  });
};

export const setRoomTypeToPublic = function(gigId, gigRoomId, statusCallback) {
  const authSet = UserProfile.getAuthSet();
  const publishPayload = {
    roomId: gigRoomId,
    type: "c"
  };

  fetch(`/admin-ui/api/rc/set_group_type`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": authSet.token,
      "x-user-id": authSet.userId
    },
    body: JSON.stringify(publishPayload)
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error);
      });
    } else {
      data.json().then(json => {
        const updatePayload = {
          status: "Active",
          rc_channel_id: json.group
        };
        update(gigId, updatePayload, statusCallback);
      });
    }
  });
};
