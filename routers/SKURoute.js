const express = require('express');
const router = express.Router();
const skuController = require("../controller/skuController")
const verification = require("../middleware/tokenVerification");



//updateSku
router.post("/addSku",verification.userVerify,skuController.createSKU);

router.post("/listOfSKUs",verification.userVerify,skuController.listOfSKUsByProductId);

router.put("/editSku",verification.userVerify,skuController.editSKU);

router.put("/toggleSku",verification.userVerify,skuController.toggleSKUStatus);




module.exports = router