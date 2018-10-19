const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GigsSchema = new Schema({
    channelId:{type: String, required: true},
    name:{type: String, required: true, max: 100},
    browniePoints:{type: Number, required: true},
    status:{type:String, required: true}
});

// Export the model
module.exports = mongoose.model('gigs', GigsSchema);