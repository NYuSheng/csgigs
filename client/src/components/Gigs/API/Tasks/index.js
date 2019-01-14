import { NotificationManager } from "react-notifications";
import { publishMessage } from "components/Gigs/API/RocketChat/RocketChat";

const fetchOptions = method => {
  return {
    method,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  };
};

export const getTasks = async function(gigId) {
  const response = await fetch(
    `/admin-ui/api/tasks/getTasksByGig/${gigId}`,
    fetchOptions()
  );
  const json = await response.json();

  if (response.status !== 200) {
    NotificationManager.error(json.error.errmsg);
    throw response.status;
  }

  return json.tasks;
};

export const getTasksForUser = async function(gigId, userId) {
  const response = await fetch(
    `/admin-ui/api/tasks/getTasksByGig/${gigId}/${userId}`,
    fetchOptions()
  );
  const json = await response.json();
  return json.tasks;
};

export const update = function(taskId, payload, statusCallback) {
  if (statusCallback) statusCallback("loading");
  fetch(`/admin-ui/api/tasks/${taskId}`, {
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

export const add = function(gigRoomId, gigId, state, statusCallback) {
  if (statusCallback) statusCallback("loading");
  fetch("/admin-ui/api/tasks/addTask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildTaskPayload(gigId, state))
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
      if (statusCallback) statusCallback("working");
    } else {
      data.json().then(json => {
        const task = json.task;
        publishMessage(buildTaskPublishMessage(gigRoomId, task));
      });
      if (statusCallback) statusCallback("success");
    }
  });
};

export const remove = function(gigRoomId, taskId, taskName, statusCallback) {
  if (statusCallback) statusCallback("loading");
  fetch(`/admin-ui/api/tasks/removeTask/${taskId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }).then(data => {
    if (data.status !== 200) {
      data.json().then(json => {
        NotificationManager.error(json.error.errmsg);
      });
      if (statusCallback) statusCallback("working");
    } else {
      // publish message to remove task

      if (statusCallback) statusCallback("success");
    }
  });
};

function buildTaskPublishMessage(roomId, task) {
  const message = `New Task!
**${task.task_name}** (${task._id})
Description: ${task.task_description}
Reply "volunteer" to volunteer for this task.`;

  return { message, roomId };
}

function buildTaskPayload(gigId, state) {
  return {
    gig_id: gigId,
    task_name: state.taskName,
    task_category: state.taskCategory,
    task_description: state.taskDescription
  };
}
