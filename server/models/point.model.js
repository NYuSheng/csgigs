const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PointSchema = new Schema({
  user_id: { type: String },
  gig_id: { type: mongoose.Schema.Types.ObjectId },
  points: { type: Number, required: true },
  add_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("points", PointSchema);
