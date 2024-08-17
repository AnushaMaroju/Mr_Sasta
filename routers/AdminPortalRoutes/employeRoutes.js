
const express = require('express');
const router = express.Router();
const UserController = require("../../controller/AdminPortal/employeController");
const verification = require("../../middleware/tokenVerification");

router.post("/createAdmin", UserController.CreateAdmin);
router.post("/adminLogin", UserController.adminLogin);


// router.get("/getUserProfile",verification.userVerify,UserController.getAdminProfile);

router.post("/addEmploye",verification.userVerify,UserController.addEmploye);

router.post("/employeLogin",verification.userVerify,UserController.employeLogin);

router.put("/editEmployee",verification.userVerify,UserController.editEmployee);

router.post("/toggleEmployeeStatus",verification.userVerify,UserController.toggleEmployeeStatus)

router.put("/editProfile",verification.userVerify,UserController.editProfile);

router.get("/listOfEmployes",verification.userVerify,UserController.listOfEmployes);

router.post("/sideBarAPi",verification.userVerify,UserController.sideBarAPi)
// router.post(
//     "/forgotPasswordOtpVerify",
//     UserController.forgotPasswordOtpVerify
//   );
  router.put(
    "/changePassword",
    UserController.changePassword)

    module.exports = router;