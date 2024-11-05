const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    typeOfAddress: {
      type: String,
      enum: ["Home", "Office", "Others"],
      default: "Home",
    },
    location: {
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      type: {
        type: String,
        enum: ["Point"], // GeoJSON type
        required: true,
      },
    },
    floor: {
      type: String, // Specify type if needed
    },
    area: {
      type: String, // Specify type if needed
    },
    streetName: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    landMark: {
      type: String,
    },
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    activeStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", AddressSchema);
module.exports = Address;
