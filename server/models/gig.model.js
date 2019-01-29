const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rcChannelType = {
  type: { id: { type: String }, name: { type: String } },
  default: null
};

let GigsSchema = new Schema({
  name: { type: String, required: true, index: true, unique: true },
  description: { type: String },
  photo: { type: String },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  rc_private_channel: rcChannelType,
  rc_public_channel: rcChannelType,
  rc_channel_id: { type: Object, default: null },
  points_budget: { type: Number, required: true },
  status: { type: String, required: true },
  user_admins: [{ type: String }],
  user_participants: [{ type: String }],
  type: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  owner: { type: String },
  venue: { type: String },
  address: { type: String },
  region: { type: String },
  channel: { type: String },
  contact: { type: String },
  timeZone: { type: String },
  registrationRequired: { type: Boolean },
  maxParticipants: { type: Number },
  relatedLink: { type: String }
});

module.exports = mongoose.model("gigs", GigsSchema);
