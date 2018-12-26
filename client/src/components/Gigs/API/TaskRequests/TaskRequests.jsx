import UserProfile from "components/Gigs/Authentication/UserProfile";
import {publishMessage} from "components/Gigs/API/RocketChat/RocketChat";
import {NotificationManager} from "react-notifications";

export const listen = function(task) {
    const {taskId} = task.state;
    if (taskId) {
        fetch(`/admin-ui/api/task_requests/${taskId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    NotificationManager.error(json.error.errmsg);
                });
            } else {
                data.json().then(json => {
                    if (task.mounted) {
                        task.setState({
                            approvals: json.task_requests
                        })
                    }
                });
            }
        });
    }
};

export const reject = function(payload) {
    fetch(`/admin-ui/api/task_requests/${payload.taskRequestId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            status: "Rejected",
        })
    }).then(data => {
        if (data.status === 200) {
            publishMessage(buildPublishMessage(payload));
            NotificationManager.success(payload.user_name + " has been rejected.");
        } else {
            data.json().then(json =>{
                NotificationManager.error(json.error.errmsg);
            });
        }
    });
};

function buildPublishMessage (payload) {
    const authSet = UserProfile.getAuthSet();
    const publishPayload = {};

    publishPayload["message"] = "Approval for " + payload.user_name + " for task " +
        payload.taskName + " has been " + payload.status;
    publishPayload["roomId"] = payload.roomId;
    publishPayload["XAuthToken"] = authSet.token;
    publishPayload["XUserId"] = authSet.userId;

    return publishPayload;
};