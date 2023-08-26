"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsRoute = void 0;
const express_1 = __importDefault(require("express"));
const twilioController_1 = require("../controller/twilioController");
exports.SmsRoute = express_1.default.Router();
exports.SmsRoute.post("/sendOtp", twilioController_1.TwilioController.phoneLogin);
exports.SmsRoute.post("/verifyOtp", twilioController_1.TwilioController.verifyOtp);
