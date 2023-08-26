import express from "express";
import { userController } from "../controller/UserController";
import auth from "../middleware/authMiddleware"
export const UserRoute=express.Router();
var axios = require("axios").default;


UserRoute.post("/buyer/signup",userController.signup);
UserRoute.post("/admin/signup",userController.signup);
UserRoute.post("/seller/signup",userController.signup);
UserRoute.post("/admin/login",userController.login);
UserRoute.post("/buyer/login",userController.login);
UserRoute.post("/seller/login",userController.login);
UserRoute.post("/logout",auth,userController.logout);
UserRoute.post("/forgetpassword",userController.forgetPassword);
UserRoute.get("/googleLogin",userController.googleLogin);
//UserRoute.post("/buyer/phoneLogin",userController.phoneLogin);





