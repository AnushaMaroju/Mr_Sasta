const SKU = require('../models/skuModel');
const Product = require('../models/productModel'); 



const createSKU = async (req, res) => {
  try {
    const sellerId = req.userId.id;

    const {
      productId,
      productName,
      unit,
      quantityValue,
      fairPrice,
      instantPrice,
      discount,
      totalQuantity,
      maxLimitPurchase
    } = req.body;

    // Check if SKU with the same quantity and unit already exists for the product
    const existingSKU = await SKU.findOne({
      productId,
      unit,
      quantityValue
    });

    if (existingSKU) {
      return res.status(400).json({
        responseCode: 400,
        message: "SKU with the same quantity and unit already exists"
      });
    }

    // Create new SKU
    const newSKU = new SKU({
      productId,
      sellerId,
      productName,
      unit,
      quantityValue,
      fairPrice,
      instantPrice,
      discount,
      totalQuantity,
      maxLimitPurchase
    });

    // Save the new SKU
    const savedSKU = await newSKU.save();

    // Find the product and update totalSkuQuantity
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({
        responseCode: 400,
        message: "Product not found"
      });
    }

    // Calculate the quantity of the new SKU in kilograms
    let newSkuQuantityInKg = 0;
    if (unit === "gram") {
      newSkuQuantityInKg = quantityValue / 1000; // Convert grams to kilograms
    } else if (unit === "kg") {
      newSkuQuantityInKg = quantityValue; // Already in kilograms
    }

    // Sum the quantities of all existing SKUs plus the new SKU
    let totalSkuQuantity = newSkuQuantityInKg;
    const existingSkus = await SKU.find({ productId });
    for (const sku of existingSkus) {
      if (sku.unit === "gram") {
        totalSkuQuantity += sku.quantityValue / 1000;
      } else if (sku.unit === "kg") {
        totalSkuQuantity += sku.quantityValue;
      }
    }

    // Update the product with the new total SKU quantity
    product.totalSkuQuantity = totalSkuQuantity;
    await product.save();

    // Return success response
    res.status(201).json({
      responseCode: 200,
      message: "SKU created successfully",
      sku: savedSKU
    });
  } catch (error) {
    console.error("Error creating SKU:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

const editSKU = async (req, res) => {
  try {
    const sellerId = req.userId.id;
    const {
      skuId,
      productName,
      unit,
      quantityValue,
      fairPrice,
      instantPrice,
      discount,
      totalQuantity,
      maxLimitPurchase,
    } = req.body;

    const existingSKU = await SKU.findOne({ _id: skuId, sellerId });

    if (!existingSKU) {
      return res.status(404).json({
        responseCode: 404,
        message: "SKU not found",
      });
    }

    const duplicateSKU = await SKU.findOne({
      productId: existingSKU.productId,
      unit,
      quantityValue,
      _id: { $ne: skuId },
    });

    if (duplicateSKU) {
      return res.status(400).json({
        responseCode: 400,
        message: "Another SKU with the same quantity and unit already exists",
      });
    }

    existingSKU.productName = productName || existingSKU.productName;
    existingSKU.unit = unit || existingSKU.unit;
    existingSKU.quantityValue = quantityValue || existingSKU.quantityValue;
    existingSKU.fairPrice = fairPrice || existingSKU.fairPrice;
    existingSKU.instantPrice = instantPrice || existingSKU.instantPrice;
    existingSKU.discount = discount || existingSKU.discount;
    existingSKU.totalQuantity = totalQuantity || existingSKU.totalQuantity;
    existingSKU.maxLimitPurchase =
      maxLimitPurchase || existingSKU.maxLimitPurchase;

    const updatedSKU = await existingSKU.save();

    res.status(200).json({
      responseCode: 200,
      message: "SKU updated successfully",
      sku: updatedSKU,
    });
  } catch (error) {
    console.error("Error editing SKU:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const toggleSKUStatus = async (req, res) => {
  try {
    const sellerId = req.userId.id;
    const { skuId, status } = req.body;

    const sku = await SKU.findOne({ skuId: skuId._id, sellerId });
    if (!sku) {
      return res.status(404).json({
        responseCode: 404,
        message: "SKU not found",
      });
    }

    sku.status = status;

    const updatedSKU = await sku.save();

    res.status(200).json({
      responseCode: 200,
      message: `SKU ${
        status === "active" ? "activated" : "deactivated"
      } successfully`,
      sku: updatedSKU,
    });
  } catch (error) {
    console.error("Error toggling SKU status:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const listOfSKUsByProductId = async (req, res) => {
  try {
    const { productId } = req.body;

    // console.log("Received productId:", productId);

    const skus = await SKU.find({ productId });

    // console.log("Retrieved SKUs:", skus);

    if (skus.length === 0) {
      return res.status(404).json({
        responseCode: 404,
        message: "No SKUs found for the given product ID",
      });
    }

    res.status(200).json({
      responseCode: 200,
      message: "List of SKUs retrieved successfully",
      skus,
    });
  } catch (error) {
    console.error("Error retrieving SKUs:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};



module.exports = {
  createSKU,
  listOfSKUsByProductId,
  toggleSKUStatus,
  editSKU




};


