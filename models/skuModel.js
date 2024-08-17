const mongoose = require("mongoose");

const skuSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  sellerId:{
    type:String
  },
  unit: {
    type: String,
    enum: ["kg", "lit", "grm","ml"],
    required: true,
  },
  quantityValue: {
    type: Number,
    required: true,
  },
 fairPrice: {
    type: Number,
    required: true,
  },
  instantPrice: {
    type: Number,
    required: true,
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
  totalQuantity: {
    type: Number,
    required: true,
  },
  maxLimitPurchase: {
    type: Number,
    default: 0,
  },
  status:{
    type:String,
    default:"active"
  }
});

const SKU = mongoose.model("SKU", skuSchema);

module.exports = SKU;
