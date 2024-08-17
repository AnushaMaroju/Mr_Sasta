const UserModel = require("../models/userModel");
const helper = require("../helper/helper");
const authorizationValues = require("../config/auth");

// const createUser = async (req, res) => {
//   try {
//     const { phone } = req.body;
//     if (!phone) {
//       return res.status(400).json({ message: "Phone field is required" });
//     }

//     if (!/^\d{10}$/.test(phone)) {
//       return res
//         .status(400)
//         .json({ message: "Phone number must be exactly 10 digits" });
//     }

//     let existingUser = await UserModel.findOne({ phone });

//     if (existingUser) {
//       const otp = Math.floor(100000 + Math.random() * 900000);

//       existingUser.otp = otp;
//       await existingUser.save();

//       return res.status(200).json({
//         responseCode: 200,
//         message: "OTP resent successfully.",
//         data: existingUser,
//       });
//     } else {
//       const { userName, location, name, email, dob, image } = req.body;

//       const otp = Math.floor(100000 + Math.random() * 900000);

//       const newUser = new UserModel({
//         userName,
//         phone,
//         location,
//         name,
//         email,
//         dob,
//         otp,
//         image,
//       });

//       await newUser.save();

//       return res.status(201).json({
//         responseCode: 200,
//         message: "User created successfully. OTP sent to your phone.",
//         user: [newUser],
//       });
//     }
//   } catch (err) {
//     console.error("Error creating user or resending OTP:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const generateUserOTP = async (req, res) => {
  try {
    const { phone, location } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: "Phone field is required" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    // Find existing user by phone number
    let existingUser = await UserModel.findOne({ phone });

    const otp = Math.floor(100000 + Math.random() * 900000);

    if (existingUser) {
      // Update OTP and possibly the location if provided
      existingUser.otp = otp;
      if (location) {
        existingUser.location = location;
      }
      await existingUser.save();

      return res.status(200).json({
        responseCode: 200,
        message: "OTP resent successfully.",
        data: { phone, otp, location }, 
      });
    } else {
      // Create new user with OTP and location if provided
      const newUser = new UserModel({
        phone,
        otp,
        location,
        isRegistered: false, // Assuming new users are not registered initially
      });
      await newUser.save();

      return res.status(201).json({
        responseCode: 200,
        message: "OTP generated successfully.",
        data: { phone, otp, location }, 
      });
    }
  } catch (err) {
    console.error("Error generating OTP:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// const registerUser = async (req, res) => {
//   try {
//     const { phone, userName, location, name, email, dob, image } = req.body;
    
//     if (!phone) {
//       return res.status(400).json({ message: "Phone is required" });
//     }

//     if (!/^\d{10}$/.test(phone)) {
//       return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
//     }

//     let existingUser = await UserModel.findOne({ phone });

//     if (!existingUser) {
//       return res.status(400).json({ message: "Invalid phone number" });
//     }

//     // if (!location || !location.type || !Array.isArray(location.coordinates)) {
//     //   return res.status(400).json({ message: "Location is required and must include type and coordinates" });
//     // }

//     existingUser.userName = userName;
//     existingUser.location = location;
//     existingUser.name = name;
//     existingUser.email = email;
//     existingUser.dob = dob;
//     existingUser.image = image;
//     existingUser.otp = null; // Clear OTP after successful registration

//     await existingUser.save();

//     return res.status(201).json({
//       responseCode: 200,
//       message: "User registered successfully.",
//       user: [existingUser],
//     });
//   } catch (err) {
//     console.error("Error registering user:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: "Phone field is required" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        responseCode: 400,
        message: "Phone number must be exactly 10 digits",
      });
    }

    const user = await UserModel.findOne({ phone, otp });

    if (user) {
      user.verified = true;

      if (!user.location || !user.location.coordinates) {
        return res.status(400).json({
          responseCode: 400,
          message: "User location is not set. Please register the user with a valid location.",
        });
      }

      const tokenId = { id: user.id };
      const userToken = await helper.token(
        tokenId,
        authorizationValues.secretKey
      );
      user.token = userToken;

      await user.save();

      return res.status(200).json({
        responseCode: 200,
        message: "OTP verified successfully.",
        user,
      });
    } else {
      return res.status(400).json({
        responseCode: 400,
        message: "Invalid OTP. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// const registerUser = async (req, res) => {
//   try {
//     const { phone, userName, email, dob, image } = req.body;
    
//     if (!phone) {
//       return res.status(400).json({ message: "Phone is required" });
//     }

//     if (!/^\d{10}$/.test(phone)) {
//       return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
//     }

//     let existingUser = await UserModel.findOne({ phone });

//     if (!existingUser) {
//       return res.status(400).json({ message: "Invalid phone number" });
//     }

//     existingUser.userName = userName;
//     existingUser.email = email;
//     existingUser.dob = dob;
//     existingUser.image = image;
//     existingUser.otp = null; // Clear OTP after successful registration
//     existingUser.isRegistered = true; // Change isRegistered to true

//     await existingUser.save();

//     return res.status(201).json({
//       responseCode: 200,
//       message: "User registered successfully.",
//       user: {
//         id: existingUser._id,
//         name: existingUser.userName,
//         phone: existingUser.phone,
//         location: existingUser.location,
//         dob: existingUser.dob,
//         status: existingUser.status,
//         isRegistered: existingUser.isRegistered
//       }
//     });
//   } catch (err) {
//     console.error("Error registering user:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const registerUser = async (req, res) => {
  try {
 

    const { phone, userName, email, dob, image } = req.body;
    
    if (!phone) {
      return res.status(200).json({ responseCode: 400, message: "Phone is required" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(200).json({ responseCode: 400, message: "Phone number must be exactly 10 digits" });
    }

    // Query to find user based on phone and adminId
    let existingUser = await UserModel.findOne({ phone});

    if (!existingUser) {
      console.log("User not found for phone and adminId:", phone, adminId);
      return res.status(200).json({ responseCode: 400, message: "Invalid phone number" });
    }

    if (existingUser.isRegistered) {
      return res.status(200).json({ responseCode: 400, message: "User is already registered with this mobile number." });
    }

    existingUser.userName = userName;
    existingUser.email = email;
    existingUser.dob = dob;
    existingUser.image = image;
    existingUser.otp = null; // Clear OTP after successful registration
    existingUser.isRegistered = true; // Change isRegistered to true

    await existingUser.save();

    return res.status(201).json({
      responseCode: 200,
      message: "User registered successfully.",
      user: {
        id: existingUser._id,
        name: existingUser.userName,
        phone: existingUser.phone,
        location: existingUser.location,
        dob: existingUser.dob,
        status: existingUser.status,
        isRegistered: existingUser.isRegistered
      }
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ responseCode: 500, message: "Server error" });
  }
};







const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId.id;
    const user = await UserModel.findById(userId).select("-otp");

    if (!user) {
      return res.status(404).json({
        responseCode: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      responseCode: 200,
      message: "User retrieved successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserOrCustomerList = async (req, res) => {
  try {
    const adminId = req.userId.id;
    const findCustomer = await UserModel.find().sort({ $natural: -1 });
    
    
    res.status(200).send({
      message: "Customer list retrieved successfully",
      data: [findCustomer],
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const editUserProfile = async (req, res) => {
  try {
    const userId = req.userId.id;
    const { userName, location, name, email, dob, image } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    existingUser.userName = userName;
    existingUser.location = location;
    existingUser.name = name;
    existingUser.email = email;
    existingUser.dob = dob;
    existingUser.image = image;

    await existingUser.save();

    return res.status(200).json({
      responseCode: 200,
      message: "User profile updated successfully.",
      user: existingUser,
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
  generateUserOTP,
  registerUser,
  verifyOtp,
  getUserProfile,
  getUserOrCustomerList,
  editUserProfile
};
