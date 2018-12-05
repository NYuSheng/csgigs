const User = require('../models/user.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

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
    var userName = req.body.username;
    User.findOne({username: userName}, function (err, users) {
        if (err) return next(err);

        var role = users.role;

        if (role != "admin"){
            res.send("Incorrect username/password");
            return;
        }

        res.send(users);
    });
};

exports.user_login2 = function (req, res, next) {
    return User.findOne({username:req.body.username}).exec().then((user_retrieved) => {
        if(user_retrieved === null){
            return res.status(400).send({
                error: 'Cannot Find User ' + req.body.name
            });
        }
        var role = user_retrieved.role;
        if(role !=="admin"){
            return res.status(400).send({
                error: 'User is not an Admin. '
            });
        }
        res.status(200).send({
            adminuser: user_retrieved
        });
    }).catch(err=>{
        res.status(400).send({error: err});
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