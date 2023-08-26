"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const bcrypt = __importStar(require("bcrypt"));
const user_model_1 = __importDefault(require("../database/models/user-model"));
const address_model_1 = __importDefault(require("../database/models/address-model"));
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();
class DashboardController {
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.body.id;
                const { username, email, gender, ph_no } = req.body;
                const result = yield user_model_1.default.updateMany({ _id: user_id }, {
                    $set: {
                        username: username,
                        email: email,
                        gender: gender,
                        ph_no: ph_no
                    }
                });
                console.log("result of update profile---", result);
                res.status(200).json({ message: "profile update successful" });
            }
            catch (err) {
                console.error(err);
                return res.status(400).send('Please provide proper information');
            }
        });
    }
    addAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("-------------------updateAddress---------------");
                const user_id = req.body.id;
                console.log("user_id++++++", req.body.id);
                console.log("user_body++++++", req.body);
                const { House_No, Street, State, City, landmark } = req.body;
                console.log("data_entered++++++", House_No, Street, State, City, landmark);
                const result = yield address_model_1.default.create({ House_No: House_No, Street: Street, State: State, City: City, landmark: landmark, user_id: user_id });
                console.log("Address added result---", result);
                res.status(200).json({ message: "Address added to profile" });
            }
            catch (err) {
                console.error(err);
                return res.status(400).send('Please provide proper information');
            }
        });
    }
    updateAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("-------------------updateAddress---------------");
                const user_id = req.body.id;
                console.log("user_id++++++", req.body.id);
                console.log("user_body++++++", req.body);
                const { House_No, Street, State, City, landmark, address_id } = req.body;
                console.log("data_entered++++++", House_No, Street, State, City, landmark);
                const result = yield address_model_1.default.updateMany({ _id: address_id }, { $set: { House_No: House_No, Street: Street, State: State, City: City, landmark: landmark } });
                console.log("Address added result---", result);
                res.status(200).json({ message: "Address updated to profile" });
            }
            catch (err) {
                console.error(err);
                return res.status(400).send('Please provide proper information');
            }
        });
    }
    listAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.body.id;
                const result = yield address_model_1.default.find({ user_id: user_id });
                console.log("list of address result---", result);
                res.status(200).json({ message: "List of address", result });
            }
            catch (err) {
                console.error(err);
                return res.status(400).send('Please provide proper information');
            }
        });
    }
    deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.body.id;
                const session_id = req.body.session_id;
                const result = yield user_model_1.default.deleteOne({ _id: user_id });
                const rr = yield address_model_1.default.deleteMany({ user_id: user_id });
                yield client.DEL(`${user_id}_${session_id}`);
                return res.status(200).json({ message: "Account deleted" });
            }
            catch (err) {
                console.error(err);
                return res.status(400).send('Account is not deleted due to error');
            }
        });
    }
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.body.id;
                const newpass = req.body;
                const newhashpass = yield bcrypt.hash(newpass, 4);
                const result = yield user_model_1.default.updateOne({ _id: user_id }, {
                    $set: {
                        password: newhashpass
                    }
                });
                return res.status(200).json({ message: "Account Password updated, Please login again" });
            }
            catch (err) {
                console.error(err);
                return res.status(400).send('Account Password not updated due to error');
            }
        });
    }
}
exports.dashboardController = new DashboardController();
