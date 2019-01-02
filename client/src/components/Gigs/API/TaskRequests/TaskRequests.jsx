import UserProfile from "components/Gigs/Authentication/UserProfile";
import {publishMessage} from "components/Gigs/API/RocketChat/RocketChat";
import {update} from "components/Gigs/API/Tasks/Tasks";
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
                    task.setState({
                        approvals: json.task_requests
                    })
                });
            }
        });
    }
};

export const approval = function(payload) {
    fetch(`/admin-ui/api/task_requests/${payload.taskRequestId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            status: payload.status,
        })
    }).then(data => {
        if (data.status === 200) {
            publishMessage(buildPublishMessage(payload));
            if (payload.status === "Approved") {
                payload.assignedUsers.push(payload.user);
                const updateTaskPayload = {
                    users_assigned: payload.assignedUsers.map(user => user._id)
                };
                update(payload.taskId, updateTaskPayload, null);
            }
            NotificationManager.success(payload.user.name + " has been " + payload.status + ".");
        } else {
            data.json().then(json =>{
                NotificationManager.error(json.error.errmsg);
            });
        }
    });
};

function buildPublishMessage (payload) {
    const publishPayload = {};

    publishPayload["message"] = "Approval for " + payload.user.name + " for task " +
        payload.taskName + " has been " + payload.status;
    publishPayload["roomId"] = payload.roomId;

    return publishPayload;
};