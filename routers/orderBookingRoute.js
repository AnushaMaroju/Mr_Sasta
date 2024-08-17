const express = require('express');
const router = express.Router();
const OrderCOntroller = require("../controller/orderBooking")
const verification = require("../middleware/tokenVerification");

router.post("/placeOrder",verification.userVerify,OrderCOntroller.PlaceOrder);

router.post("/confirmOrder",verification.userVerify,OrderCOntroller.OrderConfirm)

router.post("/createCoupon",verification.userVerify,OrderCOntroller.createCoupon);

router.post("/confirmPayment",verification.userVerify,OrderCOntroller.confirmPayment);

router.get("/getListOfOrders",verification.userVerify,OrderCOntroller.getListOfOrders);

router.post("/getOrderSummary",verification.userVerify,OrderCOntroller.getOrderSummary);

router.put("/updateOrderStatus",verification.userVerify,OrderCOntroller.updateOrderStatus);

router.post("/getListOfOrdersInfos",verification.userVerify,OrderCOntroller.getListOfOrdersInfos);

router.get("/orderManagementList",verification.userVerify,OrderCOntroller.orderManagementList);

router.post("/ReturnedProudctInfos",verification.userVerify,OrderCOntroller.ReturnedProductInfos);

router.post("/UpdatePurchaseQuantity",verification.userVerify,OrderCOntroller.UpdatePurchaseQuantity);

router.post("/CancelOrder",verification.userVerify,OrderCOntroller.CancelOrder);

 router.post("/RemoveProductFromCart",verification.userVerify,OrderCOntroller.RemoveProductFromCart);//
  

 router.post("/AddToCart",verification.userVerify,OrderCOntroller.AddedToCart);

 router.get("/GetListOFCartItems",verification.userVerify,OrderCOntroller.GetListOFCartItems);

module.exports = router