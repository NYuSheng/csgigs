const fetch = require('node-fetch');

exports.set_read_only = function (req, res, next) {
    const body = {
        roomId: req.body.roomId,
        readOnly: req.body.readOnly,
    };

    const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': req.body.XAuthToken,
        'X-User-Id': req.body.XUserId
    };

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
    })
};

