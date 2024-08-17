const sellerRoleModel = require("../models/sellerRolesModel");
const sellerModel = require("../models/sellerModel");
const helper = require("../helper/helper");
const sellerFeaturesModel = require("../models/sellerFeatueresModel");

let isSeller= async(adminId)=>{
    try {
        const findSeller = await sellerModel.findById(adminId);
        return findSeller ? true : false;
    } catch (error) {
        console.error(error);
      return false;
    }
}



const createSellerRole = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isSellerUser = await isSeller(adminId);

    if (!isSellerUser) {
      return res.status(200).json({
        message: "Unauthorized: Only Seller users can create Seller Roles.",
        responseCode: 400,
      });
    }

    const { roleName, features, source } = req.body;

    if (!roleName || !features || features.length === 0) {
      return res.status(200).json({
        message:
          "Role name and at least one feature are required for creating a role.",
        responseCode: 400,
      });
    }

    const existingRole = await sellerRoleModel.findOne({
      roleName: new RegExp(`^${roleName}$`, "i"),
    });

    if (existingRole) {
      return res.status(200).json({
        message: "Role with the same name already exists.",
        responseCode: 400,
      });
    }

    const featureDetails = [];
    for (const featureId of features) {
      const featureDoc = await sellerFeaturesModel.findById({
        _id: featureId.featureId,
      });
      console.log(featureDoc);
      if (!featureDoc) {
        return res.status(200).json({
          message: `Feature with ID ${featureId} not found.`,
          responseCode: 400,
        });
      } else {
        const feature = {
          featureId: featureDoc._id,
          featureName: featureDoc.featureName,
          icon: featureDoc.icon,
          endPoint: featureDoc.endPoint,
          privileges: featureDoc.privileges,
        };
        featureDetails.push(feature);
      }
    }

    const newSellerRole = new sellerRoleModel({
      roleName,
      features: featureDetails,
      createdBy: adminId,
      source,
    });

    const savedSellerRole = await newSellerRole.save();

    res.status(200).json({
      message: "Role created successfully.",
      data: savedSellerRole,
      responseCode: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      responseCode: 500,
    });
  }
};

const listSellerRoles = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isSellerUser = await isSeller(adminId);

    if (!isSellerUser) {
      return res.status(200).json({
        message: "Unauthorized: Only admin users can list Admin Roles.",
        responseCode: 400,
      });
    }

    const sellerRolesList = await sellerRoleModel.find().sort({ $natural: -1 });

    res.status(200).json({
      message: "Seller Roles retrieved successfully.",
      data: sellerRolesList,
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

const listONLYNameSellerRoles = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isSellerUser = await isSeller(adminId);

    if (!isSellerUser) {
      return res.status(200).json({
        message: "Unauthorized: Only Seller users can list seller Roles.",
        responseCode: 400,
      });
    }

    const sellerRolesList = await sellerRoleModel.find().select("roleName");

    const roleNames = sellerRolesList.map((role) => ({
      _id: role._id,
      roleName: role.roleName,
    }));

    res.status(200).json({
      message: "seller Roles retrieved successfully.",
      data: roleNames,
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

const getSingleSellerRole = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isSellerUser = await isSeller(adminId);

    if (!isSellerUser) {
      return res.status(200).json({
        message: "Unauthorized: Only admin users can list Admin Roles.",
        responseCode: 400,
      });
    }

    const { roleId } = req.body;

    const sellerRole = await sellerRoleModel.findById(roleId);

    if (!sellerRole) {
      return res.status(200).json({
        message: "Role not found",
        responseCode: 400,
      });
    }

    const sellerFeaturesList = await sellerFeaturesModel.find();

    const responseObj = {
      roleName: sellerRole.roleName,
      source: sellerRole.source,
      features: sellerFeaturesList.map((feature) => ({
        featureId: feature._id.toString(),
        featureName: feature.featureName,
        source: feature.source,
        status: sellerRole.features.some(
          (roleFeature) =>
            roleFeature.featureId.toString() === feature._id.toString()
        ),
      })),
    };

    res.status(200).json({
      message: "Seller Role retrieved successfully.",
      data: responseObj,
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

const editSellerRole = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isSellerUser = await isSeller(adminId);

    if (!isSellerUser) {
      return res.status(200).json({
        message: "Unauthorized: Only Seller users can edit Seller Roles.",
        responseCode: 400,
      });
    }

    const { roleId, roleName, features, source } = req.body;

    if (!roleId) {
      return res.status(200).json({
        message: "roleId is required for editing.",
        responseCode: 400,
      });
    }

    if (!roleName || !features || features.length === 0) {
      return res.status(200).json({
        message:
          "Role name and at least one feature are required for editing a role.",
        responseCode: 400,
      });
    }

    const existingSellerRole = await sellerRoleModel.findById(roleId);
    if (!existingSellerRole) {
      return res.status(200).json({
        message: "Seller Role not found.",
        responseCode: 400,
      });
    }

    const existingRoleWithSameName = await sellerRoleModel.findOne({
      roleName,
    });
    if (
      existingRoleWithSameName &&
      existingRoleWithSameName._id.toString() !== roleId
    ) {
      return res.status(200).json({
        message: "Role name already exists.",
        responseCode: 400,
      });
    }

    const featureDetails = [];
    for (const featureId of features) {
      const featureDoc = await sellerFeaturesModel.findById(featureId.featureId);
      console.log(featureDoc);
      if (!featureDoc) {
        return res.status(200).json({
          message: `Feature with ID ${featureId} not found.`,
          responseCode: 400,
        });
      } else {
        const feature = {
          featureId: featureDoc._id,
          featureName: featureDoc.featureName,
          icon: featureDoc.icon,
          endPoint: featureDoc.endPoint,
          privileges: featureId.privileges,
        };
        featureDetails.push(feature);
      }
    }

    existingSellerRole.roleName = roleName;
    existingSellerRole.features = featureDetails;
    existingSellerRole.source = source || existingSellerRole.source;
    existingSellerRole.updated_at = helper.timeWithDate();

    const updatedSellerRole = await existingSellerRole.save();

    res.status(200).json({
      message: "Seller Role updated successfully.",
      data: updatedSellerRole,
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

const toggleRoleStatus = async (req, res) => {
  try {
    const { roleId } = req.body;


    const findRole = await sellerRoleModel.findById(roleId);

    if (!findRole) {
      return res.status(200).json({
        responseCode: 400,
        message: "Role not found",
        data: {},
      });
    }


    findRole.status = findRole.status === "active" ? "inactive" : "active";


    await findRole.save();

    res.status(200).json({
      responseCode: 200,
      message: `Role status toggled to ${findRole.status}`,
      data: findRole,
    });
  } catch (error) {
    console.error("Error toggling role status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = {
  isSeller,
  createSellerRole,
  listSellerRoles,
  getSingleSellerRole,
  editSellerRole,
  toggleRoleStatus,
  listONLYNameSellerRoles,

};
