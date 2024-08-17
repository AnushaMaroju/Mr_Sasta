// const mongoose = require("mongoose");
// const helper = require("../helper/helper");

// const orderBooking = new mongoose.Schema({
//   bookingId: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: String,
//     required: true,
//   },
//   userName: {
//     type: String,
//   },
//   sellerId: {
//     type: String,
//   },
//   shopName: {
//     type: String,
//   },
//   addressId: {
//     type: String,
//     required: true,
//   },
//   createdBy: {
//     type: String,
//     required: true,
//   },
//   activeStatus: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "active",
//   },
//   invoiceURL: {
//     type: String,
//     default: "",
//   },
//   orderStatus: {
//     type: String,
//     enum: ["pending", "inProgress", "delivered", "cancelled", "outForDelivery"],
//     default: "pending",
//   },
//   deliveryDate: {
//     type: String,
//     default: null,
//   },
//   paymentStatus: {
//     type: String,
//     default: "",
//   },
//   totalQuantity: {
//     type: String,
//     default: "",
//   },
//   created_at: {
//     type: String,
//     default: helper.availableTimeAndDate(),
//   },
//   date: {
//     type: String,
//     default: helper.timeWithDate(),
//   },
//   employeId: {
//     type: String,
//     default: "",
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now,
//   },
//   totalProducts: {
//     type: Number,
//     default: 0,
//   },
// });

// module.exports = mongoose.model("OrderBookings", orderBooking);
const mongoose = require("mongoose");
const helper = require("../helper/helper");

const orderBooking = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  sellerId: {
    type: String,
  },
  shopName: {
    type: String,
  },
  addressId: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  activeStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  invoiceURL: {
    type: String,
    default: "",
  },
  orderStatus: {
    type: String,
    enum: ["pending", "inProgress","confirmed", "delivered", "cancelled", "outForDelivery"],
    default: "pending",
  },
  deliveryDate: {
    type: String,
    default: null,
  },
  paymentStatus: {
    type: String,
    default: "",
  },
  totalQuantity: {
    type: String,
    default: "",
  },
  created_at: {
    type: String,
    default: helper.availableTimeAndDate(),
  },
  date: {
    type: String,
    default: helper.timeWithDate(),
  },
  employeId: {
    type: String,
    default: "",
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  totalProducts: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("OrderBookings", orderBooking);
