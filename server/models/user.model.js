const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    _id:{type:String, required:true},
    username:{type:String, required:true},
    name:{type:String, require:true},
    createdAt:{type:Date, default: Date.now},
    roles:[{type:String, required:true}],
    emails:[{
        address:{type:String, required:true},
        verified:{type:Boolean, required:true}
    }],
});

// Export the model
module.exports = mongoose.model('users', UserSchema);
