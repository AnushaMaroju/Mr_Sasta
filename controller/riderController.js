const EmployeModel = require("../models/adminPortal/employeModel");
const RiderModel = require("../models/riderModel");


const addRider = async (req, res) => {
    try {
      const adminId = req.userId.id;
      const { riderName, email, phone, drivingLicense, aadhaarNumber, address, profilePic } = req.body;
  
      const admin = await EmployeModel.findById(adminId);
      if (!admin) {
        return res.status(200).json({ 
          responseCode: 400, 
          message: "Admin not found" 
        });
      };
  
      const existingRider = await RiderModel.findOne({ email, adminId });
      if (existingRider) {
        return res.status(200).json({
          responseCode: 400,
          message: "Rider already exists with this email. Please try another.",
        });
      };
  
      const newRider = new RiderModel({
        riderName,
        email,
        phone,
        drivingLicense,
        aadhaarNumber,
        address,
        profilePic,
        adminId,
      });
  
      const savedRider = await newRider.save();
  
      res.status(201).json({
        responseCode: 200,
        message: "Rider added successfully",
        rider: savedRider,
      });
    } catch (error) {
      console.error("Error adding rider:", error);
      res.status(500).json({ 
          responseCode: 500,
          message: "Server error" 
      });
    };
  }

  const getListOfRidersInfo = async (req, res) => {
    try {
      const adminId = req.userId.id;
  
      const admin = await EmployeModel.findById(adminId);
      if (!admin) {
        return res.status(200).json({
          responseCode: 400,
          message: "Admin not found",
        });
      };
  
      const riders = await RiderModel.find({ adminId });
  
      res.status(200).json({
        responseCode: 200,
        message: "List of riders retrieved successfully",
        riders,
      });
    } catch (error) {
      console.error("Error listing riders:", error);
      res.status(500).json({
        responseCode: 500,
        message: "Server error",
      });
    };
  };


  const toggleRiderStatus = async (req, res) => {
    try {
      const adminId = req.userId.id;
      const { riderId, status } = req.body;
  
      const rider = await RiderModel.findOne({ riderId: riderId._id, adminId });
      if (!rider) {
        return res.status(200).json({ 
          responseCode: 400, 
          message: "Rider not found" 
        });
      };
  
      rider.status = status;
  
      const updatedRider = await rider.save();
      res.status(200).json({
        responseCode: 200,
        message: "Rider status updated successfully",
        rider: updatedRider,
      });
    } catch (error) {
      console.error("Error toggling rider status:", error);
      res.status(500).json({
        responseCode: 500,
        message: "Server error",
      });
    };
  };

  module.exports ={
    addRider,
    getListOfRidersInfo,
    toggleRiderStatus
  }
