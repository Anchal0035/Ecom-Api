"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controller/UserController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
exports.UserRoute = express_1.default.Router();
var axios = require("axios").default;
exports.UserRoute.post("/buyer/signup", UserController_1.userController.signup);
exports.UserRoute.post("/admin/signup", UserController_1.userController.signup);
exports.UserRoute.post("/seller/signup", UserController_1.userController.signup);
exports.UserRoute.post("/admin/login", UserController_1.userController.login);
exports.UserRoute.post("/buyer/login", UserController_1.userController.login);
exports.UserRoute.post("/seller/login", UserController_1.userController.login);
exports.UserRoute.post("/logout", authMiddleware_1.default, UserController_1.userController.logout);
exports.UserRoute.post("/forgetpassword", UserController_1.userController.forgetPassword);
exports.UserRoute.get("/googleLogin", UserController_1.userController.googleLogin);
//UserRoute.post("/buyer/phoneLogin",userController.phoneLogin);
