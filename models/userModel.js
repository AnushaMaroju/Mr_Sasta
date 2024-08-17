const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    // required: true, 
  },
  userId: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  isRegistered: {
    type: Boolean,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'

    },
    coordinates: {
      type: [Number],
      // required: true,
    },
  },
  email: {
    type: String,
  },
  dob: {
    type: String,
  },
  otp: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active',
  },
  image: {
    type: String, 
  },
  token: {
    type: String,
  },
});

// Create a 2dsphere index on 'location' for geospatial queries
UserSchema.index({ location: '2dsphere' });

const User = mongoose.model("User", UserSchema);

module.exports = User;
