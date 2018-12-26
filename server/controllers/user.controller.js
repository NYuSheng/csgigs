const User = require('../models/user.model');
const fetch = require('node-fetch');
const rc_controller = require('../controllers/rc.controller');

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

    rc_controller.rc_user_login(loginDetails, res);
};

exports.get_user_by_prefix = function (req, res, next) {
    return User.find({name: { $regex: '.*' + req.body.name + '.*', $options: "i" }}).exec().then((users_retrieved) => {
        res.status(200).send({
            users: users_retrieved
        });
    }).catch(err => {
        res.status(400).send({error: err});
    })
};
