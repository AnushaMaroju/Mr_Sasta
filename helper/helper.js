let jwt = require("jsonwebtoken");
const authorizationValues = require("../config/auth");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


let token = (userId, secreateKey) => {
    const token = jwt.sign(userId, authorizationValues.secreateKey);
  
    return token;
  };













  let availableTimeAndDate = () => {
    currentTime = new Date();
  
    let year = currentTime.getFullYear();
  
    let getMonth = currentTime.getMonth() + 1;
  
    let month = ("0" + getMonth).slice(-2);
  
    let date = ("0" + currentTime.getDate()).slice(-2);
  
    let hours = currentTime.getHours();
  
    let minutes = currentTime.getMinutes();
  
    let seconds = currentTime.getSeconds();
  
    return `${date}-${month}-${year}`;
  };

  let timeWithDate = () => {
    currentTime = new Date();
  
    let year = currentTime.getFullYear();
  
    let getMonth = currentTime.getMonth() + 1;
  
    let month = ("0" + getMonth).slice(-2);
  
    let date = ("0" + currentTime.getDate()).slice(-2);
  
    let hours = currentTime.getHours();
  
    let minutes = currentTime.getMinutes();
  
    let seconds = currentTime.getSeconds();
  
    return `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };



  const BOOKINGID = () => {
    const min = 10000;
    const max = 99999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return `OID-${randomNumber}`;
  };



  const s3FileUpload = (file) => {
    let fileName = Date.now() + "_" + file.originalname;
    // replace spaces with _
    fileName = fileName.replace(/\s+/g, '_');
    console.log(fileName);
    
  
    const s3 = new S3Client({
      credentials: {
        accessKeyId: authorizationValues.accessKeyId,
        secretAccessKey: authorizationValues.secretAccessKey,
      },
      region: authorizationValues.region,
    });
  
    const params = {
      Bucket: authorizationValues.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  
    let command = new PutObjectCommand(params);
  
    s3.send(command);
  
    return fileName;
  };

  const s3PDFUpload = async (fileName) => {
    let pdfName = Date.now() + "_" + fileName;
  
    const s3 = new S3Client({
      credentials: {
        accessKeyId: authorizationValues.accessKeyId,
  
        secretAccessKey: authorizationValues.secretAccessKey,
      },
  
      region: authorizationValues.region,
    });
    const fileContent = fs.readFileSync(fileName);
  
    const params = {
      Bucket: authorizationValues.bucketName,
  
      Key: pdfName,
  
      Body: fileContent,
  
      ContentType: "application/pdf", // Set the appropriate MIME type for PDF
    };
  
    const command = new PutObjectCommand(params);
  
    try {
      await s3.send(command);
  
      return pdfName; // Return the uploaded file name
    } catch (err) {
      console.error("Error uploading to S3:", err);
  
      throw err;
    }
  };
  
  const generateRoleID = () => {
    const digits = "0123";  
    let roleId = "R_";
    for (let i = 0; i < 3; i++) {  
        roleId += digits[Math.floor(Math.random() * digits.length)];  
    }
    return roleId;  
};

const CoustmerID = () => {
  const digits = "0123";  
  let roleId = "Cus-";
  for (let i = 0; i < 3; i++) {  
      roleId += digits[Math.floor(Math.random() * digits.length)];  
  }
  return roleId;  
};

  module.exports = {
    token,
    availableTimeAndDate,
    BOOKINGID,
    s3FileUpload,
    timeWithDate,
    generateRoleID,
    s3PDFUpload,
    CoustmerID
  }