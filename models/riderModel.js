const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema({
  riderName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  drivingLicense: {
    type: String,
    required: true,
    unique: true
  },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  profilePic: {
    type: String
  },
  adminId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
});

const Rider = mongoose.model("Rider", riderSchema);

module.exports = Rider;