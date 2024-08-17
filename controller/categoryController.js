const Category = require("../models/categoryModel");
const Seller = require("../models/sellerModel");
const SubCategoryModel = require("../models/subCatgoryModel");
const BrandModel = require("../models/brandModel");
const Branch = require("../models/branchModel");
const Usermodel = require("../models/userModel")

const createCategory = async (req, res) => {
  try {
    const sellerId = req.userId.id;

    const { branchId, name, description, banner, image } = req.body;

    // Validate required fields
    if (!branchId || !name || !banner) {
      return res.status(200).json({responseCode:400, message: "Branch ID, name, and banner are required" });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(200).json({ responseCode: 400, message: "Seller not found" });
    }

    const existingCategory = await Category.findOne({ name, sellerId });
    if (existingCategory) {
      return res.status(200).json({ responseCode: 400, message: "Category already exists for this seller" });
    }

    const newCategory = new Category({
      branchId,
      name,
      sellerId,
      description,
      banner,
      image
    });

    const savedCategory = await newCategory.save();

    res.status(200).json({
      responseCode: 200,
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const addSubCategory = async (req, res) => {
  try {
    const sellerId = req.userId.id;
    
    const { categoryId,  name, banner, Image, description } =
      req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(200)
        .json({ responseCode: 400, message: "Category not found" });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res
        .status(200)
        .json({ responseCode: 400, message: "Seller not found" });
    }

 
    const existingSubCategory = await SubCategoryModel.findOne({
      name,
      sellerId,
    });
    if (existingSubCategory) {
      return res.status(200).json({
        responseCode: 400,
        message: "Subcategory already exists for this seller",
      });
    }

    const newSubCategory = new SubCategoryModel({
      categoryId,
      sellerId:sellerId,
      name,
      description,
      banner,
      Image,
    });

    const savedSubCategory = await newSubCategory.save();

    res.status(200).json({
      responseCode: 200,
      message: "Subcategory created successfully",
      subcategory: savedSubCategory,
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCategoriesBySellerId = async (req, res) => {
  try {
    const { sellerId, branchId } = req.body;

    // Validate input
    if (!sellerId || !branchId) {
      return res.status(400).json({ message: "Seller ID and Branch ID are required" });
    }

    // Find categories by sellerId and branchId
    const categories = await Category.find({ sellerId, branchId });

    // Check if categories were found
    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found for this seller and branch" });
    }

    // Return found categories
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const editCategory = async (req, res) => {
  try {
    const sellerId = req.userId.id;
    const { categoryId,name, description, banner, image } = req.body;

    const category = await Category.findOne({ _id: categoryId, sellerId });
    if (!category) {
      return res.status(404).json({
        responseCode: 404,
        message: "Category not found",
      });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.banner = banner || category.banner;
    category.image = image || category.image;

    const updatedCategory = await category.save();

    res.status(200).json({
      responseCode: 200,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleCategoryStatus = async (req, res) => {
  try {
    const sellerId = req.userId.id;
    const { categoryId, status } = req.body;

    const category = await Category.findOne({ categoryId: categoryId._id, sellerId });
    if (!category) {
      return res.status(404).json({
        responseCode: 404,
        message: "Category not found",
      });
    }

    category.status = status;

    const updatedCategory = await category.save();

    res.status(200).json({
      responseCode: 200,
      message: "category status toggled successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error toggling category status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const userId = req.userId.id; 

    

    // Find the user by userId to get their location
    const user = await Usermodel.findById(userId).select('location');
    
    if (!user || !user.location || !user.location.coordinates) {
      return res.status(200).json({ responseCode: 400, message: "User location not found" });
    }

    const userLocation = user.location.coordinates;

    // Find all branches within a certain distance from the user's location
    const branches = await Branch.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: userLocation
          },
          $maxDistance: 5000 // Distance in meters (adjust as needed)
        }
      }
    });

    if (branches.length === 0) {
      return res.status(200).json({ responseCode: 200, message: "No branches found near your location" });
    }

    // Extract branch IDs
    const branchIds = branches.map(branch => branch._id);

    // Retrieve categories for these branches
    const categories = await Category.find({ branchId: { $in: branchIds } });

    if (categories.length === 0) {
      return res.status(200).json({ responseCode: 400, message: "No categories found for these branches" });
    }

    res.status(200).json({
      responseCode: 200,
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};





module.exports = { createCategory, getCategoriesBySellerId, addSubCategory ,
  editCategory,
  toggleCategoryStatus,
  getAllCategories
};
