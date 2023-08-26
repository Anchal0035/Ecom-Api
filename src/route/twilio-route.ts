import express from "express";
import { TwilioController } from "../controller/twilioController";
export const SmsRoute=express.Router();

SmsRoute.post("/sendOtp",TwilioController.phoneLogin);
SmsRoute.post("/verifyOtp",TwilioController.verifyOtp)