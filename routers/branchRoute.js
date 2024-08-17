const express = require('express');
const router = express.Router();
const branchRoute = require("../controller/branchController");
const verification = require("../middleware/tokenVerification");




router.post("/addBranch",verification.userVerify,branchRoute.createBranch);
router.post("/getBranchesBySellerId",verification.userVerify,branchRoute.getBranchesBySellerId)


module.exports = router