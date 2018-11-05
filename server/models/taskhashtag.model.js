const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskHashTagSchema = new Schema({
    name:{type: String, required: true, index: true, unique: true},
    description:{type: String, required: true}
    //rocket_chat:{type: String, required: true},
});

//db.users.createIndex( { "name": 1 }, { unique: true } )

// Export the model
module.exports = mongoose.model('task_hash_tags', TaskHashTagSchema);