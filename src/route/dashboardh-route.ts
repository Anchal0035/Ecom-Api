import express from "express";
import { dashboardController } from "../controller/dashboardController";
import auth from "../middleware/authMiddleware"
export const dashboardRoute=express.Router();

dashboardRoute.post("/updateprofile",auth,dashboardController.updateProfile)
dashboardRoute.post("/updateaddress",auth,dashboardController.updateAddress)
dashboardRoute.post("/addaddress",auth,dashboardController.addAddress)
dashboardRoute.post("/listaddress",auth,dashboardController.listAddress)