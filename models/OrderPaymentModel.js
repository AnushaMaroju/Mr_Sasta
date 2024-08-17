const mongoose = require("mongoose");
const couponModel = require("./couponModel");
const helper = require("../helper/helper");

const orderPaymentSchema = new mongoose.Schema({
  TotalAmount: {
    type: Number,
    default: 0,
  },
  couponCode: {
    type: String,
    default: null,
  },
  userId: {
    type: String,
    default: null,
   },
   orderBookingId:{
    type:String,
    default: "",

   },
  sub_total: {
    type: Number,
    required: true,
  },
  gst_percent: {
    type: Number,
    default: 0,
  },
  discount_percent: {
    type: Number,
    default: 0,
  },
  total_amount: {
    type: Number,
    default: 0,
  },
  payment_status: {
    type: String,
    enum: ["initialized","confirmed" ,"completed", "failed", "pending"],
    default: "initialized",
  },
  status: {
    type: Boolean,
    default: false,
  },
  paymentId: {
    type: String,
    default: null,
  },
  orderId: {
    type: String,
    default: null,
  },
  signature: {
    type: String,
    default: null,
  },
  GSTIN: {
    type: String,
    default: null,
  },
  date: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    default: helper.availableTimeAndDate(),
  },
  updated_at: {
    type: Date,
  },
});

module.exports = mongoose.model("OrderPayment", orderPaymentSchema);
