import UserProfile from "components/Gigs/Authentication/UserProfile";
import {NotificationManager} from "react-notifications";

const GigActions = (function() {

    var cancel = function(gig, cancelGig, resetGigAction) {
        fetch(`/admin-ui/api/gigs/cancel/${gig._id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    NotificationManager.error(json.error.errmsg);
                });
            } else {
                gig.status = "Cancelled";
                cancelGig(gig);
            }
            resetGigAction();
        });
    }

    var publish = function(gig, notifyGigChannelUpdate) {
        const authSet = UserProfile.getAuthSet();
        fetch('https://csgigs.com/api/v1/channels.create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': authSet.token,
                'X-User-Id': authSet.userId
            },
            body: JSON.stringify(buildPayLoad(gig))
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    var errorMsg = json.error || json.message;
                    NotificationManager.error(errorMsg);
                });
            } else {
                data.json().then(json => {
                    console.log(json);
                    updateGigChannel(json, gig, notifyGigChannelUpdate);
                });
            }
        });
    }

    var updateGigChannel = function(payload, gig, notifyGigChannelUpdate) {
        const update = {
            rc_channel_id: payload.channel.name
        }
        fetch(`/admin-ui/api/gigs/update/${gig._id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(update)
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    NotificationManager.error(json.error.errmsg);
                });
            } else {
                gig.rc_channel_id = update.rc_channel_id;
                notifyGigChannelUpdate(gig)
            }
        });
    }

    var buildPayLoad = function(gig) {
        var payload = {};
        payload["name"] = gig.name.replace(/ /g, '');
        return payload;
    }

    return {
        publish: publish,
        cancel: cancel
    }

})();

export default GigActions;