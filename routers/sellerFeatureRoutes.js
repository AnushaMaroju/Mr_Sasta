const express = require('express');
const router = express.Router();
const verification = require("../middleware/tokenVerification");
const sellerFetaures = require("../controller/sellerFeatureController");



router.post("/addSellerFeatures", verification.userVerify, sellerFetaures.createSellerfetaure);


router.put("/editSellerFeature", verification.userVerify, sellerFetaures.editSellerFeature);

router.get("/ListOfSellerFeatures", verification.userVerify, sellerFetaures.listSellerFeatures);


router.put("/changeSellerStatus", verification.userVerify, sellerFetaures.changeSellerFeatureStatus);

module.exports = router;


















