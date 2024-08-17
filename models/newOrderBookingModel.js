const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [{
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
    },
    skuId: {
      type: String,
    },
    typeOfRate: {
      type: String,
      enum: ['Fair', 'Instant'],
    },
    quantityValue: {
      type: Number,
      default: 0,
    },
    purchaseQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      enum: ['kg', 'grm'],
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
      default: 0,
    },
    final_price: {
      type: Number,
      default: 0,
    },
  }],
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
    default: 0,
  },
  final_price: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Inprogress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('NewOrderBooking', orderSchema);
