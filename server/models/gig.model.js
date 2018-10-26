const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GigsSchema = new Schema({
    name:{type: String, required: true, unique: true},
    createdAt:{type: Date, default: Date.now},
    rc_channel_id:{type: String, default: null},
    points_budget:{type: Number, required: true},
    status:{type: String, required: true},
    users_admin:[{type: String}],
    users_participants:[{type: String}],
    users_attendees:[{type: String}]
    //rocket_chat:{type: String, required: true},
});

//db.users.createIndex( { "name": 1 }, { unique: true } )

// Export the model
module.exports = mongoose.model('gigs', GigsSchema);