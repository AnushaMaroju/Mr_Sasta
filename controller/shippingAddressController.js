const AddressModel = require("../models/shippingAddress");


const addAddress = async (req, res) => {
  try {
    const userId = req.userId.id; // Assuming req.userId is populated correctly
    const {
      typeOfAddress,
      name,
      phoneNumber,
      floor,
      location,
      streetName,
      area,
      city,
      state,
      landMark,
    } = req.body;

    // Check if an active address already exists for the user
    const existingAddress = await AddressModel.findOne({
      userId: userId,
      city: city,
      state: state,
      activeStatus: "active",
    });

    if (existingAddress) {
      return res.status(200).json({
        responseCode: 400,
        message: "Address already exists",
      });
    }

    // Create a new address object
    const newAddress = new AddressModel({
      userId: userId,
      typeOfAddress: typeOfAddress || "Home",
      location: {
        coordinates: location.coordinates, // Ensure location is an object with coordinates
        type: "Point", // Set the GeoJSON type
      },
      streetName: streetName,
      area: area, // Included as per your model
      city: city,
      state: state,
      landMark: landMark,
      name: name,
      phoneNumber: phoneNumber,
      createdBy: userId,
    });

    // Save the new address to the database
    const savedAddress = await newAddress.save();

    // Return the response with the saved address
    res.status(200).json({
      responseCode: 200,
      message: "Address added successfully",
      address: savedAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: 500,
      message: "Server error",
    });
  }
};


const editAddress = async (req, res) => {
  try {
    const userId = req.userId.id; // Assuming req.userId is populated correctly
    const {
      addressId,
      typeOfAddress,
      streetName,
      area, // Added based on your schema
      city,
      state,
      landMark,
      name,
      phoneNumber,
      location, // Include location if you need to update it
      floor, // Include floor if you need to update it
    } = req.body;

    // Find and update the address by ID
    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      {
        typeOfAddress: typeOfAddress, // Update typeOfAddress if provided
        streetName: streetName,
        area: area, // Ensure area is updated
        city: city,
        state: state,
        location: {
          coordinates: location.coordinates, // Ensure location is an object with coordinates
          type: "Point", // Set the GeoJSON type
        },
        landMark: landMark,
        name: name,
        phoneNumber: phoneNumber,
        updatedBy: userId,
        floor: floor, // Update floor if provided
      },
      { new: true } // Return the updated document
    );

    if (!updatedAddress) {
      return res.status(404).json({
        responseCode: 404,
        message: "Address not found",
      });
    }

    res.status(200).json({
      responseCode: 200,
      message: "Address updated successfully",
      address: updatedAddress, // Return the updated address details
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: 500,
      message: "Server error",
    });
  }
};


const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;

    const deletedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      { activeStatus: "inactive" },
      { new: true }
    );

    if (!deletedAddress) {
      return res.status(404).send({
        responseCode: 404,
        message: "Address not found",
      });
    }

    res.status(200).send({
      responseCode: 200,
      message: "Address deleted successfully",
      addressId: deletedAddress._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      responseCode: 500,
      message: "Server error",
    });
  }
};
const getAddress = async (req, res) => {
  try {
    const userId = req.userId.id; // Assuming req.userId is populated correctly

    // Fetch addresses associated with the user and active status
    const addresses = await AddressModel.find({
      userId: userId,
      activeStatus: "active",
    });

    // Check if any addresses were found
    if (addresses.length === 0) {
      return res.status(200).json({
        responseCode: 200,
        message: "No addresses found for the user",
        addresses: [], // Return an empty array for clarity
      });
    }

    // Return the found addresses
    res.status(200).json({
      responseCode: 200,
      message: "Addresses retrieved successfully",
      addresses: addresses, // Include the retrieved addresses in the response
    });
  } catch (error) {
    console.error("Error retrieving addresses:", error);
    res.status(500).json({
      responseCode: 500,
      message: "Server error",
    });
  }
};


module.exports = {
  addAddress,
  editAddress,
  deleteAddress,
  getAddress,
};
