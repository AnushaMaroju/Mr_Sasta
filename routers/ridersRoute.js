const express = require('express');
const router = express.Router();
const riderController = require("../controller/riderController");
const verification = require("../middleware/tokenVerification");




router.post("/addRider",verification.userVerify,riderController.addRider);

router.put("/toggleRider",verification.userVerify,riderController.toggleRiderStatus);

router.get("/getListOfRidersInfo",verification.userVerify,riderController.getListOfRidersInfo);

router.delete("/deleteRider",verification.userVerify,riderController.deleteRider);

module.exports = router