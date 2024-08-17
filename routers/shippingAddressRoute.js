const express = require('express');
const router = express.Router();
const shippingController = require("../controller/shippingAddressController");
const verification = require("../middleware/tokenVerification");


router.post("/addAddress", verification.userVerify, shippingController.addAddress);
router.put("/editAddress", verification.userVerify, shippingController.editAddress);
router.delete("/deleteAddress",verification.userVerify, shippingController.deleteAddress);
router.get("/getAddress",verification.userVerify,shippingController.getAddress)


module.exports = router;
