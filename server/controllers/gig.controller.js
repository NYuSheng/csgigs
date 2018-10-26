const Gig = require('../models/gig.model');
const asyncMiddleware = require('../utils/asyncMiddleware');



exports.test = asyncMiddleware(async (req, res) => {
    res.send('Greetings from the Gig controller!');
});

exports.gig_create = asyncMiddleware(async (req, res, next) => {
    let gig = new Gig(
        {
            name:req.body.name,
            points_budget: req.body.points_budget,
            status: req.body.status,
            users_admin: req.body.users_admin

            //Possible required fields in creation
            // rc_channel_id: req.body.rc_channel_id,
            // users_participants: req.body.users_participants,
            // users_attendees: req.body.users_attendees
        }
    );

    // gig_name:{type: String, required: true, unique: true},
    // createdAt:{type: Date, required: true},
    // rc_channel_id:{type: String},
    // points_budget:{type: Number, required: true},
    // status:{type: String, required: true},
    // users_admin:[{type: String}],
    // users_participants:[{type: String}],
    // users_attendees:[{type: String}]

    return gig.save().then(gigCreated => {
        res.send({
            "status": 200,
            "gig": gigCreated
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send({error : err});
    });

    // return gig.save(function (err) {
    //     if (err) return next(err);
    //     res.send('wew');
    // })
});

exports.gigs_details = asyncMiddleware(async (req, res, next) => {

    return Gig.find({}).exec().then((gigs) => {
        res.send({
            "status" : 200,
            "gigs" : gigs
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send({error : err});
    });

    // return Gig.find({}, function(err, gigs){
    //     if(err) {
    //         return next(err);
    //     }
    //     res.send({
    //         "status" : 200,
    //         "gigs" : gigs
    //     });
    // });
});

exports.gig_update = function (req, res) {
    Gig.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, gig) {
        if (err) return next(err);
        res.send('Gig udpated.');
    });
};

//method shouldnt be here, may need to further discuss on location of method
// exports.retrive_gigs = async (req, res, next) => {
//     return Gig.find({}).exec().then((result) =>{
//         return result;
//     });
// };
