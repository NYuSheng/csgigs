const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Task = require('../models/task.model');


let Task = new Schema({
    gig_name:{type:String, required:true},
    task_id:{type:String, required:true},
    points:{type:Number, required:true},
    appliedAt:{type:Date, default: Date.now},
    completeAt:{type:Date}
});

let UserSchema = new Schema({
    username:{type:String, required:true},
    name:{type:String, require:true},
    user_id:{type:String, required:true, unique:true},
    createdAt:{type:Date, default: Date.now},
    role:{type:String, required:true},
    name:{type:String, required:true},
    email:[{
        address:{type:String, required:true},
        verified:{type:Boolean, required:true}
    }],
    updatedAt:{type:Date}
});

// Export the model
module.exports = mongoose.model('users', UserSchema);
