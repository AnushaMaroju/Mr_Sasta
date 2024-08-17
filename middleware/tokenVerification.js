const jwt = require("jsonwebtoken");
const SecreateKey = require("../config/auth");
const AdminModel = require("../models/adminPortal/employeModel");
const SellerModel = require("../models/sellerModel");
const UserModel = require("../models/userModel");

let userVerify = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(200).send({
        responseCode:400,
        message: "Token is not valid",
        error: "Token is missing",
      });
    }

    let getToken = token.split(" ")[1];
    if (!getToken) {
      return res.status(200).send({
        responseCode:400,
        message: "Provide a proper token",
      });
    }

    const decode = jwt.verify(getToken, SecreateKey.secreateKey);

    let userType;
    let user = await AdminModel.findById(decode.id);
    if (user) {
      userType = "admin";
    } else {
      user = await SellerModel.findById(decode.id);
      if (user) {
        userType = "seller";
      } else {
        user = await UserModel.findById(decode.id);
        if (user) {
          userType = "user";
        }
      }
    }

    if (!user) {
      return res.status(200).send({
        responseCode:400,
        message: "User not found",
      });
    }

    if (user.status !== "active") {
      return res.status(200).send({
        responseCode:400,
        message: "Access denied",
      });
    }

    req.userId = { id: decode.id, userType };

    next();
  } catch (error) {
    return res.status(500).send({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { userVerify };
