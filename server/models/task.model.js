const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskSchema = new Schema({
    gig_name:{type:String, required:true},
    task_name:{type:String, required:true},
    points:{type:Number, required:true},
    task_category:{type:String, required:true},
    task_description:{type:String},
    appliedAt:{type:Date, default: Date.now},
    completeAt:{type:Date}
});

// Export the model
module.exports = mongoose.model('tasks', TaskSchema);
