const mongoose = require("mongoose");
const helper = require("../helper/helper");

const branchSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  date: {
    type: String,
    default: helper.availableTimeAndDate(),
  },
});

// Create a 2dsphere index on 'location' for geospatial queries
branchSchema.index({ location: '2dsphere' });

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
