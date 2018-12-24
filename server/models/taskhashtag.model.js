const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskHashTagSchema = new Schema({
    name:{type: String, required: true, index: true, unique: true},
    description:{type: String, required: true}
});

module.exports = mongoose.model('task_hash_tags', TaskHashTagSchema);
