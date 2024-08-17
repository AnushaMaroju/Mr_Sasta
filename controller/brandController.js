const Brand = require('../models/brandModel');

const addBrand = async (req, res) => {
    try {
        const { name, Image, description } = req.body;

        const existingBrand = await Brand.findOne({ name });

        if (existingBrand) {
            return res.status(200).json({
                responseCode: 400,
                message: 'Brand already exists'
            });
        }

    
        const newBrand = new Brand({
            name,
            Image,
            description
        });

        const savedBrand = await newBrand.save();

        res.status(200).json({
            responseCode: 200,
            message: 'Brand created successfully',
            brand: savedBrand
        });
    } catch (error) {
        res.status(400).json({ 
            responseCode: 400,
            message: error.message 
        });
    }
};

module.exports = {
    addBrand
};