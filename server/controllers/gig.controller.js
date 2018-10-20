const Gig = require('../models/gig.model');
const asyncMiddleware = require('../utils/asyncMiddleware');

//Simple version, without validation or sanitation
exports.test = asyncMiddleware(async (req, res) => {
    res.send('Greetings from the Gig controller!');
});

exports.gig_create = asyncMiddleware(async (req, res, next) => {
    let gig = new Gig(
        {
            channelId:req.body.channelId,
            name: req.body.name,
            browniePoints: req.body.browniePoints,
            status: req.body.status
        }
    );

    gig.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Gig Created successfully')
    })
});

exports.gigs_details = asyncMiddleware(async (req, res, next) => {
    Gig.find({}, function(err, gigs){
        if(err) {
            return next(err);
        }
        res.send({
            "status" : 200,
            "gigs" : gigs
        });
    });
});

exports.gig_update = function (req, res) {
    Gig.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, gig) {
        if (err) return next(err);
        res.send('Gig udpated.');
    });
};
