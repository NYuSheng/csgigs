import {NotificationManager} from "react-notifications";
import UserProfile from "components/Gigs/Authentication/UserProfile";

export const create = function (step, callback) {
    const gigCreator = UserProfile.getUser();
    const authSet = UserProfile.getAuthSet();
    step.selectedAdmins.push(gigCreator.me);
    fetch('/admin-ui/api/gigs/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user: gigCreator.me.name,
            name: step.name,
            description: step.gigDescription,
            points_budget: step.budget,
            status: "Draft",
            user_admins: step.selectedAdmins,
            photo: step.gigImage,
            XAuthToken: authSet.token,
            XUserId: authSet.userId
        })
    }).then(data => {
        if (data.status !== 200) {
            data.json().then(json =>{
                NotificationManager.error(json.error.errmsg);
            });
        } else {
            data.json().then(json =>{
                callback(json.gig);
            });
        }
    });
};

export const getUserGigs = function (loadingCallback, gigsCallback) {
    const user = UserProfile.getUser();
    loadingCallback(true);
    fetch(`/admin-ui/api/gigs/${user.me._id}?status=Draft,Active`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(data => {
        if (data.status !== 200) {
            data.json().then(json =>{
                NotificationManager.error(json.error.errmsg);
            });
        } else {
            data.json().then(json =>{
                gigsCallback(json.gigs);
            });
        }
        loadingCallback(false);
    });
};

export const getUserGig = function (gigId, gigsCallback) {
    const user = UserProfile.getUser();
    fetch(`/admin-ui/api/gigs/${user.me._id}/${gigId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(data => {
        if (data.status !== 200) {
            data.json().then(json => {
                NotificationManager.error(json.error.errmsg);
            });
        } else {
            data.json().then(json => {
                gigsCallback(json.gig);
            });
        }
    });
};

export const update = function (gigId, payload, statusCallback) {
    const user = UserProfile.getUser();
    if (statusCallback) statusCallback("loading");
    fetch(`/admin-ui/api/gigs/${user.me._id}/${gigId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
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