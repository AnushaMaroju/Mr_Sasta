const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  sellerId:{
    type:String
  },
  adminId:{
    type:String
  },
  categoryId: {
    type: String,
    required: true,
  },
  subCategoryId:{
    type: String
  },
  subCategoryName:{
    type: String
  },
  brandId:{
    type: String,
   
  },
  categoryName: {
    type: String,
  },
  rating:{
    type:String,
    default:""

  },
 
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  description: {
    type: String,
  },
  images: {
    type: String, 
  },
  totalSkuQuantity:{
    type:Number,
    default:0
  },
  productQuntityCount:{
    type:Number,
    default:0
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
