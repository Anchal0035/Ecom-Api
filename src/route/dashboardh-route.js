"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoute = void 0;
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controller/dashboardController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
exports.dashboardRoute = express_1.default.Router();
exports.dashboardRoute.post("/updateprofile", authMiddleware_1.default, dashboardController_1.dashboardController.updateProfile);
exports.dashboardRoute.post("/updateaddress", authMiddleware_1.default, dashboardController_1.dashboardController.updateAddress);
exports.dashboardRoute.post("/addaddress", authMiddleware_1.default, dashboardController_1.dashboardController.addAddress);
exports.dashboardRoute.post("/listaddress", authMiddleware_1.default, dashboardController_1.dashboardController.listAddress);
