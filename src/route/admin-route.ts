import express from "express";
import auth from "../middleware/authMiddleware"
import { adminController } from "../controller/adminController";
import adminAuth from "../middleware/adminMiddleware"
export const adminRoute=express.Router();

adminRoute.post("/notApproved",auth,adminAuth,adminController.notApprovedList)
adminRoute.post("/approvedList",auth,adminAuth,adminController.approvedList);
adminRoute.post("/changeApproval",auth,adminAuth,adminController.changeApproval);
adminRoute.post("/removeSellerAccount",auth,adminAuth,adminController.removeSellerAccount);

