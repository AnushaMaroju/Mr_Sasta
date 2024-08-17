// const mongoose = require("mongoose");
// const helper = require("../helper/helper");

// const orderBookingInfoSchema = new mongoose.Schema({
//   orderBookingId: {
//     type: String,
//     required: true,
//   },
//   sellerId: {
//     type: String,
//     required: true,
//   },
//   typeOfRate: {
//     type: String,
//     enum: ["Fair", "Instant"],
//     required: [true, "typeOfRate is required (Fair or Instant)"],
//   },
//   productId: {
//     type: String,
//   },
//   productName: {
//     type: String,
//   },
//   skuId:{
//     type: String,
//   },

//   quantityValue: {
//     type: Number,
//     default: 0,
//     validate: {
//       validator: function (value) {
//         return value >= 0;
//       },
//       message: 'quantityValue must be non-negative',
//     },
//   },
//   unit: {
//     type: String,
//     enum: ["kg", "grm"],
//   },
//   purchaseQuantity: {
//     type: Number,
//     default: 0,
//     validate: {
//       validator: function (value) {
//         return value >= 0;
//       },
//       message: 'purchaseQuantity must be non-negative',
//     },
//   },

//   price:{
//     type: Number,
//     default: 0,
//   },
//   discount: {
//     type: Number,
//     default: 0,
//   },
//   gst: {
//     type: Number,
//     default: 0,
//   },
//   sub_total: {
//     type: Number,
//     default: 0,
//   },
//   final_price: {
//     type: Number,
//     default: 0,
//   },
//   createdBy: {
//     type: String,
//     default: "",
//   },
//   created_at: {
//     type: String,
//     default: helper.availableTimeAndDate(),
//   },
//   date: {
//     type: String,
//     default: helper.availableTimeAndDate(),
//   },
//   status: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "active",
//   },
//   updated_at: {
//     type: Date,
//   },
//   deliveryDate: {
//     type: String,
//     default: null,
//   },
// });

// module.exports = mongoose.model("OrderBookingInfo", orderBookingInfoSchema);
const mongoose = require("mongoose");

const orderBookingInfo = new mongoose.Schema({
  orderBookingId: {
    type:String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  typeOfRate: {
    type: String,
  },
  productId: {
    type: String,
    required: true,
  },
  skuId: {
    type: String,
    default: "",
  },

  productName: {
    type: String,
    required: true,
  },
  quantityValue: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
  },
  purchaseQuantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  gst: {
    type: Number,
    default: 0,
  },
  sub_total: {
    type: Number,
  },
  final_price: {
    type: Number,
  },
  deliveryDate: {
    type: String,
    default: null,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("OrderBookingInfo", orderBookingInfo);
