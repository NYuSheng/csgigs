const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskRequestsSchema = new Schema({
    task_id:{type:String, required:true},
    user_name:{type: String, required:true},
    status:{type: String, default: 'Pending'}
});

module.exports = mongoose.model('task_requests', TaskRequestsSchema);
