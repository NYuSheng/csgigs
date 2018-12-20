const mongoose = require('mongoose');
const userSchema = require('../models/user.model');
const Schema = mongoose.Schema;

var User = mongoose.model('users', userSchema.UserSchema);

let GigsSchema = new Schema({
    name:{type: String, required: true, index: true, unique: true},
    description: {type: String},
    photo: {type: String},
    createdAt:{type: Date, default: Date.now},
    rc_channel_id:{type: String, default: null},
    points_budget:{type: Number, required: true},
    status:{type: String, required: true},
    user_admins:[{type: String}],
    // user_participants:[{type: Schema.Types.ObjectId, ref: 'users'}],
    user_participants:[{type: String}],
    user_attendees:[{type: String}]
    //rocket_chat:{type: String, required: true},
});

//db.users.createIndex( { "name": 1 }, { unique: true } )

// Export the model
module.exports = mongoose.model('gigs', GigsSchema);

