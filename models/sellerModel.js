const mongoose = require("mongoose");
const helper = require("../helper/helper")

const sellerSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true
     },
     phone:{
      type: String,
   
     },
     password:{
      type: String,
     },
     roleName: {
      type: String,
    },
    role_Id: {
      type: String, 
      default:null
    },
    roleId: {
      type: String, // This remains String
      default: ""
    },

  email: {
    type: String,
  },
  token: {
    type: String,
    default: "",
  },

  gst: {
    type: String,
  },
  pan: {
    type: String,
  },
  shopName: {
    type: String,
    
  },
  sellerId:{
    type: String,

  },adminId:{
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive","blocked"],
    default: "active",
  },
  date:{
    type:String,
    default:helper.availableTimeAndDate()
  }
});

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
