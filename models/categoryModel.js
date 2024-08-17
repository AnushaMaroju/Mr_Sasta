const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  sellerId: { 
    type: String, 
    required: true 
  },
  branchId:{
    type: String, 
    required: true 
  },
 
  description: {
    type: String,
  },
  banner: {
    type: String,
    required: true,
},
  image: {
    type: String
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
