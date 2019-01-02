const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskSchema = new Schema({
    gig_id:{type: mongoose.Schema.Types.ObjectId},
    task_name:{type:String, required:true},
    task_category:{type:String, required:true},
    task_description:{type:String},
    users_assigned: [{type:String}],
    appliedAt:{type:Date, default: Date.now},
    completeAt:{type:Date}
});

module.exports = mongoose.model('tasks', TaskSchema);
