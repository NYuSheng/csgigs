import { NotificationManager } from "react-notifications";
import UserProfile from "components/Gigs/Authentication/UserProfile";

export const login = function(payload, loadingCallback, redirectCallback) {
  loadingCallback(true);
  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(loginoutput => loginoutput.json())
    .then(data => {
      loadingCallback(false);
      if (data.error) {
        NotificationManager.error(data.error);
      } else {
        UserProfile.login(data.user);
        redirectCallback();
      }
    });
};
