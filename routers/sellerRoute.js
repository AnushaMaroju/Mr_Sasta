const express = require('express');
const router = express.Router();
const sellerController = require("../controller/sellerController");
const verification = require("../middleware/tokenVerification");



router.post("/addSeller",sellerController.createSeller);
router.post("/loginSeller",sellerController.loginSeller);
router.post("/addSubSeller",verification.userVerify,sellerController.createSubSeller)
router.put("/editSeller",verification.userVerify,sellerController.editSeller);
router.post("/toggleSelerStatus",verification.userVerify,sellerController.toggleSellerStatus);
router.get("/getAllSellers",sellerController.getAllSellers)



module.exports = router