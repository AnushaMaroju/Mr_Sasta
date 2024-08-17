const express = require('express');
const router = express.Router();
const UserController = require("../controller/userController")
const verification = require("../middleware/tokenVerification");



router.post("/generateUserOTP",UserController.generateUserOTP);
router.post("/userRegister",verification.userVerify,UserController.registerUser)
router.post("/verifyOtp",UserController.verifyOtp)
router.get("/getUser", verification.userVerify, UserController.getUserProfile);
router.get("/getUserOrCustomerList",verification.userVerify,UserController.getUserOrCustomerList);
router.put("/editUserProfile",verification.userVerify,UserController.editUserProfile)


module.exports = router