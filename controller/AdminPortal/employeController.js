const employeModel = require("../../models/adminPortal/employeModel");
const jwt = require("jsonwebtoken");
const helper = require("../../helper/helper")
const authorizationValues = require("../../config/auth");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const roleModel = require("../../models/adminPortal/rolemodel");





const CreateAdmin = async (req, res) => {
    try {
      const { username, email, phoneNumber, password, role, address, DOB } =
        req.body;
  
      const roleId = helper.generateRoleID(); 
      console.log("Generated Role ID:", roleId);
  
     
      const existingUser = await employeModel.findOne({
        $or: [{ phoneNumber: phoneNumber }, { email: email }],
      });
      if (existingUser) {
        return res.status(200).json({
          responseCode:400,
          message:
            "User already exists with this phone number or email. Please try another.",
        });
      }
  
     
      if (!password) {
        return res.status(400).json({
          message: "Password is required.",
        });
      }
  
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
    
      const newUser = new employeModel({
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        roleName :"Admin",
        role_id:null,
        roleId,
        address,
        DOB, 
      });
      console.log("New User to Save:", newUser);
      await newUser.save();
  
      res.status(200).json({
        message: "User registered successfully.",
        responseCode: 200,
        user: [newUser],
      });
    } catch (error) {
      console.error("Error in registration:", error);
      res.status(500).json({
        message: "Internal Server Error.",
      });
    }
  };
  
  const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          message: "email and password are required.",
        });
      }
  
      const existingUser = await employeModel.findOne({
        email: email,
      });
      console.log(existingUser);
  
      if (!existingUser) {
        return res.status(404).json({
          message: "User not found. Please check your email.",
        });
      }
  
      if (!existingUser.password) {
        return res.status(400).json({
          message: "Password not set for the user.",
        });
      }
  
      const comparePassWord = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!comparePassWord) {
        return res.status(400).json({
          message: "Invalid password.",
        });
      }
  
  
      const tokenId = { id: existingUser.id };
      const userToken = await helper.token(
        tokenId,
        authorizationValues.secretKey
      );
      existingUser.token = userToken;
      await existingUser.save();
  
      res.status(200).json({
        responseCode: 200,
        message: "User logged in successfully.",
        user: [existingUser],
        // token: userToken,
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({
        message: "Internal Server Error.",
      });
    }
  };

  const addEmploye = async (req, res) => {
    try {
      const { username, email, phoneNumber, password, role_Id, address, DOB, image } = req.body;
  
      // Check if the role ID is provided and is valid
      if (!role_Id) {
        return res.status(200).json({
          responseCode: 400,
          message: "Role ID is required.",
        });
      }
  
      // Find the role by ID
      const existingRole = await roleModel.findById(role_Id);
      if (!existingRole) {
        return res.status(200).json({
          responseCode: 400,
          message: "Role not found.",
        });
      }
  
      // Check for existing user with the same email or phone number
      const existingUser = await employeModel.findOne({ $or: [{ phoneNumber }, { email }] });
      if (existingUser) {
        return res.status(200).json({
          responseCode: 400,
          message: "User already exists with this phone number or email. Please try another.",
        });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const newUser = new employeModel({
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        role_Id: role_Id, // Ensuring role_Id is used as a string
        roleName: existingRole.roleName,
        roleId: helper.generateRoleID(),
        address,
        DOB,
        image
      });
  
      // Save the new user
      await newUser.save();
  
      // Respond with success
      res.status(200).json({
        message: "User registered successfully.",
        responseCode: 200,
        user:[ {
          username: newUser.username,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role_Id: newUser.role_Id,
          roleName: newUser.roleName,
          roleId: newUser.roleId,
          address: newUser.address,
          DOB: newUser.DOB,
          image: newUser.image
        },]
      });
    } catch (error) {
      console.error("Error in registration:", error);
      res.status(500).json({
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  };


  const employeLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(200).json({
          reponseCode:400,
          message: "Email and password are required.",
        });
      }
  
      const existingUser = await employeModel.findOne({ email });
  
      if (!existingUser) {
        return res.status(200).json({
          responseCode:400,
          message: "User not found. Please check your email.",
        });
      }
  
      if (!existingUser.password) {
        return res.status(200).json({
          responseCode:400,
          message: "Password not set for the user.",
        });
      }
  
      if (existingUser.status  === "blocked") {
        return res.status(200).json({
          responseCode:400,
          message: "User account is inactive. Please contact the admin.",
        });
      } 
      
      if (existingUser.status === "inactive") {
        existingUser.status = "active";
        await existingUser.save();
      }


  
      const comparePassword = await bcrypt.compare(password, existingUser.password);
      if (!comparePassword) {
        return res.status(200).json({
          responseCode:400,
          message: "Invalid password.",
        });
      }
  
      // Generate and save token
      const tokenId = { id: existingUser.id };
      const userToken = await helper.token(tokenId, authorizationValues.secretKey);
      existingUser.token = userToken;
      await existingUser.save();
  
      res.status(200).json({
        responseCode: 200,
        message: "User logged in successfully.",
        user: [existingUser],
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({
        message: "Internal Server Error.",
      });
    }
  };


  // const editEmployee = async (req, res) => {
  //   try {
  //     const { employeId, username, role_Id, email, address, DOB ,image,phoneNumber} = req.body;
  
  //     // Validate role_Id
  //     if (!role_Id || typeof role_Id !== 'string') {
  //       return res.status(200).json({
  //         message: "Invalid or missing role ID. It must be a single string value.",
  //         responseCode: 400,
  //       });
  //     }
  
  //     // Fetch the role by ID to check its existence and use its data
  //     const role = await roleModel.findById(role_Id);
  //     if (!role) {
  //       return res.status(200).json({
  //         message: "Role not found.",
  //         responseCode: 400,
  //       });
  //     }
  
  //     // Check if the employee exists
  //     const existingEmployee = await employeModel.findById(employeId);
  //     if (!existingEmployee) {
  //       return res.status(200).json({
  //         message: "Employee not found.",
  //         responseCode: 404,
  //       });
  //     }
  
  //     // Update the employee with the new values
  //     const updatedEmployee = await employeModel.findByIdAndUpdate(
  //       employeId,
  //       {
  //         $set: {
  //           username,
  //           email,
  //           address,
  //           DOB,
  //           role_Id,
  //           roleName: role.roleName,
  //           image,
  //           phoneNumber // Update roleName based on the fetched role
  //         },
  //       },
  //       { new: true }
  //     );
  
  //     // Respond with the updated employee information
  //     res.json({
  //       responseCode: 200,
  //       message: "Employee updated successfully",
  //       data: updatedEmployee,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Server error", error: error.message });
  //   }
  // };
  

  const editEmployee = async (req, res) => {
    try {
      const adminId = req.userId.id;
      const {
        employeId,
        username,
        role_Id,
        email,
        address,
        DOB,
        image,
        phoneNumber,
      } = req.body;
  
      if (!role_Id || typeof role_Id !== "string") {
        return res.status(400).json({
          message: "Invalid or missing role ID. It must be a single string value.",
          responseCode: 400,
        });
      }
  
      const role = await roleModel.findById(role_Id);
      if (!role) {
        return res.status(400).json({
          message: "Role not found.",
          responseCode: 400,
        });
      }
  
      const existingEmployee = await AdminUserModel.findById(employeId);
      if (!existingEmployee) {
        return res.status(404).json({
          message: "Employee not found.",
          responseCode: 404,
        });
      }
  
      // Check if role has changed
      if (existingEmployee.role_Id !== role_Id) {
        existingEmployee.role_Id = role_Id;
        existingEmployee.roleName = role.roleName;
  
        existingEmployee.status = "inactive"
  
      
      }
  
  
  
      // Update other fields
      existingEmployee.username = username;
      existingEmployee.email = email;
      existingEmployee.address = address;
      existingEmployee.DOB = DOB;
      existingEmployee.image = image;
      existingEmployee.phoneNumber = phoneNumber;
      
  
      const updatedEmployee = await existingEmployee.save();
  
      res.json({
        responseCode: 200,
        message: "Employee updated successfully",
        data: updatedEmployee,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const toggleEmployeeStatus = async (req, res) => {
    try {
      const { employeeId } = req.body;
  
      if (!employeeId) {
        return res.status(200).json({
          responseCode: 400,
          message: "Employee ID is required",
          data: {},
        });
      }
  
      // Toggle the status using findOneAndUpdate for a direct database operation
      const employee = await employeModel.findById(employeeId);
      if (!employee) {
        return res.status(200).json({
          responseCode: 400,
          message: "Employee not found",
          data: {},
        });
      }

      employee.status = employee.status === "active" ? "blocked" : "active";

      await employee.save();


      return res.status(200).json({
        responseCode: 200,
        message: `Employee status toggled to ${employee.status}`,
        data: employee,
      });
    } catch (error) {
      console.error("Error toggling employee status:", error);
      res.status(500).json({
        responseCode: 500,
        message: "Internal Server Error",
        data: {},
      });
    }
  };
  
  const listOfEmployes = async (req, res) => {
    try {
      // Fetch all employees from the database and sort them by 'createdAt' in descending order
      const employees = await employeModel.find().sort({ $natural: -1 });
  
      res.status(200).json({
        responseCode: 200,
        message: "Employees retrieved successfully",
        data: employees,
      });
    } catch (error) {
      console.error("Error retrieving employees:", error);
      res.status(500).json({
        responseCode: 500,
        message: "Internal Server Error",
        data: {},
      });
    }
  };

  let changePassword = async (req, res) => {
    try {
      // Assumption that email is stored in request object
      const { email, oldPassword, newPassword } = req.body;
  
      const findUser = await adminUsersModel.findOne({ email });
  
      if (!findUser) {
        return res.status(200).json({
          message: "User not found",
          responseCode: 400,
        });
      }
  
      // Compare old password
      const isMatch = await bcrypt.compare(oldPassword, findUser.password);
      if (!isMatch) {
        return res.status(200).json({
          message: "Old password does not match",
          responseCode: 400,
        });
      }
  
      // Hash new password
      let encryptedPassword = await bcrypt.hash(newPassword, 10);
      findUser.password = encryptedPassword;
  
      await findUser.save();
  
      res.status(200).json({
        message: "Password changed successfully",
        responseCode: 200,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  };
  
  
  const editProfile = async (req, res) => {
    try {
      const { profileId, username, email, phoneNumber, address, image } = req.body;
  
      // Find the user by ID
      const user = await AdminUserModel.findById(profileId);  // Simplified findById usage
      if (!user) {
        return res.status(200).json({ message: "User not found" ,responseCode:400});
      }
  
      // Update fields
      user.username = username ?? user.username;
      user.email = email ?? user.email;
      user.address = address ?? user.address;
      user.phoneNumber = phoneNumber ?? user.phoneNumber;
      user.image = image ?? user.image;
  
      // Save the updated user info
      await user.save();
  
      // Prepare response data including only specified fields
      const responseData = {
        profileId: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        image: user.image
      };
  
      res.status(200).json({
        responseCode: 200,
        message: "User updated successfully.",
        data: responseData
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  
  const sideBarAPi = async (req, res) => {
    try {
      const { roleId } = req.body;
      if (!roleId) {
        return res.status(200).send({responseCode:400,message:"'Role ID is required'"});
      }
  
      // Assuming 'roleModel' is the coresporrect reference to your Mongoose model.
      const role = await roleModel.findById(roleId)
        .populate('features.featureId')  // Ensure these paths are correct per your schema
        .populate('features.privileges._id')
        //  .populate('features.icon')
        //  .populate('features.endPoint');  // Same here
       
      if (!role) {
        return res.status(404).send('Role not found');
      }
  
      // Correctly formatted JSON response
      res.status(200).json({
        responseCode: 200,
        message: "Data retrieved successfully",
        data: role
      });
    } catch (error) {
      console.error('Error fetching role:', error);
      res.status(500).send('Internal server error');
    }
  }


  module.exports = {
    CreateAdmin,
    adminLogin,
    addEmploye,
    employeLogin,
    editEmployee,
    toggleEmployeeStatus,
    listOfEmployes,
    sideBarAPi,
    editProfile,
    changePassword


  }