const Gig = require("../models/gig.model");
const asyncMiddleware = require("../utils/asyncMiddleware");
const ObjectID = require('mongodb').ObjectID;
const rc_controller = require('../controllers/rc.controller');

exports.create_gig = asyncMiddleware(async (req, res, next) => {
    const gig = new Gig(
        {
            name: req.body.name,
            description: req.body.description,
            photo: req.body.photo,
            points_budget: req.body.points_budget,
            status: "Draft",
            user_admins: req.body.user_admins.map(admin => admin.name),
            //Possible required fields in creation
            user_participants: [],
            user_attendees: []
        }
    );
    try {
        const gig_created = await gig.save();

        if (gig_created === null) {
            return res.status(400).send({
                error: "Error encountered while creating gig: " + req.body.name
            });
        }

        const authSet = {
            XAuthToken: req.body.XAuthToken,
            XUserId: req.body.XUserId
        };

        //publish_bot with broadcast_test channel
        const authSet_bot = {
            XAuthToken: 'VynD2oNIieXVkn_nkqBSq1DKv5_5LhC1-ZKrz9q-bwl',
            XUserId: 'Zjh2Hmnsbwq5MGMv8'
        }
        const roomId = "2EvneDEerT9jGLYYf";


        const gig_id_and_name = {
            _id: gig_created._id,
            name: gig_created.name
        };

        gig_created.user_admins = gig_created.user_admins.filter(admin => admin !== req.body.user);

        const created_group = await rc_controller.create_group(gig_created, authSet);
        if (created_group) {
            const gig_owners = req.body.user_admins
                .filter(admin => admin.name !== req.body.user)
                .map(admin => admin._id);
            rc_controller.add_owners_to_group(created_group._id, gig_owners, authSet);
            Gig.findByIdAndUpdate(gig_created._id, { rc_channel_id : created_group}, function (err, gig) {
                if (err) return next(err);
            });
            const message = "Please reply 'Attend' for event: " + gig_created.name;
            rc_controller.publish_broadcast_message(roomId, message, authSet_bot);
        }

        res.status(200).send({
            gig: gig_id_and_name
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({error});
    }
});

exports.get_gig_name = asyncMiddleware(async (req, res, next) => {
    return Gig.find({ "_id": ObjectID(req.params.id)}).exec().then((gig) => {
        if (gig == null) {
            return res.status(400).send({
                error: "Cannot find Gig with id: " + req.params.id
            });
        }
        res.status(200).send({
            gig_name: gig[0].name
        });
    }).catch(err => {
        res.status(400).send({error: err});
    });
});

//TODO
exports.get_user_all_gigs = asyncMiddleware(async (req, res, next) => {
    let status = (req.query.status).split(",");
    const matchCriteria =
        {
            "$match":
                {
                    "user_admins": {"$in": [req.params.user_id]},
                    "status": {"$in": status}
                }
        };
    return Gig
        .aggregate(aggregation_with_tasks_and_users(matchCriteria)).exec().then((gigs) => {
            res.status(200).send({
                "gigs": gigs
            });
        }).catch(err => {
            console.log(err);
            res.status(500).send({error: err});
        });
});

exports.gigs_by_status = function (req, res) {
    return Gig.find({status: req.params.status}).exec().then((gigs_retrieved) => {
        if (gigs_retrieved.length === 0) {
            return res.status(400).send({
                error: "Cannot find any GIGs under status: " + req.params.status
            });
        }
        res.status(200).send({
            gigs: gigs_retrieved
        });
    }).catch(err => {
        res.status(400).send({error: err});
    });
};


exports.get_user_admins = asyncMiddleware(async (req, res, next) => {
    const matchCriteria = {"$match": {"_id": new ObjectID(req.params.id)}};
    return Gig
        .aggregate(gig_aggregation_with_user_admin(matchCriteria)).exec().then((gig_retrieved) => {
            if (gig_retrieved === null) {
                return res.status(400).send({
                    error: "Cannot find gig of id " + req.params.id
                });
            }
            res.status(200).send({
                gig: gig_retrieved[0]
            });

        }).catch(err => {
            res.status(400).send({error: err});
        });
});

exports.add_user_admin = asyncMiddleware(async (req, res, next) => {
    return Gig.findOneAndUpdate(
        {"_id": new ObjectID(req.params.id)},
        {$addToSet: {"user_admins": new ObjectID(req.body.user_id)}}, //addToSet ensures no duplicate names in array
        {"new": true},
        function (err, gig) {
            if (err || gig == null) {
                console.log(err);
                return res.status(400).send({
                    error: "Cannot find gig of name " + req.params.name
                });
            } else {
                res.status(200).send({
                    gig: gig
                });

            }
        });
});

exports.delete_user_admin = asyncMiddleware(async (req, res, next) => {
    return Gig.findOneAndUpdate(
        {"_id": new ObjectID(req.params.id)},
        {$pullAll: {"user_admins": [new ObjectID(req.body.user_id)]}}, //remove all instances of the user admin
        {"new": true}, // return updated new array
        function (err, gig) {
            if (err || gig == null) {
                console.log(err);
                return res.status(400).send({
                    error: "Cannot find admin of id " + req.body.user_id
                });
            } else {
                res.status(200).send({
                    gig: gig
                });
            }
        });
});

function gig_aggregation_with_user_admin(matchCriteria) {
    return [
        matchCriteria,
        {"$unwind": "$user_admins"},
        {
            "$lookup": {
                "from": "users",
                "localField": "user_admins",
                "foreignField": "_id",
                "as": "userObjects"
            }
        },
        {"$unwind": "$userObjects"},
        {
            "$group": {
                "_id": "$_id",
                "description": {"$first": "$description"},
                "photo": {"$first": "$photo"},
                "rc_channel_id": {"$first": "$rc_channel_id"},
                "user_participants": {"$first": "$user_participants"},
                "user_admins": {"$push": "$userObjects"},
                "user_attendees": {"$first": "$user_attendees"},
                "name": {"$first": "$name"},
                "points_budget": {"$first": "$points_budget"},
                "status": {"$first": "$status"},
                "createdAt": {"$first": "$createdAt"},
                "__v": {"$first": "$__v"}
            }
        }
        ]
}

exports.get_user_participants = asyncMiddleware(async (req, res, next) => {
    const matchCriteria = {"$match": {"_id": new ObjectID(req.params.id)}};
    return Gig
        .aggregate(gig_aggregation_with_user_participant(matchCriteria)).exec().then((gig_retrieved) => {
            if (gig_retrieved === null) {
                return res.status(400).send({
                    error: "Cannot find Gig of id " + req.params.id
                });
            }
            res.status(200).send({
                gig: gig_retrieved[0]
            });

        }).catch(err => {
            res.status(400).send({error: err});
        });
});


exports.add_user_participant = asyncMiddleware(async (req, res, next) => {
    return Gig.findOneAndUpdate(
        {"_id": new ObjectID(req.params.id)},
        {$addToSet: {"user_participants": ObjectID(req.body.user_id)}}, //addToSet ensures no duplicate names in array
        {"new": true},
        function (err, gig) {
            if (err || gig == null) {
                console.log(err);
                return res.status(400).send({
                    error: "Cannot find Gig of id " + req.params.id
                });
            } else {
                res.status(200).send({
                    gig: gig
                });

            }
        });
});

exports.delete_user_participant = asyncMiddleware(async (req, res, next) => {
    return Gig.findOneAndUpdate(
        {"_id": new ObjectID(req.params.id)},
        {$pullAll: {"user_participants": [new ObjectID(req.body.user_id)]}}, //remove all instances of the user admin
        {"new": true}, // return updated new array
        function (err, gig) {
            if (err || gig == null) {
                console.log(err);
                console.log(gig);
                return res.status(400).send({
                    error: "Cannot find participant of id " + req.body.user_id
                });
            } else {
                res.status(200).send({
                    gig: gig
                });
            }
        });
});

function gig_aggregation_with_user_participant(matchCriteria){
    return [
        matchCriteria,
        {"$unwind": "$user_participants"},
        {
            "$lookup": {
                "from": "users",
                "localField": "user_participants",
                "foreignField": "_id",
                "as": "userObjects"
            }
        },
        {"$unwind": "$userObjects"},
        {
            "$group": {
                "_id": "$_id",
                "description": {"$first": "$description"},
                "photo": {"$first": "$photo"},
                "rc_channel_id": {"$first": "$rc_channel_id"},
                "user_participants": {"$push": "$userObjects"},
                "user_admins": {"$first": "$user_admins"},
                "user_attendees": {"$first": "$user_attendees"},
                "name": {"$first": "$name"},
                "points_budget": {"$first": "$points_budget"},
                "status": {"$first": "$status"},
                "createdAt": {"$first": "$createdAt"},
                "__v": {"$first": "$__v"}
            }
        }
    ]

}

function aggregation_with_tasks_and_users(matchCriteria) {
    return [
        matchCriteria,
        {
            '$lookup': {
                'from': 'tasks',
                'localField': 'name',
                'foreignField': 'gig_name',
                'as': 'tasks'
            }
        },
        {"$unwind": "$user_admins"},
        {
            "$lookup": {
                "from": "users",
                "localField": "user_admins",
                "foreignField": "name",
                "as": "userObjects"
            }
        },
        {"$unwind": "$userObjects"},
        {"$unwind": "$tasks"},
        {
            "$lookup": {
                "from": "users",
                "localField": "tasks.users_assigned",
                "foreignField": "name",
                "as": "task_users"
            }
        },
        {"$unwind": "$task_users"},
        {
            "$group": {
                "_id": "$tasks._id",
                "gigs_id": {"$first": "$_id"},
                "description": {"$first": "$description"},
                "photo": {"$first": "$photo"},
                "rc_channel_id": {"$first": "$rc_channel_id"},
                "user_participants": {"$first": "$user_participants"},
                "user_admins": {"$addToSet": "$userObjects"},
                "user_attendees": {"$first": "$user_attendees"},
                "name": {"$first": "$name"},
                "points_budget": {"$first": "$points_budget"},
                "status": {"$first": "$status"},
                "createdAt": {"$first": "$createdAt"},
                "__v": {"$first": "$__v"},
                "task_name": {"$first": "$tasks.task_name"},
                "gig_name" : {"$first": "$tasks.gig_name"},
                "task_description" : {"$first": "$tasks.task_description"},
                "points" : {"$first": "$tasks.points"},
                "task_category" : {"$first": "$tasks.task_category"},
                "completeAt" : {"$first": "$tasks.completeAt"},
                "appliedAt" : {"$first": "$tasks.appliedAt"},
                "__v" : {"$first": "$tasks.__v"},
                "users_assigned": {"$addToSet": "$task_users"}
            }
        },
        {
            "$group": {
                "_id": "$gigs_id",
                "description": {"$first": "$description"},
                "photo": {"$first": "$photo"},
                "rc_channel_id": {"$first": "$rc_channel_id"},
                "user_participants": {"$first": "$user_participants"},
                "user_admins": {"$first": "$user_admins"},
                "user_attendees": {"$first": "$user_attendees"},
                "name": {"$first": "$name"},
                "points_budget": {"$first": "$points_budget"},
                "status": {"$first": "$status"},
                "createdAt": {"$first": "$createdAt"},
                "__v": {"$first": "$__v"},
                "tasks": {
                    "$push": {
                        "_id": "$_id",
                        "task_name": "$task_name",
                        "gig_name" : "$gig_name",
                        "task_description" : "$task_description",
                        "points" : "$points",
                        "task_category" : "$task_category",
                        "completeAt" : "$completeAt",
                        "appliedAt" : "$appliedAt",
                        "__v" : "$__v",
                        "users_assigned": "$users_assigned"
                    }
                }
            }
        }
    ]
}
