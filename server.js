const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require("path")
require('dotenv').config();
const cors = require("cors");
const app = express();

//port Chnages.....
const PORT = process.env.PORT || 3011;

app.use(bodyParser.json());

app.use(cors());

const UserRoutes = require("./routers/userRouter");
const SellerRoute = require("./routers/sellerRoute");
const BranchRoute = require("./routers/branchRoute");
const Categoryroute = require("./routers/categoryRouter");
const ProductRoute = require("./routers/productRoute");
const skuRoute = require("./routers/SKURoute")
const BrandRoute = require("./routers/brandRoute");
const OrdersRoute = require("./routers/orderBookingRoute");
const ShippingRoute = require("./routers/shippingAddressRoute");
const Image = require("./routers/imageRoute")
const adminFeature = require("./routers/AdminPortalRoutes/featuresRoutes");
const RoleRoutes = require("./routers/AdminPortalRoutes/roleRoutes");
const employeRoutes = require("./routers/AdminPortalRoutes/employeRoutes");
const Invoice = require("./routers/invoiceRoute")
const sellerfetaures = require("./routers/sellerFeatureRoutes")
const SellerRoleroutes = require("./routers/sellerRoleRouter")






app.use(UserRoutes);
app.use(SellerRoute);
app.use(BranchRoute);
app.use(Categoryroute);
app.use(ProductRoute);
app.use(skuRoute);
app.use(BrandRoute);
app.use(OrdersRoute);
app.use(ShippingRoute);
app.use(Image);
app.use(adminFeature);
app.use(employeRoutes);
app.use(RoleRoutes);
app.use(Invoice);
app.use(sellerfetaures);
app.use(SellerRoleroutes)





mongoose.connect('mongodb+srv://ajayamunik:Nfed6RWJWGDd2fMN@cluster0.51duirc.mongodb.net/Mr_Sasta', {})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Connection error:', err));
