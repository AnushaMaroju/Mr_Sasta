const adminRolesModel = require("../../models/adminPortal/rolemodel");
const employeModel = require("../../models/adminPortal/employeModel");
const helper = require("../../helper/helper");
const adminFeaturesModel = require("../../models/adminPortal/adminFeatureModel");

const isAdmin = async (adminId) => {
  try {
    const adminUser = await employeModel.findById(adminId);
    return adminUser ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const createAdminRole = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isAdminUser = await isAdmin(adminId);

    if (!isAdminUser) {
      return res.status(200).json({
        message: "Unauthorized: Only admin users can create Admin Roles.",
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

    const existingRole = await adminRolesModel.findOne({
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
      const featureDoc = await adminFeaturesModel.findById({
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

    const newAdminRole = new adminRolesModel({
      roleName,
      features: featureDetails,
      createdBy: adminId,
      source,
    });

    const savedAdminRole = await newAdminRole.save();

    res.status(200).json({
      message: "Role created successfully.",
      data: savedAdminRole,
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

const listAdminRoles = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isAdminUser = await isAdmin(adminId);

    if (!isAdminUser) {
      return res.status(200).json({
        message: "Unauthorized: Only admin users can list Admin Roles.",
        responseCode: 400,
      });
    }

    const adminRolesList = await adminRolesModel.find().sort({ $natural: -1 });

    res.status(200).json({
      message: "Admin Roles retrieved successfully.",
      data: adminRolesList,
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

const listONLYNameAdminRoles = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isAdminUser = await isAdmin(adminId);

    if (!isAdminUser) {
      return res.status(200).json({
        message: "Unauthorized: Only admin users can list Admin Roles.",
        responseCode: 400,
      });
    }

    const adminRolesList = await adminRolesModel.find().select("roleName");

    const roleNames = adminRolesList.map((role) => ({
      _id: role._id,
      roleName: role.roleName,
    }));

    res.status(200).json({
      message: "Admin Roles retrieved successfully.",
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

const getSingleAdminRole = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isAdminUser = await isAdmin(adminId);

    if (!isAdminUser) {
      return res.status(200).json({
        message: "Unauthorized: Only admin users can list Admin Roles.",
        responseCode: 400,
      });
    }

    const { roleId } = req.body;

    const adminRole = await adminRolesModel.findById(roleId);

    if (!adminRole) {
      return res.status(200).json({
        message: "Role not found",
        responseCode: 400,
      });
    }

    const adminFeaturesList = await adminFeaturesModel.find();

    const responseObj = {
      roleName: adminRole.roleName,
      source: adminRole.source,
      features: adminFeaturesList.map((feature) => ({
        featureId: feature._id.toString(),
        featureName: feature.featureName,
        source: feature.source,
        status: adminRole.features.some(
          (roleFeature) =>
            roleFeature.featureId.toString() === feature._id.toString()
        ),
      })),
    };

    res.status(200).json({
      message: "Admin Role retrieved successfully.",
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

const editAdminRole = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isAdminUser = await isAdmin(adminId);

    if (!isAdminUser) {
      return res.status(200).json({
        message: "Unauthorized: Only admin users can edit Admin Roles.",
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

    const existingAdminRole = await adminRolesModel.findById(roleId);
    if (!existingAdminRole) {
      return res.status(200).json({
        message: "Admin Role not found.",
        responseCode: 400,
      });
    }

    const existingRoleWithSameName = await adminRolesModel.findOne({
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
      const featureDoc = await adminFeaturesModel.findById(featureId.featureId);
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

    existingAdminRole.roleName = roleName;
    existingAdminRole.features = featureDetails;
    existingAdminRole.source = source || existingAdminRole.source;
    existingAdminRole.updated_at = helper.timeWithDate();

    const updatedAdminRole = await existingAdminRole.save();

    res.status(200).json({
      message: "Admin Role updated successfully.",
      data: updatedAdminRole,
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


    const findRole = await adminRolesModel.findById(roleId);

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

const deleteAdminRole = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const isAdminUser = await isAdmin(adminId);

    if (!isAdminUser) {
      return res.status(200).json({
        message: "Unauthorized: Only admin users can delete Admin Roles.",
        responseCode: 403,
      });
    }

    const roleId = req.body.roleId;


    if (!roleId) {
      return res.status(400).json({
        message: "Bad Request: Role ID is required.",
        responseCode: 400,
      });
    }


    const adminRole = await adminRolesModel.findById(roleId);

    if (!adminRole) {
      return res.status(404).json({
        message: "Not Found: Admin Role not found.",
        responseCode: 404,
      });
    }


    await adminRole.deleteOne();

    res.status(200).json({
      message: "Admin Role deleted successfully.",
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

module.exports = {
  isAdmin,
  createAdminRole,
  listAdminRoles,
  getSingleAdminRole,
  editAdminRole,
  toggleRoleStatus,
  listONLYNameAdminRoles,
  deleteAdminRole,
};
