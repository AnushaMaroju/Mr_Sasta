const express = require('express');
const router = express.Router();
const categoryController = require("../controller/categoryController")
const verification = require("../middleware/tokenVerification");



router.post("/addCategory",verification.userVerify,categoryController.createCategory);
router.post("/addSubCatgory",verification.userVerify,categoryController.addSubCategory);
router.put("/editCategory",verification.userVerify,categoryController.editCategory);
router.put("/toggleCategory",verification.userVerify,categoryController.toggleCategoryStatus);
router.get("/listOfCatgories",verification.userVerify,categoryController.getAllCategories)



module.exports = router