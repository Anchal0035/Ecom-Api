import express= require( "express");
import Connect from "./src/database/db-connect";
import {UserRoute} from "./src/route/user-route";
import {dashboardRoute} from "./src/route/dashboardh-route";
import { prodroute } from "./src/route/product-route";
import { adminRoute } from "./src/route/admin-route";
import {SmsRoute} from "./src/route/twilio-route"

Connect;
const app=express();
app.use(express.json());

app.use("/auth",UserRoute);
app.use("/dash",dashboardRoute);
app.use("/prod",prodroute);
app.use("/admin",adminRoute);
app.use("/sms",SmsRoute)

app.listen(4000,()=>{
    console.log("server started at port 4000");
});
