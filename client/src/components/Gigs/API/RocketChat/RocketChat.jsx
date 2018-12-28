import {NotificationManager} from "react-notifications";

export const publishMessage = function (payload) {
    // const authSet = UserProfile.getAuthSet();

    fetch(`/admin-ui/api/rc/publish_message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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