const fetch = require('node-fetch');

exports.set_read_only = function (req, res, next) {
    const body = {
        roomId: req.body.roomId,
        readOnly: req.body.readOnly,
    };

    const headers = get_headers(req.body);
    rc_set_read_only(headers, body, res);
};

exports.create_group = function (payload, auth_set) {
    const body = {
        name: payload.name,
        members: payload.user_admins,
    };
    const headers = get_headers(auth_set);
    return rc_create_group(headers, body);
};

exports.add_owners_to_group = function (rc_group_id, gig_owners, auth_set) {
    const headers = get_headers(auth_set);
    gig_owners.forEach(gig_owner => {
        const body = {
            roomId: rc_group_id,
            userId: gig_owner,
        };
        rc_add_owner_to_group(headers, body);
    });
};

function get_headers(input) {
    return {
        'Content-Type': 'application/json',
        'X-Auth-Token': input.XAuthToken,
        'X-User-Id': input.XUserId
    };
}

function rc_add_owner_to_group(headers, body) {
    fetch('https://csgigs.com/api/v1/groups.addOwner', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    }).then(output => output.json()).then(data => {
        if (!data.success) {
            console.log('Unable to add owner to group');
        }
    });
}

function rc_set_read_only(headers, body, res) {
    fetch('https://csgigs.com/api/v1/channels.setReadOnly', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    }).then(output => output.json()).then(data => {
        if (!data.success) {
            res.status(400).send({
                error: 'Unable to set channel to Read-Only'
            });
        } else {
            res.status(200).send();
        }
    });
}

async function rc_create_group(headers, body) {
    const response = await fetch('https://csgigs.com/api/v1/groups.create', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!data.success) {
        console.log('Unable to create group');
        return null;
    } else {
        return data.group;
    }
}

