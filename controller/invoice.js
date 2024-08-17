const fs = require("fs");
const pdfMake = require("pdfmake");
const path = require("path");
const { ToWords } = require("to-words");
const axios = require("axios");


const helper = require("../helper/helper");

const orderBookingModel = require("../models/orderBooking");
const UserModel = require("../models/userModel");
const OrderBookingInfoModel = require("../models/orderBookingInfo")
const orderSummaryModel = require("../models/orderSummary");
const employeModel = require("../models/adminPortal/employeModel")


const Invoice = async (req, res) => {
    try {
      const { orderbookingId } = req.body;
      const adminId = req.userId.id;
  
      const OrderBooking = await orderBookingModel.findById(orderbookingId);
      if (!OrderBooking) return res.status(200).send({ responseCode: 200, message: "Booking not found" });
  
      const userData = await UserModel.findById(OrderBooking.userId); 
      // console.log(userData)
  
      const serviceBookingInfos = await OrderBookingInfoModel.find({ orderBookingId: OrderBooking._id });
    
      const orderSummary = await orderSummaryModel.findOne({ orderId: orderbookingId });
      console.log(orderSummary);

      const adminData = await employeModel.findById(adminId);
      console.log(adminData,"_________________")
  
      const totals = serviceBookingInfos.reduce((acc, info) => {
        acc.totalRate += parseFloat(info.price);
        acc.totalDiscountAmount += parseFloat(info.discount);
        acc.totalTaxAmount += parseFloat(info.tax);
        acc.totalAmount += parseFloat(info.final_price);
        acc.totalQuantity += parseFloat(info.purchaseQuantity);
        // acc.totalPackets += parseInt(info.packets);
  
        return acc;
      }, { totalRate: 0, totalDiscountAmount: 0, totalTaxAmount: 0, totalAmount: 0, totalQuantity: 0, totalPackets: 0 });
  
      console.log(totals);
  
      const hsnDetails = serviceBookingInfos.reduce((result, info) => {
        if (info.sac_hsn && info.sac_hsn !== 0) {
          if (!result[info.sac_hsn]) {
            result[info.sac_hsn] = { hsn_sac: info.sac_hsn, totalTax: 0, totalAmount: 0, taxAmount: 0 };
          }
          result[info.sac_hsn].totalTax += parseFloat(info.tax);
          result[info.sac_hsn].totalAmount += parseFloat(info.totalAmount);
          result[info.sac_hsn].taxAmount += parseFloat(info.taxAmount);
        }
        return result;
      }, {});
  
      const hsnList = Object.values(hsnDetails);
      const toWords = new ToWords();
      const words = toWords.convert(Math.round(totals.totalAmount));
      const currentDate = new Date(helper.availableTimeAndDate()).toLocaleDateString("en-GB");
  
      const fetchImageAndConvertToBase64 = async (url) => {
        try {
          const response = await axios.get(url, { responseType: "arraybuffer" });
          if (response.status !== 200) throw new Error(`Failed to fetch image. Status code: ${response.status}`);
          return Buffer.from(response.data, "binary").toString("base64");
        } catch (error) {
          console.error("Error fetching or converting the image:", error.message);
          return null;
        }
      };
  
      const logoUrl = "http://vr-images.vecrep.com/1718859919171_jpflogo.png";
    //   const garageLogo = adminData.image ? await fetchImageAndConvertToBase64(adminData.image) : null;

      const VRGarageLogo = await fetchImageAndConvertToBase64(logoUrl);
  
      const fonts = {
        Roboto: {
          normal: path.join(__dirname, "../fonts/Roboto-Regular.ttf"),
          bold: path.join(__dirname, "../fonts/Roboto-Bold.ttf"),
          italics: path.join(__dirname, "../fonts/Roboto-Italic.ttf"),
          bolditalics: path.join(__dirname, "../fonts/Roboto-BoldItalic.ttf"),
        },
      };
  
      const pdfMakePrinter = new pdfMake(fonts);
      const docDefinition = {
        content: [
          {
            columns: [
              {
                alignment: "right",
                lineHeight: 1.4,
                text: [
                  { text: "Date: ", fontSize: 13, fontWeight: 600 },
                  `${helper.availableTimeAndDate()}\n`,
                  { text: "Order Id: ", fontSize: 13, fontWeight: 600 },
                  `${OrderBooking.bookingId}\n`,
                  { text: "Invoice number: ", fontSize: 13, fontWeight: 600 },
                  `INV${Date.now()}`,
                ],
              },
            ],
          },
          { text: "Mr.Sasta INVOICE", style: "header" },
          {
            style: "gargeDetails",
            table: {
              headerRows: 1,
              widths: ["50%", "50%"],
              body: [
                [{ text: "Mr.Sasta", fontWeight: 600 }, { text: "Customer Details", fontWeight: 600 }],
                [
                  {
                    text: [
                      { text: "Mr.Sasta", fontSize: 13, fontWeight: 600 },
                      "\n",
                      `Ph: ${"000000000"}\n`,
                      // userData.gstNumber ? `GSTN: ${"gstNumber"}\n` : "",
                      `Address: ${"Hyderabad"}\n`,
                    ],
                  },
                  {
                    text: [
                      { text: userData ? userData.userName : "", fontSize: 13, fontWeight: 600 },
                      "\n",
                      `Ph: ${userData.phone}\n`,
                      // userData.tax ? `GSTN: ${userData.tax}\n` : "",
                      `Address: ${userData.location}\n`,
                    ],
                  },
                ],
              ],
            },
          },
          {
            style: "tableExample",
            layout: "lightHorizontalLines",
            table: {
              headerRows: 1,
              widths: ["10%", "25%", "10%", "5%", "9%", "14%", "14%", "15%"],
              body: [
                [
                  { text: "S.No", style: "tableHeader" },
                  { text: "ProductName", style: "tableHeader" },
                  { text: "totalQuantity", style: "tableHeader" },
                  { text: "Qty", style: "tableHeader" },
                  { text: "Price", style: "tableHeader" },
                  { text: "Dis%", style: "tableHeader" },
                  // { text: "Tax", style: "tableHeader" },
                  { text: "Total", style: "tableHeader" },
                ],
                ...serviceBookingInfos.map((item, index) => [
                  { text: index + 1, margin: [0, 5, 0, 5], alignment: "center" },
                  { text: item.productName, margin: [0, 5, 0, 5], alignment: "center" },
                  { text: item.purchaseQuantity === 0 ? "-" : item.purchaseQuantity, margin: [0, 5, 0, 5], alignment: "center" },
                  { text: item.quantityValue, margin: [0, 5, 0, 5], alignment: "center" },
                  { text: `₹${item.price}`, margin: [0, 5, 0, 5], alignment: "center" },
                  { text: `${item.discount}% `, margin: [0, 5, 0, 5], alignment: "center" },
                  // { text: `${item.tax}%  `, margin: [0, 5, 0, 5], alignment: "center" },
                  { text: `₹${item.final_price}`, margin: [0, 5, 0, 5], alignment: "center" },
                ]),
                [
                  { text: "Total", style: "tableFooter", colSpan: 2, alignment: "center", color: "#b11226" }, {}, 
                  { text: totals.totalPackets, style: "tableFooter", alignment: "center" },
                  { text: totals.totalQuantity, style: "tableFooter", alignment: "center" },
                  { text: `₹${totals.totalRate}`, style: "tableFooter", alignment: "center" },
                  { text: `${totals.totalDiscountAmount}%`, style: "tableFooter", alignment: "center" },
                  { text: `₹${totals.totalTaxAmount}`, style: "tableFooter", alignment: "center" },
                  { text: `₹${totals.totalAmount}`, style: "tableFooter", color: "#b11226", alignment: "center" },
                ],
              ],
            },
          },
          {
            alignment: "right",
            stack: [
              { text: `${words} Rupees Only`, alignment: "right", bold: true, margin: [20, 5, 0, 5] },
              { text: `(Payment by ${orderSummary.paymentMethod})`, alignment: "right", bold: true, margin: [20, 5, 0, 5] },
            ],
          },
          { text: "Terms & Conditions", margin: [0, 20, 0, 0], bold: true },
          {
            ul: [
              "Subject to our home jurisdiction.",
              "Our responsibility ceases as soon as goods leave our premises.",
              "Goods once sold will not be taken back.",
              "If the bill is not paid within 30 days, extra interest will be charged.",
            ],
            lineHeight: "1.4",
            margin: [0, 10, 0, 0],
          },
          {
            columns: [
              { image: `data:image/jpeg;base64,${VRGarageLogo}`, width: 60, height: 40, alignment: "left" },
              { text: "Authorized Signature", alignment: "right", lineHeight: 1.4 },
            ],
            margin: [0, 5, 0, 0],
          },
        ],
        styles: {
          header: { fontSize: 18, fontWeight: 500, alignment: "center", margin: [0, 15, 0, 10] },
          tableExample: { margin: [0, 15, 0, 15], font: "Roboto" },
          tableHeader: { fontSize: 12, bold: true, fillColor: "#b11226", alignment: "center", color: "#ffffff" },
          tableFooter: { margin: [0, 5, 0, 5] },
          invoiceTitle: { textTransform: "uppercase" },
        },
      };
  
      const filePath = "invoice.pdf";
      const pdfDoc = pdfMakePrinter.createPdfKitDocument(docDefinition);
      const pdfPromise = new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        pdfDoc.pipe(writeStream);
        pdfDoc.end();
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
  
      await pdfPromise;
  
      const fileName = await helper.s3PDFUpload(filePath);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting PDF:", err);
        else console.log("Local PDF file deleted!");
      });
  

      await orderBookingModel.findByIdAndUpdate(orderbookingId, {
        $set: { invoiceURL: `https://mrsasta.s3.eu-north-1.amazonaws.com/${fileName}` },
      });
  
      res.status(200).send({ responseCode: 200, message: "Successful", invoice: `https://mrsasta.s3.eu-north-1.amazonaws.com/${fileName}` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  };
  


module.exports={
    Invoice

  }