const Branch = require('../models/branchModel');
const Seller = require('../models/sellerModel');

const createBranch = async (req, res) => {
  try {
    const sellerId = req.userId.id;
    const { branchName, address, location } = req.body;

  
    if (!branchName || !address || !location || !location.type || !Array.isArray(location.coordinates)) {
      return res.status(400).json({ message: 'Branch name, address, and valid location are required' });
    }

 
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

   
    const existingBranch = await Branch.findOne({ sellerId, branchName });
    if (existingBranch) {
      return res.status(400).json({ message: 'Branch name already exists for this seller' });
    }


    const newBranch = new Branch({ sellerId, branchName, address, location });
    const savedBranch = await newBranch.save();

    res.status(201).json({
      responseCode: 201,
      message: 'Branch created successfully',
      branch: savedBranch,
    });
  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getBranchesBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(200).json({ responseCode: 400, message: 'Seller ID is required' });
    }


    const branches = await Branch.find({ sellerId });

    if (branches.length === 0) {
      return res.status(200).json({ responseCode: 400, message: 'No branches found for this seller' });
    }

    res.status(200).json({
      responseCode: 200,
      message: 'Branches retrieved successfully',
      branches,
    });
  } catch (error) {
    console.error('Error retrieving branches:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createBranch, getBranchesBySellerId };
