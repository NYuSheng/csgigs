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
        NotificationManager.error(json.error.errmsg);
      });
    }
  });
};

export const publishMessageWithReplyOptions = async function(payload) {
  const authSet = UserProfile.getAuthSet();
  const response = await fetch(`/admin-ui/api/rc/publish-replyable-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": authSet.token,
      "x-user-id": authSet.userId
    },
    body: JSON.stringify(payload)
  });

  if (response.status !== 200) {
    const json = await response.json();
    NotificationManager.error(json.error.errmsg);
  }
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
        NotificationManager.error(json.error.errmsg);
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
        NotificationManager.error(json.error.errmsg);
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

export const kick_user = async function(gigRoomId, userId) {
  const authSet = UserProfile.getAuthSet();
  const kickUserPayload = {
    roomId: gigRoomId,
    userId: userId
  };

  fetch(`/admin-ui/api/rc/kick_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": authSet.token,
      "x-user-id": authSet.userId
    },
    body: JSON.stringify(kickUserPayload)
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
    } else {
      data.json().then(json => {
        return json.success;
      });
    }
  });
};

export const remove_owner_from_group = async function(gigRoomId, userId) {
  const authSet = UserProfile.getAuthSet();
  const kickUserPayload = {
    roomId: gigRoomId,
    userId: userId
  };

  fetch(`/admin-ui/api/rc/remove_owner_from_group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": authSet.token,
      "x-user-id": authSet.userId
    },
    body: JSON.stringify(kickUserPayload)
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
    } else {
      data.json().then(json => {
        return json.success;
      });
    }
  });
};
