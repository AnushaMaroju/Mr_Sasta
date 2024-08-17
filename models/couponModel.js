const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  userId: {
    type: String,

    required: true,
  },
  sellerId: {
    type: String,

    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    flat: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Coupon", CouponSchema);
