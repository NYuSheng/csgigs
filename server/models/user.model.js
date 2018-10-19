const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    channelId:{type:String, required: true, trim: true},
    name:{type: String, required: true, unique: true, trim: true, max: 100},
    password:{type: String, required: true},
    authToken:{type: String, required: true}
});

// Export the model
module.exports = mongoose.model('users', UserSchema);