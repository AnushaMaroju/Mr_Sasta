const mongoose = require('mongoose');
const helper = require('../helper/helper');

const cartSchema = new mongoose.Schema({
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
      required: [true, 'typeOfRate is required (Fair or Instant)'],
    },
    price: {
      type: Number,
      default: 0,
    },
    quantityValue: {
      type: Number,
      default: 0,
      validate: {
        validator: function(value) {
          return value >= 0;
        },
        message: 'quantityValue must be non-negative',
      },
    },
    unit: {
      type: String,
      enum: ['kg', 'grm'],
    },
    purchaseQuantity: {
      type: Number,
      default: 0,
      validate: {
        validator: function(value) {
          return value >= 0;
        },
        message: 'purchaseQuantity must be non-negative',
      },
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
  created_at: {
    type: String,
    default: helper.availableTimeAndDate(),
  },
  updated_at: {
    type: Date,
  },
});

module.exports = mongoose.model('Cart', cartSchema);
