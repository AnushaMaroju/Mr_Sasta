const express = require('express');
const router = express.Router();
const verification = require("../../middleware/tokenVerification");
const adminFeatures = require("../../controller/AdminPortal/adminFeatureController");



router.post("/adminFeatures", verification.userVerify, adminFeatures.createAdminFeature);


router.put("/editFeature", verification.userVerify, adminFeatures.editAdminFeature);

router.get("/ListOfFeatures", verification.userVerify, adminFeatures.listAdminFeatures);


router.put("/changeStatus", verification.userVerify, adminFeatures.changeStatus);

module.exports = router;


















