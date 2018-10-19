const Gig = require('../models/gig.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Gig controller!');
};

exports.gig_create = function (req, res, next) {
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
};

exports.gigs_details = function(req, res){
    Gig.find({}, function(err, gigs){
        if(err) {
            return next(err);
        }

        res.send(gigs);
    });
}
