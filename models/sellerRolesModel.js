const helper = require("../helper/helper");
const mongoose = require("mongoose");

const SellerRoleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
    },
    features:{
      type:Array,
      default:[]
    },
    createdBy: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },
    created_at: {
      type: String,
      default: helper.timeWithDate()
    },
    date: {
      type: String,
      default: helper.availableTimeAndDate()
    },updated_at:{
      type:String
    },
    source: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
 
);

module.exports = mongoose.model("SellerRoles", SellerRoleSchema);

