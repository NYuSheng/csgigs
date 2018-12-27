import {NotificationManager} from "react-notifications";
import UserProfile from "components/Gigs/Authentication/UserProfile";
import {publishMessage} from "components/Gigs/API/RocketChat/RocketChat";

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
};

export const add = function(gig, state, statusCallback) {
    statusCallback("loading");
    fetch('/admin-ui/api/tasks/addTask', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(buildTaskPayload(gig, state))
    }).then(data => {
        if (data.status !== 200) {
            data.json().then(json => {
                NotificationManager.error(json.error.errmsg);
            });
            statusCallback("working");
        } else {
            data.json().then(json => {
                const task = json.task;
                gig.tasks.push(task);
                publishMessage(buildPublishMessage(gig, task));
            });
            statusCallback("success");
        }
    });
};
function buildPublishMessage (gig, task) {
    const authSet = UserProfile.getAuthSet();
    const publishPayload = {};

    publishPayload["message"] = "" +
        "*New Task!*\nTask Id: " + task._id +
        "\nTask Name: " + task.task_name +
        "\n Task Description: " + task.task_description +
        "\nReply to volunteer for this task.";
    publishPayload["roomId"] = gig.rc_channel_id._id;
    publishPayload["XAuthToken"] = authSet.token;
    publishPayload["XUserId"] = authSet.userId;

    return publishPayload;
};

function buildTaskPayload(gig, state) {
    var payload = {};
    payload["gig_name"] = gig.name;
    payload["task_name"] = state.taskName;
    payload["task_category"] = state.taskCategory;
    payload["task_description"] = state.taskDescription;
    return payload;
}