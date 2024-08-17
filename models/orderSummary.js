// const mongoose = require("mongoose");

// const orderSummarySchema = new mongoose.Schema({
//   orderId: {
//     type: String,

//     required: true,
//   },
//   totalPrice: {
//     type: Number,
//     required: true,
//   },
//   discount: {
//     type: Number,
//     default: 0,
//   },
//   paymentStatus: {
//     type: String,
//     enum: ["pending", "paid", "failed"],
//     default: "pending",
//   },
//   paymentMethod: {
//     type: String,
//     default: "",
//   },
//   paymentMethodType: {
//     type: String,
//     default: "",
//   },
//   paidAmount: {
//     type: Number,
//     default: 0,
//   },
//   priceStatus: {
//     type: String,
//   },
//   coupon: {
//     type: String,
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//   },
//   created_at: {
//     type: Date,
//     default: Date.now,
//   },
//   updated_at: {
//     type: Date,
//   },
// });

// module.exports = mongoose.model("OrderSummary", orderSummarySchema);
const mongoose = require("mongoose");

const orderSummary = new mongoose.Schema({
  orderId: {
    type:String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  coupon: {
    type: String,
    default: "",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("OrderSummary", orderSummary);
