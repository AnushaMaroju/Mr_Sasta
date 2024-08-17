const express = require('express');
const router = express.Router();
const verification = require("../middleware/tokenVerification");
const sellerRoleController = require("../controller/sellerRoleController");


router.post("/addSellerRole", verification.userVerify, sellerRoleController.createSellerRole);

router.get("/listOfSellerRoles", verification.userVerify, sellerRoleController.listSellerRoles);


router.get("/listOfSellerNameRoles",verification.userVerify,sellerRoleController.listONLYNameSellerRoles)

router.put("/editSellerRoles", verification.userVerify, sellerRoleController.editSellerRole);



router.post("/roleSellerStatus", verification.userVerify, sellerRoleController.toggleRoleStatus);

router.post("/getSingleSellerRole", verification.userVerify, sellerRoleController.getSingleSellerRole);





module.exports = router;








 








