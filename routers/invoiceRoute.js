
const InvoiceController = require("../controller/invoice");
const express = require('express');
const router = express.Router();
const verification = require("../middleware/tokenVerification");


router.post("/generateInvoice",verification.userVerify,InvoiceController.Invoice)


module.exports = router;