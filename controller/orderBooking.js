const OrderBookingModel = require("../models/orderBooking");
const OrderBookingInfoModel = require("../models/orderBookingInfo");
const OrderSummaryModel = require("../models/orderSummary");
const helper = require("../helper/helper");
const CouponModel = require("../models/couponModel.js");
const productModel = require("../models/productModel.js");
const SKUModel = require("../models/skuModel.js");
const orderBookingInfo = require("../models/orderBookingInfo");
const UserModel = require("../models/userModel.js");
const AddressModel = require("../models/shippingAddress.js");
const Cart = require("../models/cartModel.js");
const NewOrderBookingModel = require("../models/newOrderBookingModel.js");
const newOrderBookingModel = require("../models/newOrderBookingModel.js");
const mongoose = require("mongoose");
const OrderPaymentmodel = require("../models/OrderPaymentModel.js");



// const PlaceOrder = async (req, res) => {
//   try {
//     const userId = req.userId.id;
//     const {
//       products,
//       totalItemsPrice,
//       totalDiscount,
//       totalAmount,
//       deliveryFee,
//       couponCode,
//       addressId
//     } = req.body;

//     // Validate input
//     if (!products || !Array.isArray(products) || products.length === 0) {
//       return res.status(400).send({
//         responseCode: 400,
//         message: "Products information is required and should be a non-empty array.",
//       });
//     }

//     if (!addressId) {
//       return res.status(400).send({
//         responseCode: 400,
//         message: "Address ID is required.",
//       });
//     }

//     // Create a new order booking
//     const newBooking = new OrderBookingModel({
//       bookingId: helper.BOOKINGID(),
//       userId: userId,
//       addressId: addressId,
//       createdBy: userId,
//       activeStatus: "active",
//       totalProducts: products.length,
//     });

//     const savedBooking = await newBooking.save();

//     const bookingProducts = [];
//     let totalPrice = 0;
//     let totalDiscountValue = 0;
//     let couponApplied = "";

//     // Loop through products and save order booking info
//     for (const product of products) {
//       const {
//         skuId,
//         price,
//         quantityValue,
//         sellerId,
//         typeOfRate,
//         productId,
//         productName,
//         unit,
//         purchaseQuantity,
//         discount,
//         gst,
//         sub_total,
//         final_price,
//         deliveryDate
//       } = product;

//       if (!price || !quantityValue) {
//         return res.status(400).send({
//           responseCode: 400,
//           message: "Each product should have price and quantityValue defined.",
//         });
//       }

//       // Convert grams to kilograms if necessary
//       if (unit === "grm") {
//         product.quantityValue = quantityValue / 1000;
//       }

//       totalPrice += price * purchaseQuantity;

//       const bookingInfo = new OrderBookingInfoModel({
//         orderBookingId: savedBooking._id,
//         skuId: skuId,
//         sellerId: sellerId,
//         typeOfRate: typeOfRate,
//         productId: productId,
//         productName: productName,
//         quantityValue: product.quantityValue,
//         unit: unit,
//         purchaseQuantity: purchaseQuantity || 0,
//         price: price,
//         discount: discount || 0,
//         gst: gst || 0,
//         sub_total: sub_total || 0,
//         final_price: final_price || 0,
//         createdBy: userId,
//         deliveryDate: deliveryDate || null,
//       });

//       const savedBookingInfo = await bookingInfo.save();
//       bookingProducts.push(savedBookingInfo);

//       // Log each savedBookingInfo inside the loop
//       console.log(savedBookingInfo, "Saved Booking Info");
//     }

//     // Apply coupon if available
//     if (couponCode) {
//       const coupon = await CouponModel.findOne({ code: couponCode });

//       if (coupon && coupon.isActive && new Date(coupon.expiryDate) >= new Date()) {
//         if (coupon.discount.flat > 0) {
//           totalDiscountValue = coupon.discount.flat;
//         } else if (coupon.discount.percentage > 0) {
//           totalDiscountValue = (totalPrice * coupon.discount.percentage) / 100;
//         }
//         couponApplied = couponCode;
//       } else {
//         return res.status(400).send({
//           responseCode: 400,
//           message: "Invalid or expired coupon code",
//         });
//       }
//     }

//     // Calculate final total amount
//     const finalTotalAmount = totalPrice - totalDiscountValue + (deliveryFee || 0);

//     // Create order summary
//     const orderSummary = new OrderSummaryModel({
//       orderId: savedBooking._id,
//       totalPrice: totalPrice,
//       discount: totalDiscountValue,
//       coupon: couponApplied,
//       totalAmount: finalTotalAmount,
//       deliveryFee: deliveryFee || 0,
//     });

//     const savedOrderSummary = await orderSummary.save();

//     // Clear the cart after order is placed
//     await Cart.findOneAndUpdate(
//       { userId },
//       { $set: { items: [] } } // Clear items
//     );

//     res.status(200).send({
//       responseCode: 200,
//       message: "Order placed successfully",
//       bookingId: savedBooking._id,
//       orderSummaryId: savedOrderSummary._id,
//       bookingProducts: bookingProducts,
//     });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).send({
//       responseCode: 500,
//       message: "Server error",
//     });
//   }
// }
const PlaceOrder = async (req, res) => {
  try {
    const userId = req.userId.id;
    const {
      products,
      totalItemsPrice,
      totalDiscount,
      totalAmount,
      deliveryFee,
      couponCode,
      addressId
    } = req.body;

    // Validate input
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(200).send({
        responseCode: 400,
        message: "Products information is required and should be a non-empty array.",
      });
    }

    if (!addressId) {
      return res.status(200).send({
        responseCode: 400,
        message: "Address ID is required.",
      });
    }

    // Create a new order booking
    const newBooking = new OrderBookingModel({
      bookingId: helper.BOOKINGID(),
      userId: userId,
      addressId: addressId,
      createdBy: userId,
      activeStatus: "active",
      totalProducts: products.length,
    });

    const savedBooking = await newBooking.save();

    const bookingProducts = [];
    let totalPrice = 0;
    let totalDiscountValue = 0;
    let couponApplied = "";

    // Loop through products and save order booking info
    for (const product of products) {
      const {
        skuId,
        price,
        quantityValue,
        sellerId,
        typeOfRate,
        productId,
        productName,
        unit,
        purchaseQuantity,
        discount,
        gst,
        sub_total,
        final_price,
        deliveryDate
      } = product;

      if (!price || !quantityValue) {
        return res.status(200).send({
          responseCode: 400,
          message: "Each product should have price and quantityValue defined.",
        });
      }

      // Convert grams to kilograms if necessary
      if (unit === "grm") {
        product.quantityValue = quantityValue / 1000;
      }

      totalPrice += price * purchaseQuantity;

      const bookingInfo = new OrderBookingInfoModel({
        orderBookingId: savedBooking._id,
        skuId: skuId,
        sellerId: sellerId,
        typeOfRate: typeOfRate,
        productId: productId,
        productName: productName,
        quantityValue: product.quantityValue,
        unit: unit,
        purchaseQuantity: purchaseQuantity || 0,
        price: price,
        discount: discount || 0,
        gst: gst || 0,
        sub_total: sub_total || 0,
        final_price: final_price || 0,
        createdBy: userId,
        deliveryDate: deliveryDate || null,
      });

      const savedBookingInfo = await bookingInfo.save();
      bookingProducts.push(savedBookingInfo);

      // Log each savedBookingInfo inside the loop
      console.log(savedBookingInfo, "Saved Booking Info");
    }

    // Apply coupon if available
    if (couponCode) {
      const coupon = await CouponModel.findOne({ code: couponCode });

      if (coupon && coupon.isActive && new Date(coupon.expiryDate) >= new Date()) {
        if (coupon.discount.flat > 0) {
          totalDiscountValue = coupon.discount.flat;
        } else if (coupon.discount.percentage > 0) {
          totalDiscountValue = (totalPrice * coupon.discount.percentage) / 100;
        }
        couponApplied = couponCode;
      } else {
        return res.status(200).send({
          responseCode: 400,
          message: "Invalid or expired coupon code",
        });
      }
    }

    // Calculate final total amount
    const finalTotalAmount = totalPrice - totalDiscountValue + (deliveryFee || 0);

    // Create order summary
    const orderSummary = new OrderSummaryModel({
      orderId: savedBooking._id,
      totalPrice: totalPrice,
      discount: totalDiscountValue,
      coupon: couponApplied,
      totalAmount: finalTotalAmount,
      deliveryFee: deliveryFee || 0,
    });

    const savedOrderSummary = await orderSummary.save();

    // Generate a Payment ID (You can use any helper or library to generate unique ID)
    // const paymentId = helper.generatePaymentId();

    // Save the payment information
    const payment = new OrderPaymentmodel({
      // paymentId: paymentId,
      orderBookingId: savedBooking._id,
      userId: userId,
      TotalAmount: finalTotalAmount,
      sub_total: totalItemsPrice,
      gst_percent: 0, // Assuming no GST for now
      discount_percent: totalDiscountValue,
      total_amount: finalTotalAmount,
      payment_status: "initialized",
      date: helper.availableTimeAndDate(), // Assuming you have a helper to format the date
      created_at: helper.availableTimeAndDate(),
    });

    const savedPayment = await payment.save();

    // Clear the cart after order is placed
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } } // Clear items
    );

    res.status(200).send({
      responseCode: 200,
      message: "Order placed successfully",
      bookingId: savedBooking._id,
      orderSummaryId: savedOrderSummary._id,
      paymentId: savedPayment._id,
      bookingProducts: bookingProducts,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};

const OrderConfirm = async (req, res) => {
  try {
    const userId = req.userId.id;
    const {
      orderBookingId,
      totalAmount,
      paymentStatus,
      signature // Assuming signature is used for verification or additional validation
    } = req.body;

    // Validate input
    if (!orderBookingId) {
      return res.status(200).send({
        responseCode: 400,
        message: "Order Booking ID is required.",
      });
    }

    if (!totalAmount || !paymentStatus) {
      return res.status(200).send({
        responseCode: 400,
        message: "Total amount and payment status are required.",
      });
    }

    // Find the order booking
    const orderBooking = await OrderBookingModel.findById(orderBookingId);

    if (!orderBooking) {
      return res.status(200).send({
        responseCode: 400,
        message: "Order not found.",
      });
    }

    // Update the order status and payment information
    orderBooking.orderStatus = "confirmed"; // Example status update
    await orderBooking.save();

    const payment = await OrderPaymentmodel.findOne({ orderBookingId: orderBookingId });
    if (payment) {
      payment.total_amount = totalAmount;
      payment.payment_status = paymentStatus;
      payment.status = true; // Assuming 'status' indicates the payment is complete
      await payment.save();
    }

    res.status(200).send({
      responseCode: 200,
      message: "Order confirmed successfully.",
      orderId: orderBooking._id,
      paymentStatus:paymentStatus
    });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};




const AddedToCart = async (req, res) => {
  try {
    const userId = req.userId.id;
    const {
      productId,
      productName,
      skuId,
      typeOfRate,
      quantityValue,
      purchaseQuantity,
      price,
      unit,
      discount = 0,
      gst = 0,
    } = req.body;

    // Validate input
    if (
      !userId ||
      !productId ||
      quantityValue === undefined ||
      price === undefined ||
      !typeOfRate
    ) {
      return res
        .status(200)
        .json({ responseCode: 400, message: "Missing required fields" });
    }

    // Find the cart for the user or create a new one if it doesn't exist
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the item already exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    // Calculate sub_total and final_price
    const itemPrice = price * (quantityValue || 1);
    const itemDiscount = (itemPrice * (discount || 0)) / 100;
    const itemGst = (itemPrice * (gst || 0)) / 100;
    const itemSubTotal = itemPrice - itemDiscount;
    const itemFinalPrice = itemSubTotal + itemGst;

    if (itemIndex > -1) {
      // Update the existing item
      const existingItem = cart.items[itemIndex];
      existingItem.quantityValue = quantityValue;
      existingItem.purchaseQuantity = purchaseQuantity;
      existingItem.price = price;
      existingItem.discount = discount;
      existingItem.gst = gst;
      existingItem.sub_total = itemSubTotal;
      existingItem.final_price = itemFinalPrice;
    } else {
      // Add a new item to the cart
      cart.items.push({
        productId,
        productName,
        skuId,
        typeOfRate,
        quantityValue,
        purchaseQuantity,
        price,
        unit,
        discount,
        gst,
        sub_total: itemSubTotal,
        final_price: itemFinalPrice,
      });
    }

    // Calculate overall cart values
    cart.discount = cart.items.reduce((acc, item) => acc + item.discount, 0);
    cart.gst = cart.items.reduce((acc, item) => acc + item.gst, 0);
    cart.sub_total = cart.items.reduce((acc, item) => acc + item.sub_total, 0);
    cart.final_price = cart.items.reduce(
      (acc, item) => acc + item.final_price,
      0
    );

    // Save the cart
    await cart.save();

    res
      .status(200)
      .json({ responseCode: 200, message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




const GetListOFCartItems = async (req, res) => {
  try {
    const userId = req.userId.id;

    if (!userId) {
      return res.status(400).send({
        responseCode: 400,
        message: "User ID is required.",
      });
    }

    // Fetch the cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send({
        responseCode: 404,
        message: "Cart not found.",
      });
    }

    // Extract productIds from cart items
    const productIds = cart.items.map(item => item.productId);

    // Fetch products details
    const products = await productModel.find({ _id: { $in: productIds } }).select('productName images');

    // Map products details by productId for quick lookup
    const productsMap = products.reduce((map, product) => {
      map[product._id.toString()] = product;
      return map;
    }, {});

    // Combine cart items with product details
    const itemsWithProductDetails = cart.items.map(item => {
      const product = productsMap[item.productId.toString()];
      return {
        ...item.toObject(),
        productName: product ? product.productName : null,
        image: product ? product.images : null,
      };
    });

    res.status(200).send({
      responseCode: 200,
      message: "Cart items fetched successfully.",
      items: itemsWithProductDetails,
      discount: cart.discount,
      gst: cart.gst,
      sub_total: cart.sub_total,
      final_price: cart.final_price,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};


const RemoveProductFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId.id; // Assuming userId is available in the request context/session

    if (!productId || !userId) {
      return res.status(400).send({
        responseCode: 400,
        message: "Product ID and User ID are required.",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(400).send({
        responseCode: 400,
        message: "Cart not found for the user.",
      });
    }

    // Find the product to be removed
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res.status(400).send({
        responseCode: 400,
        message: "Product not found in the cart.",
      });
    }

    // Remove the product from the items array
    const [removedProduct] = cart.items.splice(itemIndex, 1);

    // Recalculate totals
    const newSubTotal = cart.items.reduce(
      (acc, item) => acc + item.sub_total,
      0
    );
    const newFinalPrice = cart.items.reduce(
      (acc, item) => acc + item.final_price,
      0
    );

    cart.sub_total = newSubTotal;
    cart.final_price = newFinalPrice;

    // Save the updated cart
    await cart.save();

    res.status(200).send({
      responseCode: 200,
      message: "Product removed from cart successfully.",
      removedProduct,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};

const createCoupon = async (req, res) => {
  try {
    const userId = req.userId.id;
    const { sellerId, code, discountType, discountValue, expiryDate } =
      req.body;

    const discount = {};
    if (discountType === "flat") {
      discount.flat = discountValue;
    } else if (discountType === "percentage") {
      discount.percentage = discountValue;
    } else {
      return res.status(400).send({
        responseCode: 400,
        message:
          "Invalid discount type. Must be either 'flat' or 'percentage'.",
      });
    }

    const newCoupon = new CouponModel({
      userId,
      sellerId,
      code,
      discount,
      expiryDate,
    });

    await newCoupon.save();

    res.status(200).send({
      responseCode: 200,
      message: "Coupon created successfully",
      coupon: newCoupon,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await CouponModel.findOne({ code });

    if (!coupon || !coupon.isActive || coupon.expiryDate < Date.now()) {
      return res.status(400).json({
        responseCode: 400,
        message: "Coupon is not valid",
      });
    }

    res.status(200).json({
      responseCode: 200,
      message: "Coupon is valid",
      coupon: coupon,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      responseCode: 500,
      message: "Server error",
    });
  }
};


const confirmPayment = async (req, res) => {
  try {
    const {
      paymentMethod,
      paymentMethodType,
      chequeImageUrl,
      paidAmount,
      orderId,
    } = req.body;

    const orderSummary = await OrderSummaryModel.findOne({ orderId });

    if (!orderSummary) {
      return res.status(400).json({
        message: "No order summary found",
        responseCode: 400,
      });
    }

    orderSummary.paymentStatus = "paid";

    const orderBooking = await OrderBookingModel.findById(orderId);

    if (!orderBooking) {
      return res.status(400).json({
        message: "No order booking found",
        responseCode: 400,
      });
    }

    orderSummary.paymentMethod = paymentMethod;
    orderSummary.paymentMethodType = paymentMethodType;
    orderSummary.chequeImage = chequeImageUrl;
    orderSummary.paidAmount = paidAmount;

    if (paidAmount !== orderSummary.totalAmount) {
      return res.status(400).json({
        message: "Paid amount does not match total amount",
        responseCode: 400,
      });
    }

    orderBooking.paymentStatus = "paid";
    orderBooking.orderStatus = "inProgress";

    await orderBooking.save();

    const orderInfos = await OrderBookingInfoModel.find({
      orderbookingId: orderId,
    });

    for (let orderInfo of orderInfos) {
      const product = await productModel.findById(orderInfo.productId);
      const sku = await SKUModel.findOne({
        productId: orderInfo.productId,
        unit: orderInfo.unit,
        quantityValue: orderInfo.quantityValue,
      });

      if (product && sku) {
        if (!product.productName) {
          return res.status(400).json({
            responseCode: 400,
            message: `Product with ID ${product._id} is missing the productName`,
          });
        }

        sku.quantityValue -= orderInfo.quantityValue;
        await sku.save();

        product.totalQuantity -= orderInfo.quantityValue;
        await product.save();
      }
    }

    await orderSummary.save();

    res.status(200).json({
      message: "Payment confirmed successfully",
      responseCode: 200,
      data: orderSummary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ responseCode: 500, message: "Server Error" });
  }
};

const getOrderSummary = async (req, res) => {
  try {
    const { orderId } = req.body;

    const orderSummary = await OrderSummaryModel.findOne({ orderId });

    if (!orderSummary) {
      return res.status(404).json({
        message: "Order summary not found for bookingId",
        responseCode: 404,
      });
    }

    res.status(200).json({
      message: "Order summary retrieved successfully",
      responseCode: 200,
      data: orderSummary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ responseCode: 500, message: "Server Error" });
  }
};

const getListOfOrders = async (req, res) => {
  try {
    const userId = req.userId.id;

    // Fetch orders for the user
    const orders = await OrderBookingModel.find({ userId }).sort({
      $natural: -1,
    });
    console.log(orders);

    // Check if orders are found
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found",
        responseCode: 404,
      });
    }

    const ordersList = [];

    for (const order of orders) {
      const orderDetails = {
        orderId: order._id,
        userId: order.userId,
        bookingId: order.bookingId,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.created_at, // Convert date to YYYY-MM-DD format
        dateTime: order.date, // Convert date to YYYY-MM-DD format
      };

      // Fetch order information
      const orderInfos = await OrderBookingInfoModel.find({
        orderBookingId: order._id,
      });
      console.log(orderInfos);

      // Fetch product information
      if (orderInfos.length > 0) {
        const orderInfosDetails = [];
        for (const info of orderInfos) {
          const product = await productModel.findById(info.productId);
          orderInfosDetails.push({
            orderInfoId: info._id,
            final_price: info.final_price,
            image: product ? product.images : null,
            address: info.address,
          });
        }
        orderDetails.orderInfos = orderInfosDetails;
      }

      // Fetch address information
      const address = await AddressModel.findOne({ userId: order.userId });
      if (address) {
        orderDetails.address = {
          fullAddress: address.address,
          streetName: address.streetName,
          city: address.city,
          state: address.state,
          pinCode: address.pinCode,
          country: address.country,
        };
      }

      ordersList.push(orderDetails);
    }

    // Send the response
    res.status(200).json({
      message: "List of orders retrieved successfully",
      responseCode: 200,
      data: ordersList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ responseCode: 500, message: "Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderBookingId, newStatus } = req.body;

    if (!orderBookingId || !newStatus) {
      return res.status(400).json({
        responseCode: 400,
        message: "Order ID and new status are required.",
      });
    }

    const updatedOrder = await OrderBookingModel.findByIdAndUpdate(
      orderBookingId,
      {
        orderStatus: newStatus,
        deliveryDate: helper.timeWithDate(),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        responseCode: 404,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      responseCode: 200,
      message: "Order status updated successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      responseCode: 500,
      message: "Server error",
    });
  }
};

// const getListOfOrdersInfos = async (req, res) => {
//   try {
//     const { orderBookingId } = req.body;

//     if (!orderBookingId) {
//       return res.status(200).json({
//         responseCode: 400,
//         message: "orderBookingId is required.",
//       });
//     }

//     const orderBooking = await OrderBookingModel.findById(orderBookingId);
//     if (!orderBooking) {
//       return res.status(200).json({
//         responseCode: 400,
//         message: "Order not found.",
//       });
//     }
//     console.log("Order Booking:", orderBooking);

//     const orderSummary = await OrderSummaryModel.findOne({ orderId: orderBooking._id });
//     if (!orderSummary) {
//       return res.status(200).json({
//         responseCode: 400,
//         message: "Order summary not found.",
//       });
//     }
//     // console.log("Order Summary:", orderSummary);

//     const orderDetailsInfo = await OrderBookingInfoModel.find({ orderBookingId: orderBooking._id });
//     if (!orderDetailsInfo.length) {
//       return res.status(200).json({
//         responseCode: 404,
//         message: "Order details not found.",
//       });
//     }
//     console.log("Order Details Info:", orderDetailsInfo);

//     res.status(200).json({
//       responseCode: 200,
//       message: "Orders retrieved successfully.",
//       orderBooking,
//       orderSummary,
//       orderDetailsInfo,
//     });
//   } catch (error) {
//     console.log("Error fetching orders:", error);
//     res.status(500).json({
//       responseCode: 500,
//       message: "Server error.",
//     });
//   }
// };

const getListOfOrdersInfos = async (req, res) => {
  try {
    const { orderBookingId } = req.body;

    if (!orderBookingId) {
      return res.status(400).json({
        responseCode: 400,
        message: "orderBookingId is required.",
      });
    }

    const orderBooking = await OrderBookingModel.findById(orderBookingId);
    if (!orderBooking) {
      return res.status(400).json({
        responseCode: 400,
        message: "Order not found.",
      });
    }

    const orderSummary = await OrderSummaryModel.findOne({
      orderId: orderBooking._id,
    });
    if (!orderSummary) {
      return res.status(400).json({
        responseCode: 400,
        message: "Order summary not found.",
      });
    }

    const orderDetailsInfo = await OrderBookingInfoModel.find({
      orderBookingId: orderBooking._id,
    });
    if (!orderDetailsInfo.length) {
      return res.status(404).json({
        responseCode: 404,
        message: "Order details not found.",
      });
    }

    // Fetch user information
    const user = await UserModel.findById(orderBooking.userId);
    if (!user) {
      return res.status(400).json({
        responseCode: 400,
        message: "User not found.",
      });
    }

    // Fetch address information
    const address = await AddressModel.findOne({
      userId: orderBooking.userId,
      activeStatus: "active",
    });
    let userAddress = null;
    if (address) {
      userAddress = address; // Include the complete address record
    }

    res.status(200).json({
      responseCode: 200,
      message: "Orders retrieved successfully.",
      orderBooking,
      orderSummary,
      orderDetailsInfo,
      userAddress, // Include the complete address record
    });
  } catch (error) {
    console.log("Error fetching orders:", error);
    res.status(500).json({
      responseCode: 500,
      message: "Server error.",
    });
  }
};

const orderManagementList = async (req, res) => {
  try {
    const orders = await OrderBookingModel.find({});

    const orderList = await Promise.all(
      orders.map(async (order) => {
        const orderBookingInfos = await OrderBookingInfoModel.find({
          orderBookingId: order._id,
        });

        const user = await UserModel.findById(order.userId);

        const orderSummary = await OrderSummaryModel.findOne({
          orderId: order._id,
        });

        return {
          orderId: order.bookingId,
          customer: user ? user.userName : "Unknown",
          date: order.created_at,
          price: orderBookingInfos.reduce(
            (acc, info) => acc + info.price * info.purchaseQuantity,
            0
          ),
          purchaseQuantity: orderBookingInfos
            .map((info) => info.purchaseQuantity)
            .reduce((acc, quantity) => acc + quantity, 0),
          paymentMethod: orderSummary ? orderSummary.paymentMethod : "N/A",
          orderStatus: order.orderStatus,
          invoice: order.invoiceURL,
        };
      })
    );

    res.status(200).send({
      responseCode: 200,
      message: "Orders retrieved successfully.",
      data: orderList,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};

const ReturnedProductInfos = async (req, res) => {
  try {
    const { orderBookingId, productinfos, isDamaged, returnReason } = req.body;

    if (!orderBookingId || !productinfos) {
      return res.status(200).json({
        responseCode: 400,
        message: "orderBookingId and productinfos are required",
      });
    }

    const orderBooking = await OrderBookingModel.findById(orderBookingId);

    if (!orderBooking) {
      return res.status(200).json({
        responseCode: 400,
        message: "Order not found",
      });
    }

    let updatedProducts = [];
    let returnedProducts = [];

    for (const infoId of productinfos) {
      let findInfo = await OrderBookingInfoModel.findById(infoId);

      if (!findInfo) {
        return res.status(200).json({
          responseCode: 400,
          message: `Order info with ID ${infoId} not found`,
        });
      }

      const updatedProduct = await OrderBookingInfoModel.findByIdAndUpdate(
        infoId,
        { $set: { status: "inactive", isDamaged, returnReason } },
        { new: true }
      );
      updatedProducts.push({
        productId: findInfo.productId,
        isDamaged,
        returnReason,
      });
      returnedProducts.push(updatedProduct);

      let findOrderSummary = await OrderSummaryModel.findOne({
        orderBookingId: orderBookingId,
      });

      await OrderBookingModel.findByIdAndUpdate(orderBookingId, {
        $set: { orderStatus: isDamaged ? "Damaged" : "Return" },
      });

      if (!isDamaged) {
        let findSKU = await SKUModel.findOne({
          productId: findInfo.productId,
          quantityValue: findInfo.quantityValue,
          unit: findInfo.unit,
        });
        console.log(findSKU, "???????????");
        if (!findSKU) {
          return res.status(200).json({
            responseCode: 400,
            message: `SKU not found for product info with ID ${infoId}`,
          });
        }

        await SKUModel.findByIdAndUpdate(findSKU._id, {
          $set: {
            totalQuantity: findSKU.totalQuantity + findInfo.purchaseQuantity,
          },
        });

        if (findOrderSummary) {
          await OrderSummaryModel.findByIdAndUpdate(findOrderSummary._id, {
            $set: {
              totalAmount: findOrderSummary.totalAmount - findInfo.final_price,
            },
          });
        }

        let findProduct = await productModel.findById(findSKU.productId);

        if (!findProduct) {
          return res.status(200).json({
            responseCode: 400,
            message: `Product not found for SKU with ID ${findSKU._id}`,
          });
        }
      }
    }

    res.status(200).send({
      responseCode: 200,
      message: "Product return processed successfully",
      updatedProducts,
      returnedProducts,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//kk
const UpdatePurchaseQuantity = async (req, res) => {
  try {
    const userId = req.userId.id;
    const { orderId, productId, action } = req.body;

    if (
      !orderId ||
      !productId ||
      !["increment", "decrement"].includes(action)
    ) {
      return res.status(400).send({
        responseCode: 400,
        message:
          "orderId, productId, and a valid action ('increment' or 'decrement') are required.",
      });
    }

    const bookingInfo = await OrderBookingInfoModel.findOne({
      orderBookingId: orderId,
      productId: productId,
      createdBy: userId,
    });

    if (!bookingInfo) {
      return res.status(404).send({
        responseCode: 404,
        message: "Order or product not found.",
      });
    }

    if (action === "increment") {
      bookingInfo.purchaseQuantity += 1;
    } else if (action === "decrement") {
      if (bookingInfo.purchaseQuantity > 1) {
        bookingInfo.purchaseQuantity -= 1;
      } else {
        return res.status(400).send({
          responseCode: 400,
          message: "Purchase quantity cannot be less than 1.",
        });
      }
    }

    await bookingInfo.save();

    const booking = await OrderBookingModel.findById(orderId);
    const bookingProducts = await OrderBookingInfoModel.find({
      orderBookingId: orderId,
    });

    let totalPrice = 0;
    bookingProducts.forEach((product) => {
      totalPrice += product.price * product.purchaseQuantity;
    });

    let totalDiscount = 0;
    if (booking.couponCode) {
      const coupon = await CouponModel.findOne({ code: booking.couponCode });
      if (
        coupon &&
        coupon.isActive &&
        new Date(coupon.expiryDate) >= new Date()
      ) {
        if (coupon.discount.flat > 0) {
          totalDiscount = coupon.discount.flat;
        } else if (coupon.discount.percentage > 0) {
          totalDiscount = (totalPrice * coupon.discount.percentage) / 100;
        }
      }
    }

    const totalAmount = totalPrice - totalDiscount;

    const orderSummary = await OrderSummaryModel.findOne({ orderId: orderId });
    orderSummary.totalPrice = totalPrice;
    orderSummary.discount = totalDiscount;
    orderSummary.totalAmount = totalAmount;
    await orderSummary.save();

    res.status(200).send({
      responseCode: 200,
      message: "Purchase quantity updated successfully",
      bookingInfo: bookingInfo,
      orderSummary: orderSummary,
    });
  } catch (error) {
    console.error("Error updating purchase quantity:", error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};

const CancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).send({
        responseCode: 400,
        message: "Order ID is required.",
      });
    }

    // Find the order to be cancelled
    const order = await OrderBookingModel.findById(orderId);

    if (!order) {
      return res.status(400).send({
        responseCode: 400,
        message: "Order not found.",
      });
    }

    // Check if the order is already cancelled or completed
    if (order.activeStatus !== "active") {
      return res.status(400).send({
        responseCode: 400,
        message: "Order cannot be cancelled as it is not active.",
      });
    }

    // Update the order status to 'inactive'
    order.activeStatus = "inactive";
    order.orderStatus = "cancelled";
    await order.save();

    // Update related booking info
    await OrderBookingInfoModel.updateMany(
      { orderBookingId: orderId },
      { $set: { status: "inactive" } }
    );

    // Optionally, handle coupon refund, inventory adjustments, etc.
    // ...

    res.status(200).send({
      responseCode: 200,
      message: "Order cancelled successfully.",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};

module.exports = {
  PlaceOrder,
  confirmPayment,
  createCoupon,
  validateCoupon,
  getListOfOrders,
  getOrderSummary,
  updateOrderStatus,
  getListOfOrdersInfos,
  orderManagementList,
  ReturnedProductInfos,
  UpdatePurchaseQuantity,
  CancelOrder,
  RemoveProductFromCart,
  AddedToCart,
  GetListOFCartItems,
  OrderConfirm
};
