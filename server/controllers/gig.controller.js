const Gig = require('../models/gig.model');
const asyncMiddleware = require('../utils/asyncMiddleware');

exports.test = asyncMiddleware(async (req, res) => {
    res.send('Greetings from the Gig controller!');
});

exports.gig_create = asyncMiddleware(async (req, res, next) => {
    let gig = new Gig(
        {
            name :req.body.name,
            points_budget : req.body.points_budget,
            status : "DRAFT",
            user_admins : req.body.user_admins,

            //Possible required fields in creation
            users_participants: [],
            users_attendees: []
        }
    );

    return gig.save().then(gigCreated => {

        return Gig
            .aggregate([
            {$match: {name: req.body.name}},
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'name',
                    foreignField: 'gig_name',
                    as: 'task_list'
                }
            }
        ])
            // .populate('user_participants')
            .exec().then((gigs_retrieved) => {
                if(gigs_retrieved.length === 0){
                    return res.status(400).send({
                        error: 'Cannot find any GIGs: ' + req.body.name
                    });
                }
                res.status(200).send({
                    gig: gigs_retrieved[0]
                });
            }).catch(err=>{
            res.status(400).send({error: err});
        });
    }).catch(err => {
        console.log(err);
        res.status(400).send({error : err});
    });
});

exports.gig_create_temp = asyncMiddleware(async (req, res, next) => {
    let gig = new Gig(
        {
            name :req.body.name,
            points_budget : req.body.points_budget,
            status : "DRAFT",
            user_admins : req.body.user_admins,

            //Possible required fields in creation
            user_participants: ["erny_che"],
            user_attendees: []
        }
    );

    return gig.save().then(gigCreated => {
        console.log(aggregation_with_tasks_and_users(req.body.name));
        return Gig
            .aggregate(aggregation_with_tasks_and_users(req.body.name))
            .exec().then((gigs_retrieved) => {
                if(gigs_retrieved.length === 0){
                    return res.status(400).send({
                        error: 'Cannot find any GIGs: ' + req.body.name
                    });
                }
                res.status(200).send({
                    gigs: gigs_retrieved[0]
                });
            }).catch(err=>{
            res.status(400).send({error: err});
        });
    }).catch(err => {
        console.log(err);
        res.status(400).send({error : err});
    });
});

function aggregation_with_tasks_and_users(gig_name){
    return [
        {'$match': {'name': gig_name}},
        {'$lookup': {
            'from': 'tasks',
            'localField': 'name',
            'foreignField': 'gig_name',
            'as': 'task_list'
        }},
        { "$unwind": "$user_admins" },
        { "$lookup": {
            "from": "users",
            "localField": "user_admins",
            "foreignField": "user_name",
            "as": "userObjects"
        }},
        { "$unwind": "$userObjects" },
        { "$group": {
        "_id": "$_id",
        "rc_channel_id": {"$first": "$rc_channel_id"},  
        "user_participants": {"$first": "$user_participants"},
        "user_admins": { "$push": "$user_admins" },
        "userObjects": { "$push": "$userObjects" },
        "user_attendees": {"$first": "$user_attendees"},
        "name": {"$first": "$name"},
        "points_budget": {"$first": "$points_budget"},
        "status": {"$first": "$status"},
        "createdAt": {"$first": "$createdAt"},
        "__v": {"$first": "$__v"},
        "task_list": {"$first": "$task_list"}
        }}
    ]
}

exports.gigs_details = asyncMiddleware(async (req, res, next) => {

    return Gig.find({}).exec().then((gigs) => {
        res.status(200).send({
            "gigs" : gigs
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send({error : err});
    });
});

exports.gig_details = asyncMiddleware(async (req, res, next) => {
    return Gig.findOne({name: req.params.name})
        // .populate('user_participants')
        .exec().then((gig_retrieved) => {
        if(gig_retrieved === null){
            return res.status(400).send({
                error: 'Cannot find gig of name ' + req.params.name
            });
        }

        res.status(200).send({
            gig : gig_retrieved
        });

    }).catch(err => {
        res.status(400).send({error : err});
    });
});

exports.gig_update = function (req, res, next) {
    Gig.findByIdAndUpdate(req.params.name, {$set: req.body}, function (err, gig) {
        if (err) return next(err);
        res.send('Gig udpated.');
    });
};

exports.gig_add_user_participant = function (req, res, next) {
    return Gig.findOneAndUpdate(
        {name: req.params.name},
        {$push: {"user_participants": req.params.participant_name}}, //add participant to array
        {'new': true},
        function(err, gig){
            if(err || gig == null) {
                return res.status(400).send({
                    error: 'Cannot find gig of name ' + req.params.name
                });
            } else {
                res.status(200).send({
                    gig : gig
                });
            }
        });
};

exports.gig_add_user_attendee = function (req, res, next) {
    return Gig.findOneAndUpdate(
        {name: req.params.name},
        {$push: {"user_attendees": req.params.attendee_name}}, //add participant to array
        {'new': true},
        function(err, gig){
            if(err || gig == null) {
                return res.status(400).send({
                    error: 'Cannot find gig of name ' + req.params.name
                });
            } else {
                res.status(200).send({
                    gig : gig
                });
            }
        });
};

exports.get_gigs_status = function (req, res) {
    return Gig.find({status:req.params.status}).exec().then((gigs_retrieved) => {
        if(gigs_retrieved.length === 0){
            return res.status(400).send({
                error: 'Cannot find any GIGs under status: ' + req.params.status
            });
        }
        res.status(200).send({
            gigs: gigs_retrieved
        });
    }).catch(err=>{
        res.status(400).send({error: err});
    })
}

exports.get_gigs_everything = function (req, res) {
    return Gig.aggregate([
        {$match: {name: req.params.gigname}},
        {
            $lookup: {
                from: 'tasks',
                localField: 'name',
                foreignField: 'gig_name',
                as: 'task_list'
            }
        }
    ]).exec().then((gigs_retrieved) => {
        if(gigs_retrieved.length === 0){
            return res.status(400).send({
                error: 'Cannot find any GIGs: ' + req.params.gigname
            });
        }
        res.status(200).send({
            gigs: gigs_retrieved
        });
    }).catch(err=>{
        res.status(400).send({error: err});
    })
}


//method shouldnt be here, may need to further discuss on location of method
// exports.retrive_gigs = async (req, res, next) => {
//     return Gig.find({}).exec().then((result) =>{
//         return result;
//     });
// };
