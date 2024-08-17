const Seller = require("../models/sellerModel");
const sellerRoleModel = require("../models/sellerRolesModel");
const bcrypt = require("bcrypt");
const authorizationValues = require("../config/auth");
const helper = require("../helper/helper");

const createSeller = async (req, res) => {
  try {
    const { name, phone, email, password, gst, pan, role_Id, shopName } =
      req.body;

    if (!role_Id) {
      return res.status(200).json({
        responseCode: 400,
        message: "Role ID is required.",
      });
    }
    if (!shopName) {
      return res.status(200).json({
        responseCode: 400,
        message: "shopName is required.",
      });
    }

    const existingRole = await sellerRoleModel.findById(role_Id);
    if (!existingRole) {
      return res.status(200).json({
        responseCode: 400,
        message: "SellerRole not found.",
      });
    }
    const existingSeller = await Seller.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingSeller) {
      return res
        .status(400)
        .json({ message: "Seller with this email or phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = new Seller({
      name,
      phone,
      email,
      password: hashedPassword,
      role_Id: role_Id,
      roleName: existingRole.roleName,
      roleId: helper.generateRoleID(),
      gst,
      pan,
      shopName,
    });

    const savedSeller = await newSeller.save();

    res
      .status(201)
      .json({
        responseCode: 200,
        message: "Seller created successfully",
        seller: savedSeller,
      });
  } catch (error) {
    console.error("Error creating seller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        responseCode: 400,
        message: "Email and password are required.",
      });
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(400).json({
        responseCode: 400,
        message: "Seller not found. Please check your email.",
      });
    }

    if (!seller.password) {
      return res.status(400).json({
        responseCode: 400,
        message: "Password not set for the user.",
      });
    }

    if (seller.status === "blocked") {
      return res.status(401).json({
        responseCode: 401,
        message: "User account is blocked. Please contact the seller.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        responseCode: 400,
        message: "Invalid password.",
      });
    }

    const token = await helper.token(
      { id: seller._id },
      authorizationValues.secretKey
    );
    seller.token = token;
    await seller.save();

    res.status(200).json({
      responseCode: 200,
      message: "Login successfull",
      token,
      sellerData: seller,
    });
  } catch (error) {
    console.error("Error logging in seller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createSubSeller = async (req, res) => {
  try {
    const sellerId = req.userId.id;

    if(!sellerId){
      return res.status(200).send({
        responseCode:400,
        message:"SellerId is Required"
      })
    }

    const { name, phone, email, password, gst, pan, role_Id } = req.body;

    if (!role_Id) {
      return res.status(200).json({
        responseCode: 400,
        message: "Role ID is required.",
      });
    }
    const existingRole = await sellerRoleModel.findById(role_Id);
    if (!existingRole) {
      return res.status(200).json({
        responseCode: 400,
        message: "SellerRole not found.",
      });
    }
    const existingSeller = await Seller.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingSeller) {
      return res
        .status(400)
        .json({ message: "subSeller with this email or phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = new Seller({
      name,
      phone,
      email,
      password: hashedPassword,
      role_Id: role_Id,
      roleName: existingRole.roleName,
      roleId: helper.generateRoleID(),
      gst,
      pan,
      sellerId: sellerId,
    });

    const savedSeller = await newSeller.save();

    res
      .status(201)
      .json({
        responseCode: 200,
        message: "subSeller created successfully",
        seller: savedSeller,
      });
  } catch (error) {
    console.error("Error creating seller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const editSeller = async (req, res) => {
  try {
    const adminId = req.userId.id;

    const { sellerId, name, phone, email, role_Id, gst, pan, shopName } =
      req.body;

    if (!role_Id || typeof role_Id !== "string") {
      return res.status(400).json({
        message:
          "Invalid or missing role ID. It must be a single string value.",
        responseCode: 400,
      });
    }

    // Find the role by ID
    const role = await sellerRoleModel.findById(role_Id);
    if (!role) {
      return res.status(400).json({
        message: "Role not found.",
        responseCode: 400,
      });
    }

    // Find the seller by ID
    const existingSeller = await Seller.findById(sellerId);
    if (!existingSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Update role if different
    if (existingSeller.role_Id !== role_Id) {
      existingSeller.role_Id = role_Id;
      existingSeller.roleName = role.roleName;
      existingSeller.status = "inactive"; // Mark the seller as inactive if role changes
    }

    // Update seller information
    existingSeller.name = name;
    existingSeller.phone = phone;
    existingSeller.email = email;
    existingSeller.gst = gst;
    existingSeller.pan = pan;
    existingSeller.shopName = shopName;

    // Save the updated seller
    const updatedSeller = await existingSeller.save();

    // Respond with success
    res.json({
      responseCode: 200,
      message: "Seller updated successfully",
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("Error updating seller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const toggleSellerStatus = async (req, res) => {
  try {
    const { sellerId } = req.body;

    if (!sellerId) {
      return res.status(400).json({
        responseCode: 400,
        message: "Seller ID is required",
        data: {},
      });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        responseCode: 404,
        message: "Seller not found",
        data: {},
      });
    }

    seller.status = seller.status === "active" ? "blocked" : "active";
    await seller.save();

    return res.status(200).json({
      responseCode: 200,
      message: `Seller status toggled to ${seller.status}`,
      data: seller,
    });
  } catch (error) {
    console.error("Error toggling seller status:", error);
    return res.status(500).json({
      responseCode: 500,
      message: "Internal Server Error",
      data: {},
    });
  }
};

const getSellerById = async (req, res) => {
  try {
    const { id } = req.body;
    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ seller });
  } catch (error) {
    console.error("Error retrieving seller:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getAllSellers = async (req, res) => {
  try {
  
    const sellers = await Seller.find();

    res.status(200).json({
      responseCode: 200,
      message: "Sellers retrieved successfully",
      data: sellers
    });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  createSeller,
  getSellerById,
  loginSeller,
  toggleSellerStatus,
  editSeller,
  createSubSeller,
  getAllSellers
};
