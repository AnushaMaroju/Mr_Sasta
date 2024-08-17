const express = require('express');
const router = express.Router();
const productController = require("../controller/productController")
const verification = require("../middleware/tokenVerification");



router.post("/addProduct",verification.userVerify,productController.addProduct);

router.get("/listOfProducts",verification.userVerify,productController.getListOfProducts);

router.post("/getIdByProductInfo",verification.userVerify,productController.getIdByProductInfo)

router.put("/editProduct",verification.userVerify,productController.editProduct);

router.put("/toggleProduct",verification.userVerify,productController.toggleProductStatus);

router.post("/getProductsByCategoryId",verification.userVerify,productController.getProductsByCategoryId)


module.exports = router