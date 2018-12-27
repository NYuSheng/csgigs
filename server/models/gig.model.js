const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GigsSchema = new Schema({
    name:{type: String, required: true, index: true, unique: true},
    description: {type: String},
    photo: {type: String},
    createdAt:{type: Date, default: Date.now},
    rc_channel_id:{type: Object, default: null},
    points_budget:{type: Number, required: true},
    status:{type: String, required: true},
    user_admins:[{type: mongoose.Schema.Types.ObjectId}],
    user_participants:[{type: mongoose.Schema.Types.ObjectId}]
    // user_attendees:[{type: String}]
});

module.exports = mongoose.model('gigs', GigsSchema);

