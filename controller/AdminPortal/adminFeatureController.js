
const adminFeaturesModel= require("../../models/adminPortal/adminFeatureModel");

const employeModel = require("../../models/adminPortal/employeModel");



const isAdmin = async (adminId) => {
    try {
      const adminUser = await employeModel.findById(adminId);
      return adminUser ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  
  const createAdminFeature = async (req, res) => {
    try {
      const adminId = req.userId.id;
      const isAdminUser = await isAdmin(adminId);
  
      if (!isAdminUser) {
        return res.status(403).json({
          message: "Unauthorized: Only admin users can add Admin Feature.",
          responseCode: 403,
        });
      }
  
 
      const { featureName, privileges, icon,endPoint,source } = req.body;
  
 
      const existingAdminFeature = await adminFeaturesModel.findOne({
        featureName,
      });
  
      if (existingAdminFeature) {
        return res.status(200).json({
          message: "Feature with the same name already exists.",
          responseCode: 400,
        });
      }

      const newAdminFeature = new adminFeaturesModel({
        featureName,
        privileges,
        createdBy: adminId,
        icon,endPoint,source
      });
  
     
      const savedAdminFeature = await newAdminFeature.save();
  
      res.status(201).json({
        message: "Admin Feature added successfully.",
        data: savedAdminFeature,
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
  


  const editAdminFeature = async (req, res) => {
    try {
      const adminId = req.userId.id;
      const isAdminUser = await isAdmin(adminId);
  
      if (!isAdminUser) {
        return res.status(403).json({
          message: "Unauthorized: Only admin users can edit Admin Feature.",
          responseCode: 403,
        });
      }
  
      const { featureId, featureName, privileges, icon } = req.body;
  

      if (!featureId) {
        return res.status(400).json({
          message: "Bad Request: featureId is required for editing.",
          responseCode: 400,
        });
      }
  
    
      const existingAdminFeature = await adminFeaturesModel.findById(featureId);
      if (!existingAdminFeature) {
        return res.status(404).json({
          message: "Admin Feature not found.",
          responseCode: 404,
        });
      }
  
      
      existingAdminFeature.featureName =
        featureName || existingAdminFeature.featureName;
      existingAdminFeature.privileges =
        privileges || existingAdminFeature.privileges;
      existingAdminFeature.icon = icon || existingAdminFeature.icon;
  
 
      const updatedAdminFeature = await existingAdminFeature.save();
  
      res.status(200).json({
        responseCode: 200,
        message: "Admin Feature updated successfully.",
        data: [updatedAdminFeature]
      
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
  




  const listAdminFeatures = async (req, res) => {
    try {
        const adminId = req.userId.id;
        const isAdminUser = await isAdmin(adminId);

        if (!isAdminUser) {
            return res.status(403).json({
                message: "Unauthorized: Only admin users can list Admin Features.",
                responseCode: 403,
            });
        }

    
        const adminFeaturesList = await adminFeaturesModel.find();

    
        const transformedFeatures = adminFeaturesList.map(feature => ({
            ...feature.toObject(),  
            featureId: feature._id 
        }));

        res.status(200).json({
          responseCode: 200,
            message: "Admin Features retrieved successfully.",
            data: transformedFeatures
           
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

  const changeStatus = async (req, res) => {
    try {
        const { featureId } = req.body;

        if (!featureId) {
            return res.status(400).json({
                responseCode: 400,
                message: "Bad Request: featureId is required.",
                data: {}
            });
        }

    
        const existingAdminFeature = await adminFeaturesModel.findById(featureId);
        if (!existingAdminFeature) {
            return res.status(404).json({
                responseCode: 404,
                message: "Admin Feature not found.",
                data: {}
            });
        }

  
        existingAdminFeature.status = !existingAdminFeature.status; 

    
        await existingAdminFeature.save();

        res.status(200).json({
            responseCode: 200,
            message: `Admin Feature status toggled to ${existingAdminFeature.status ? 'active' : 'inactive'}`,
            data: existingAdminFeature
        });
    } catch (error) {
        console.error('Error toggling admin feature status:', error);
        res.status(500).json({
            responseCode: 500,
            message: 'Internal Server Error',
            error: error.message
        });
    } 
};



  
  module.exports={
  createAdminFeature,
  editAdminFeature,
  listAdminFeatures,
  changeStatus,
  }