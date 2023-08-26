"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const adminController_1 = require("../controller/adminController");
const adminMiddleware_1 = __importDefault(require("../middleware/adminMiddleware"));
exports.adminRoute = express_1.default.Router();
exports.adminRoute.post("/notApproved", authMiddleware_1.default, adminMiddleware_1.default, adminController_1.adminController.notApprovedList);
exports.adminRoute.post("/approvedList", authMiddleware_1.default, adminMiddleware_1.default, adminController_1.adminController.approvedList);
exports.adminRoute.post("/changeApproval", authMiddleware_1.default, adminMiddleware_1.default, adminController_1.adminController.changeApproval);
exports.adminRoute.post("/removeSellerAccount", authMiddleware_1.default, adminMiddleware_1.default, adminController_1.adminController.removeSellerAccount);
