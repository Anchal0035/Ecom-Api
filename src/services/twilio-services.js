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
exports.createSession = exports.createUserwithPhone = exports.checkBuyerExistence = exports.otpVerification = exports.redisSession = exports.signInByPh_no = void 0;
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID, TWILIO_PHONE_NUMBER } = process.env;
const twilioclient = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const bcrypt_1 = __importDefault(require("bcrypt"));
const redis_1 = require("redis");
const user_model_1 = __importDefault(require("../database/models/user-model"));
const session_model_1 = __importDefault(require("../database/models/session-model"));
const jwt = __importStar(require("jsonwebtoken"));
const client = (0, redis_1.createClient)();
client.on("error", (err) => {
    console.log("redis error");
});
client.connect();
const signInByPh_no = (number) => __awaiter(void 0, void 0, void 0, function* () {
    //otp generation
    var minm = 10000;
    var maxm = 99999;
    var randomNumber = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    //message
    const message = `Hello from OLX! Your verification code is: ${randomNumber}`;
    //sms creation
    const response1 = yield twilioclient.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${number}`,
        body: message,
    });
    console.log(response1);
    const hash = yield bcrypt_1.default.hash(randomNumber.toString(), 2);
    (0, exports.redisSession)(number, hash);
});
exports.signInByPh_no = signInByPh_no;
const redisSession = (num, otp) => __awaiter(void 0, void 0, void 0, function* () {
    let otpdata = {
        id: num,
        otp: otp
    };
    const redisss = yield client.set(`${num}_otp`, JSON.stringify(otpdata));
    console.log("rediss session check", redisss);
});
exports.redisSession = redisSession;
const otpVerification = (num, otp) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("num in service ", num);
    const getsession = yield client.get(`${num}_otp`);
    console.log("session", getsession);
    console.log("json otp", JSON.parse(getsession).otp);
    const check = yield bcrypt_1.default.compare(otp, JSON.parse(getsession).otp);
    console.log(check);
    return check;
});
exports.otpVerification = otpVerification;
const checkBuyerExistence = (num, rolename, username) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("--------------------------start checking user with phone number--------------------");
    const check = yield user_model_1.default.findOne({ ph_no: num, username: username, role: rolename });
    if (check) {
        const token = (0, exports.createSession)(num, rolename, username);
        return token;
    }
    return false;
});
exports.checkBuyerExistence = checkBuyerExistence;
const createUserwithPhone = (num, rolename, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("--------------------------start creation with phone number--------------------");
        const createUser = yield user_model_1.default.create({ username: username, ph_no: num, role: rolename });
        console.log("-----user created with phone in twilio service--- ", createUser);
        const token = (0, exports.createSession)(num, rolename, username);
        return token;
    }
    catch (err) {
        return ("error in creating user");
    }
});
exports.createUserwithPhone = createUserwithPhone;
const createSession = (num, rolename, username) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("------------------------------entered in createSession in twilio service------------------");
    const result = yield user_model_1.default.findOne({ ph_no: num, username: username, role: rolename });
    if (result) {
        let session_payload = {
            user_id: result._id,
            device_id: "1234",
            device_type: "google chrome",
            isSessionActive: true
        };
        yield session_model_1.default.create([
            session_payload
        ]);
        const a = yield session_model_1.default.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
        console.log("session-id===", a);
        const token = jwt.sign({ id: result._id, session_id: a._id, role_id: result.role }, "secretkey", { expiresIn: '3h' });
        console.log("token in twillio service", token);
        yield client.set(`${result.id}_${a._id}`, JSON.stringify(session_payload));
        console.log("---------------completed cretesession in twilio service-------------------------");
        return token;
    }
});
exports.createSession = createSession;
