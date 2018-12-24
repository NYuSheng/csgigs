import UserProfile from "components/Gigs/Authentication/UserProfile";
import {NotificationManager} from "react-notifications";

const GigActions = (function () {

    var cancel = function (gig, cancelGig, resetGigAction) {
        const user = UserProfile.getUser();
        const cancelPayload = {
            status: "Cancelled"
        };

        fetch(`/admin-ui/api/gigs/${user.me.username}/${gig._id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cancelPayload)
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    NotificationManager.error(json.error.errmsg);
                });
            } else {
                gig.status = "Cancelled";
                if (gig.rc_channel_id) {
                    setChannelToReadOnly(gig.rc_channel_id._id);
                }
                cancelGig(gig);
            }
            resetGigAction();
        });
    }

    var setChannelToReadOnly = function (gigChannelId) {
        const authSet = UserProfile.getAuthSet();
        const setReadOnlyPayload = {
            roomId: gigChannelId,
            readOnly: true,
            XAuthToken: authSet.token,
            XUserId: authSet.userId
        };

        fetch(`/admin-ui/api/rc/readOnly`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(setReadOnlyPayload)
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    NotificationManager.error(json.error.errmsg);
                });
            }
        });
    }

    var complete = function (gig, completeGig) {
        const user = UserProfile.getUser();
        const completion = {
            status: "Completed",
        };
        fetch(`/admin-ui/api/gigs/${user.me.username}/${gig._id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(completion)
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    NotificationManager.error(json.error.errmsg);
                });
            } else {
                gig.status = completion.status;
                completeGig(gig);
            }
        });
    }

    var publish = function (gig, notifyGigChannelUpdate) {
        const authSet = UserProfile.getAuthSet();
        const publishPayload = {
            name: gig.name.replace(/ /g, '_'),
            members: gig.user_admins.map(admin => admin.name),
            XAuthToken: authSet.token,
            XUserId: authSet.userId
        };

        fetch(`/admin-ui/api/rc/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(publishPayload)
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    NotificationManager.error(json.error.errmsg);
                });
            } else {
                data.json().then(json => {
                    console.log(json);
                    // updateGigChannel(json, gig, notifyGigChannelUpdate);
                });
            }
        });

        // fetch('https://csgigs.com/api/v1/channels.create', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-Auth-Token': authSet.token,
        //         'X-User-Id': authSet.userId
        //     },
        //     body: JSON.stringify(buildPayLoad(gig))
        // }).then(data => {
        //     if (data.status !== 200) {
        //         data.json().then(json => {
        //             var errorMsg = json.error || json.message;
        //             NotificationManager.error(errorMsg);
        //         });
        //     } else {
        //
        //     }
        // });
    }

    var updateGigChannel = function (payload, gig, notifyGigChannelUpdate) {
        const user = UserProfile.getUser();
        const update = {
            status: "Active",
            rc_channel_id: payload.channel
        }
        fetch(`/admin-ui/api/gigs/${user.me.username}/${gig._id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(update)
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    NotificationManager.error(json.error.errmsg);
                });
            } else {
                gig.status = update.status;
                gig.rc_channel_id = update.rc_channel_id;
                notifyGigChannelUpdate(gig)
            }
        });
    }

    var buildPayLoad = function (gig) {
        var payload = {};
        payload["name"] = gig.name.replace(/ /g, '');
        return payload;
    }

    return {
        publish: publish,
        cancel: cancel,
        complete: complete
    }

})();

export default GigActions;