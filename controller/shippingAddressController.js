const AddressModel = require("../models/shippingAddress");

const addAddress = async (req, res) => {
  try {
    const userId = req.userId.id;
    const {
      typeOfAddress,
      streetName,
      city,
      state,
      pinCode,
      landMark,
      name,
      phoneNumber,
      email,
    } = req.body;

    const existingAddress = await AddressModel.findOne({
      userId: userId,
      city: city,
      state: state,
      pinCode: pinCode,
      activeStatus: "active",
    });

    if (existingAddress) {
      return res.status(200).json({
        responseCode: 400,
        message: "Address already exists",
      });
    }

    const newAddress = new AddressModel({
      userId: userId,
      typeOfAddress: typeOfAddress || "Home",
      streetName: streetName,
      city: city,
      state: state,
      pinCode: pinCode,
      landMark: landMark,
      name: name,
      phoneNumber: phoneNumber,
      email: email,
      createdBy: userId,
    });

    const savedAddress = await newAddress.save();

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
    const userId = req.userId.id;
    const {
      addressId,
      typeOfAddress,
      streetName,
      city,
      state,
      pinCode,
      landMark,
      name,
      phoneNumber,
    } = req.body;

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      {
        streetName: streetName,
        city: city,
        state: state,
        pinCode: pinCode,

        updatedBy: userId,
        landMark: landMark,
        name: name,
        phoneNumber: phoneNumber,
      },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).send({
        responseCode: 404,
        message: "Address not found",
      });
    }

    res.status(200).send({
      responseCode: 200,
      message: "Address updated successfully",
      addressId: updatedAddress._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
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
    const userId = req.userId.id;

    const addresses = await AddressModel.find({
      userId: userId,
      activeStatus: "active",
    });

    if (addresses.length === 0) {
      return res.status(200).json({
        responseCode: 200,
        message: "No addresses found for the user",
      });
    }

    res.status(200).json({
      responseCode: 200,
      message: "Addresses retrieved successfully",
      addresses: addresses,
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
