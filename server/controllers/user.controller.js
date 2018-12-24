const User = require('../models/user.model');
const fetch = require('node-fetch');

exports.user_create = function (req, res, next) {
    let user = new User(
        {
            id: req.body.id,
            channelId:req.body.channelId,
            name: req.body.name,
            password: req.body.password,
            authToken: req.body.authToken
        }
    );

    user.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('User Created successfully')
    })
};

exports.user_login = function (req, res, next) {
    const loginDetails = {
        user: req.body.username,
        password: req.body.password
    }
    fetch('https://csgigs.com/api/v1/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(loginDetails)
    }).then(loginoutput => loginoutput.json()).then(data => {
        if (data.status !== "success") {
            res.status(400).send({
                error: 'Incorrect username/password'
            });
        } else {
            res.status(200).send({
                user: data.data
            });
        }
    })
};

exports.get_user_by_prefix = function (req, res, next) {
    return User.find({name: { $regex: '.*' + req.body.name + '.*' }}).exec().then((users_retrieved) => {
        res.status(200).send({
            users: users_retrieved
        });
    }).catch(err => {
        res.status(400).send({error: err});
    })
};
