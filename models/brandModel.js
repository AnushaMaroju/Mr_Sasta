const mongoose = require("mongoose");


const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    }
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;