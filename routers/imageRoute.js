let express = require("express");
let router = express.Router();
let multer = require("multer");
let imageController = require("../controller/imageUpload");

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/uploadImage", upload.single("file"), imageController.image);

module.exports = router;
