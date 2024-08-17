const express = require('express');
const router = express.Router();
const verification = require("../../middleware/tokenVerification");
const adminController = require("../../controller/AdminPortal/adminRoleController");


router.post("/addRole", verification.userVerify, adminController.createAdminRole);

router.get("/listOfRoles", verification.userVerify, adminController.listAdminRoles);


router.get("/listOfAdminRoles",verification.userVerify,adminController.listONLYNameAdminRoles)

router.put("/editRoles", verification.userVerify, adminController.editAdminRole);



router.post("/roleStatus", verification.userVerify, adminController.toggleRoleStatus);

router.post("/singleAdminRole", verification.userVerify, adminController.getSingleAdminRole);



router.delete("/deleteRole",verification.userVerify,adminController.deleteAdminRole)

module.exports = router;








 








