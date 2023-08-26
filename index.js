"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const db_connect_1 = __importDefault(require("./src/database/db-connect"));
const user_route_1 = require("./src/route/user-route");
const dashboardh_route_1 = require("./src/route/dashboardh-route");
const product_route_1 = require("./src/route/product-route");
const admin_route_1 = require("./src/route/admin-route");
const twilio_route_1 = require("./src/route/twilio-route");
db_connect_1.default;
const app = express();
app.use(express.json());
app.use("/auth", user_route_1.UserRoute);
app.use("/dash", dashboardh_route_1.dashboardRoute);
app.use("/prod", product_route_1.prodroute);
app.use("/admin", admin_route_1.adminRoute);
app.use("/sms", twilio_route_1.SmsRoute);
app.listen(4000, () => {
    console.log("server started at port 4000");
});
