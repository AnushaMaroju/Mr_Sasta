const Product = require("../models/productModel");
const Seller = require("../models/sellerModel");
const categoryModel = require("../models/categoryModel");
const BrandModel = require("../models/brandModel");
const skuModel = require("../models/skuModel");
const cartModel = require("../models/cartModel");

// const addProduct = async (req, res) => {
//   try {
//     const sellerId = req.userId.id;

//     const {
//       productName,
//       productImage,
//       description,
//       categoryId,
//       productStream,
//       skus,
//     } = req.body;

//     // Check if product with the same name and category already exists for this seller
//     const existingProduct = await Product.findOne({
//       productName: new RegExp(`^${productName}$`, 'i'),
//       categoryId,
//       sellerId,
//     });

//     if (existingProduct) {
//       return res.status(400).json({
//         responseCode: 400,
//         message: "Product with same name and category already exists for this seller",
//       });
//     }

//     // Fetch category details
//     const category = await categoryModel.findById(categoryId);
//     if (!category) {
//       return res.status(400).json({
//         responseCode: 400,
//         message: "Category not found",
//       });
//     }

//     if (category.status === "inactive") {
//       return res.status(400).json({
//         responseCode: 400,
//         message: "Category status is inactive. Product cannot be created.",
//       });
//     }

//     // Create new product
//     const newProduct = new Product({
//       productName,
//       productImage,
//       description,
//       categoryId,
//       categoryName: category.name,
//       categoryStatus: category.status,
//       sellerId,
//       productStream,
//       productStatus: "active",
//     });

//     // Save the new product
//     const savedProduct = await newProduct.save();

//     // Initialize array to store saved SKUs
//     const savedSkus = [];
//     const skuSet = new Set();

//     // Iterate over each SKU provided in the request
//     for (const skuDetails of skus) {
//       const { 
//         productName: skuProductName, 
//         unit, 
//         quantityValue, 
//         fairPrice, 
//         instantPrice, 
//         discount, 
//         totalQuantity, 
//         maxLimitPurchase 
//       } = skuDetails;

//       // Check for duplicate SKU
//       const skuIdentifier = `${unit}-${quantityValue}`;
//       if (skuSet.has(skuIdentifier)) {
//         return res.status(400).json({
//           responseCode: 400,
//           message: "Duplicate SKU detected with the same unit and quantityValue.",
//         });
//       }
//       skuSet.add(skuIdentifier);

//       // Create new SKU
//       const newSku = new skuModel({
//         productId: savedProduct._id, // Use the newly saved product's ID
//         productName: skuProductName,
//         unit,
//         quantityValue,
//         fairPrice,
//         instantPrice,
//         discount,
//         totalQuantity,
//         maxLimitPurchase,
//         sellerId,
//       });

//       // Save the SKU
//       const savedSku = await newSku.save();
//       savedSkus.push(savedSku);
//     }

//     // Update the product's skus field with the saved SKUs
//     savedProduct.skus = savedSkus.map((sku) => sku._id);
//     await savedProduct.save();

//     // Return success response
//     res.status(201).json({
//       responseCode: 200,
//       message: "Product and SKUs created successfully",
//       product: savedProduct,
//       skus: savedSkus,
//     });
//   } catch (error) {
//     console.error("Error creating product and SKUs:", error);
//     res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };

const addProduct = async (req, res) => {
  try {
    const sellerId = req.userId.id;

    const userType = req.userId.userType;


    const {
      productName,
      productImage,
      description,
      categoryId,
      productStream,
      skus,
    } = req.body;

    // Check if product with the same name and category already exists for this seller
    const existingProduct = await Product.findOne({
      productName: new RegExp(`^${productName}$`, 'i'),
      categoryId,
      sellerId,
    });

    if (existingProduct) {
      return res.status(400).json({
        responseCode: 400,
        message: "Product with same name and category already exists for this seller",
      });
    }

    // Fetch category details
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        responseCode: 400,
        message: "Category not found",
      });
    }

    if (category.status === "inactive") {
      return res.status(400).json({
        responseCode: 400,
        message: "Category status is inactive. Product cannot be created.",
      });
    }

    // Create new product
    const newProduct = new Product({
      productName,
      productImage,
      description,
      categoryId,
      categoryName: category.name,
      categoryStatus: category.status,
      sellerId,
      productStream,
      productStatus: "active",
      createdBy: userType,
    });

    // Save the new product
    const savedProduct = await newProduct.save();

    // Initialize array to store saved SKUs
    const savedSkus = [];
    const skuSet = new Set();
    let totalSkuQuantity = 0; // Initialize totalSkuQuantity

    // Iterate over each SKU provided in the request
    for (const skuDetails of skus) {
      const { 
        productName: skuProductName, 
        unit, 
        quantityValue, 
        fairPrice, 
        instantPrice, 
        discount, 
        totalQuantity, 
        maxLimitPurchase 
      } = skuDetails;

      // Check for duplicate SKU
      const skuIdentifier = `${unit}-${quantityValue}`;
      if (skuSet.has(skuIdentifier)) {
        return res.status(400).json({
          responseCode: 400,
          message: "Duplicate SKU detected with the same unit and quantityValue.",
        });
      }
      skuSet.add(skuIdentifier);

      // Calculate the total quantity in kilograms
      let quantityInKg = 0;

      if (unit === "gram") {
        quantityInKg = totalQuantity / 1000; // Convert grams to kilograms
      } else if (unit === "kg") {
        quantityInKg = totalQuantity; // Already in kilograms
      }
      totalSkuQuantity += totalQuantity; // Add to the total quantity
      

      // Create new SKU
      const newSku = new skuModel({
        productId: savedProduct._id, // Use the newly saved product's ID
        productName: skuProductName,
        unit,
        quantityValue,
        fairPrice,
        instantPrice,
        discount,
        totalQuantity,
        maxLimitPurchase,
        sellerId,
      });

      // Save the SKU
      const savedSku = await newSku.save();
      savedSkus.push(savedSku);
      
    }

    // Update the product's skus field with the saved SKUs
    savedProduct.skus = savedSkus.map((sku) => sku._id);
    savedProduct.totalSkuQuantity = totalSkuQuantity; // Update the total SKU quantity
    await savedProduct.save();

    // Return success response
    res.status(201).json({
      responseCode: 200,
      message: "Product and SKUs created successfully",
      product: savedProduct,
      skus: savedSkus,
    });
  } catch (error) {
    console.error("Error creating product and SKUs:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const sellerId = req.userId.id;
    const {
      productId,
      productName,
      productImage,
      description,
      categoryId,
      productStream,
      skus,
    } = req.body;

    const product = await Product.findOne({ productId: productId._id, sellerId });
    if (!product) {
      return res.status(404).json({
        responseCode: 404,
        message: "Product not found",
      });
    }

    if (categoryId) {
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        return res.status(400).json({
          responseCode: 400,
          message: "Category not found",
        });
      }
      product.categoryId = categoryId;
      product.categoryName = category.name;
      product.categoryStatus = category.status;
    }

    product.productName = productName || product.productName;
    product.productImage = productImage || product.productImage;
    product.description = description || product.description;
    product.productStream = productStream || product.productStream;

    const updatedProduct = await product.save();

    if (skus && skus.length > 0) {
      await skuModel.deleteMany({ productId: productId });
      const savedSkus = [];

      for (const skuDetails of skus) {
        const {
          productName: skuProductName,
          unit,
          quantityValue,
          fairPrice,
          instantPrice,
          discount,
          totalQuantity,
          maxLimitPurchase,
        } = skuDetails;

        const newSku = new skuModel({
          productId: product._id,
          productName: skuProductName,
          unit,
          quantityValue,
          fairPrice,
          instantPrice,
          discount,
          totalQuantity,
          maxLimitPurchase,
          sellerId,
        });

        const savedSku = await newSku.save();
        savedSkus.push(savedSku);
      }

      product.skus = savedSkus.map((sku) => sku._id);
      await product.save();
    }

    res.status(200).json({
      responseCode: 200,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


const getListOfProducts = async (req, res) => {
  try {
    const findProduct = await Product.find({ status: "active" })
      .sort({ $natural: 1 })
      .exec();

    let List = [];

    for (const product of findProduct) {
      const skuDetailsArray = await skuModel.find({ productId: product._id });

      const skus = skuDetailsArray.map((skuDetails) => ({
        quantityValue: skuDetails.quantityValue,
        unit: skuDetails.unit,
        fairPrice: skuDetails.mandiPrice,
        instantPrice: skuDetails.instantPrice,
        discount: skuDetails.discount,
        rating: skuDetails.rating // Ensure you have 'rating' in your SKU model
      }));

      List.push({
        productId: product._id,
        productName: product.productName,
        productImage: product.images,
        description: product.description,
        skus, // List of SKU details
      });
    }

    res.status(200).send({
      message: "List of products",
      responseCode: 200,
      data: List,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};


const getIdByProductInfo  = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(200).send({
        responseCode: 400,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId).exec();

    if (!product) {
      return res.status(200).send({
        responseCode: 400,
        message: "Product not found",
      });
    }

    const skuDetails = await skuModel.find({ productId: product._id });

    if (!skuDetails.length) {
      return res.status(200).send({
        responseCode: 400,
        message: "SKU details not found",
      });
    }

    let responseData = {
      productId:product._id,
      productName: product.productName,
      productImage: product.images, 
      description:product.description,      
      skus: skuDetails.map(sku => ({
        instantPrice: sku.instantPrice,
        fairPrice:sku.fairPrice,
        quantityValue: sku.quantityValue,
        unit: sku.unit,
        discount: sku.discount,
      }))
    };

    res.status(200).send({
      responseCode: 200,
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};


const toggleProductStatus = async (req, res) => {
  try {
    const sellerId = req.userId.id;
    const { productId, status } = req.body;

    const product = await Product.findOne({ productId: productId._id, sellerId });
    if (!product) {
      return res.status(200).json({
        responseCode: 400,
        message: "Product not found",
      });
    }

    product.status = status;

    const updatedProduct = await product.save();

    res.status(200).json({
      responseCode: 200,
      message: `Product ${
        status === "active" ? "activated" : "deactivated"
      } successfully`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error toggling product status:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const userId = req.userId.id;

    if (!categoryId) {
      return res.status(200).json({
        responseCode: 400,
        message: "Category ID is required",
      });
    }

    // Find products by categoryId
    const products = await Product.find({ categoryId });

    if (products.length === 0) {
      return res.status(200).json({
        responseCode: 200,
        message: "No products found for the specified category",
        data: []
      });
    }

    const productDetails = [];

    // Fetch the cart associated with the user
    const cart = userId ? await cartModel.findOne({ userId }) : null;

    for (const product of products) {
      const skus = await skuModel.find({ productId: product._id });

      let quantityInCart = 0;
      if (cart) {
        const cartItem = cart.items.find(item => item.productId === product._id.toString());
        if (cartItem) {
          quantityInCart = cartItem.quantity;
        }
      }

      productDetails.push({ ...product._doc, skus, quantityInCart });
    }

    res.status(200).json({
      responseCode: 200,
      message: "Products retrieved successfully",
      products: productDetails,
    });
  } catch (error) {
    console.error("Error retrieving products by category ID:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};






module.exports = { addProduct, getListOfProducts, getIdByProductInfo ,
  editProduct,toggleProductStatus,
  getProductsByCategoryId
 };
