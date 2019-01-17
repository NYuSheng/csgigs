import { NotificationManager } from "react-notifications";
import { publishMessageWithReplyOptions } from "components/Gigs/API/RocketChat/RocketChat";

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

export const add = async function(gigRoomId, gigId, state, statusCallback) {
  if (statusCallback) statusCallback("loading");
  const data = await fetch("/admin-ui/api/tasks/addTask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildTaskPayload(gigId, state))
  });

  const json = await data.json();
  if (data.status !== 200) {
    NotificationManager.error(json.error.errmsg);
    //TODO: should this be error?
    if (statusCallback) statusCallback("working");
    return;
  }

  const task = json.task;
  publishMessageWithReplyOptions(
    buildTaskPublishMessageWithReply(gigRoomId, task)
  );
  if (statusCallback) statusCallback("success");
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

function buildTaskPublishMessageWithReply(roomId, task) {
  const message = `A new task **${task.task_name}** in category *${
    task.task_category
  }* has been created.
  _${task.task_description}_`;

  const optionsTitle = "Please click volunteer if you can help";
  const replyOptions = [
    {
      label: "Volunteer",
      reply: `I would like to volunteer for **${task.task_name}** (${task._id})`
    }
  ];

  return { message, roomId, optionsTitle, replyOptions };
}

function buildTaskPayload(gigId, state) {
  return {
    gig_id: gigId,
    task_name: state.taskName,
    task_category: state.taskCategory,
    task_description: state.taskDescription
  };
}
