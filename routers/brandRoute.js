const express = require('express');
const router = express.Router();
const brandController = require("../controller/brandController")



router.post("/addBrand",brandController.addBrand);


module.exports = router