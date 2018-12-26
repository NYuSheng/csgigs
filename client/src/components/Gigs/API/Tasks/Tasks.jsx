import {NotificationManager} from "react-notifications";

export const update = function(taskId, payload) {
    fetch(`/admin-ui/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    }).then(data => {
        if (data.status !== 200) {
            data.json().then(json => {
                NotificationManager.error(json.error.errmsg);
            });
        }
    });
}