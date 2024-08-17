let sellerFeaturesModel = require("../models/sellerFeatueresModel");

let sellerModel = require("../models/sellerModel");

let helper = require("../helper/helper")


let isSeller= async(adminId)=>{
    try {
        const findSeller = await sellerModel.findById(adminId);
        return findSeller ? true : false;
    } catch (error) {
        console.error(error);
      return false;
    }
}

 
const createSellerfetaure = async (req, res) => {
    try {
      const adminId = req.userId.id;
      const isSellerUser = await isSeller(adminId);
  
      if (!isSellerUser) {
        return res.status(403).json({
          message: "Unauthorized: Only seller users can add seller Feature. give seller token",
          responseCode: 403,
        });
      }
  
 
      const { featureName, privileges, icon,endPoint,source } = req.body;
  
 
      const existingSellerFeature = await sellerFeaturesModel.findOne({
        featureName,
      });
  
      if (existingSellerFeature) {
        return res.status(200).json({
          message: "Feature with the same name already exists.",
          responseCode: 400,
        });
      }

      const newSellerFeature = new sellerFeaturesModel({
        featureName,
        privileges,
        createdBy: adminId,
        icon,endPoint,source
      });
  
     
      const savedSellerFeature = await newSellerFeature.save();
  
      res.status(201).json({
        message: "Seller Feature added successfully.",
        data: savedSellerFeature,
        responseCode: 200,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
        responseCode: 500,
      });
    }
  };
  


  const editSellerFeature = async (req, res) => {
    try {
      const adminId = req.userId.id;
      const isSellerUser = await isSeller(adminId);
  
      if (!isSellerUser) {
        return res.status(403).json({
          message: "Unauthorized: Only seller users can edit Seller Feature.",
          responseCode: 403,
        });
      }
  
      const { featureId, featureName, privileges, icon, endPoint, source, status } = req.body;
  
      if (!featureId) {
        return res.status(400).json({
          message: "Bad Request: featureId is required for editing.",
          responseCode: 400,
        });
      }
  
      const existingSellerFeature = await sellerFeaturesModel.findById(featureId);
      if (!existingSellerFeature) {
        return res.status(404).json({
          message: "Seller Feature not found.",
          responseCode: 404,
        });
      }
  
      existingSellerFeature.featureName = featureName || existingSellerFeature.featureName;
      existingSellerFeature.privileges = privileges || existingSellerFeature.privileges;
      existingSellerFeature.icon = icon || existingSellerFeature.icon;
      existingSellerFeature.endPoint = endPoint || existingSellerFeature.endPoint;
      existingSellerFeature.source = source || existingSellerFeature.source;
      existingSellerFeature.status = status !== undefined ? status : existingSellerFeature.status;
      existingSellerFeature.updated_at = helper.timeWithDate();
  
      const updatedSellerFeature = await existingSellerFeature.save();
  
      res.status(200).json({
        responseCode: 200,
        message: "Seller Feature updated successfully.",
        data: updatedSellerFeature,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
        responseCode: 500,
      });
    }
  };
  


  const listSellerFeatures = async (req, res) => {
    try {
      const adminId = req.userId.id;
      const isSellerUser = await isSeller(adminId);
  
      if (!isSellerUser) {
        return res.status(403).json({
          message: "Unauthorized: Only seller users can list Seller Features.",
          responseCode: 403,
        });
      }
  
      const sellerFeaturesList = await sellerFeaturesModel.find();
  
      const transformedFeatures = sellerFeaturesList.map(feature => ({
        ...feature.toObject(),
        featureId: feature._id,
      }));
  
      res.status(200).json({
        responseCode: 200,
        message: "Seller Features retrieved successfully.",
        data: transformedFeatures,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
        responseCode: 500,
      });
    }
  };


  const changeSellerFeatureStatus = async (req, res) => {
    try {
      const { featureId } = req.body;
  
      if (!featureId) {
        return res.status(400).json({
          responseCode: 400,
          message: "Bad Request: featureId is required.",
          data: {},
        });
      }
  
      const existingSellerFeature = await sellerFeaturesModel.findById(featureId);
      if (!existingSellerFeature) {
        return res.status(404).json({
          responseCode: 404,
          message: "Seller Feature not found.",
          data: {},
        });
      }
  
      existingSellerFeature.status = !existingSellerFeature.status;
  
      await existingSellerFeature.save();
  
      res.status(200).json({
        responseCode: 200,
        message: `Seller Feature status toggled to ${existingSellerFeature.status ? 'active' : 'inactive'}`,
        data: existingSellerFeature,
      });
    } catch (error) {
      console.error('Error toggling seller feature status:', error);
      res.status(500).json({
        responseCode: 500,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };
  
  

module.exports = {
    isSeller,
    createSellerfetaure,
    editSellerFeature,
    changeSellerFeatureStatus,
    listSellerFeatures
}