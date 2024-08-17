const mongoose = require("mongoose");
const Category = require("./categoryModel");

const subCategorySchema = new mongoose.Schema({
    categoryId: {
        type: "String",
        required: true,
    },
    sellerId:{
        type: "String",
        required: true,
    },
       name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    description:{
        type: String
    },
    banner: {
        type: String,
        required: true,
    },
    image: {
        type: Array,
       
    },
 
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;