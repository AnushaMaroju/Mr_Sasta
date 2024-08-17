const mongoose = require("mongoose");
const helper = require("../helper/helper");

const sellerFeaturesSchema = new mongoose.Schema(
  {
    featureName: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
    privileges: [
      {
        privilegeType: {
          type: String,
          required: true,
          default: "Read",
        },
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    endPoint: {
      type: String,
      required: [true, "endpoint is required"],
    },
    created_at: {
      type: String,
      default: helper.timeWithDate(),
    },
    date: {
      type: String,
      default: helper.availableTimeAndDate(),
    },
    updated_at: {
      type: String,
    },
  }
);

module.exports = mongoose.model("SellerFeatures", sellerFeaturesSchema);
