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
exports.userController = void 0;
const url = require("url");
const user_model_1 = __importDefault(require("../database/models/user-model"));
const seller_model_1 = __importDefault(require("../database/models/seller-model"));
const session_model_1 = __importDefault(require("../database/models/session-model"));
const admin_model_1 = __importDefault(require("../database/models/admin-model"));
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const redis_1 = require("redis");
const TWILIO_ACCOUNT_SID = "AC74bf0c1a09a8e97d0fdaec63d9582fe7";
const TWILIO_AUTH_TOKEN = "1b2d914f7306417f6ddab2ea4e31aa2d";
const twilioclient = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
require('dotenv').config();
var axios = require("axios").default;
const client = (0, redis_1.createClient)();
client.on("error", (err) => {
    console.log("redis error");
});
client.connect();
class UserController {
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ur = url.parse(req.url, true);
                const check = ur.pathname;
                console.log(check);
                const { username, email, password } = req.body;
                console.log("body", req.body);
                if (check == "/buyer/signup") {
                    const checkName = yield user_model_1.default.findOne({ username: username });
                    const checkEmail = yield user_model_1.default.findOne({ email: email });
                    if (!checkName && !checkEmail) {
                        const pass = yield bcrypt.hash(password, 4);
                        console.log(pass);
                        yield user_model_1.default.create({ username: username, email: email, password: pass });
                        return res.status(200).json({ message: "OK" });
                    }
                    else {
                        return res.status(200).json({ message: "user exists" });
                    }
                }
                else if (check == "/seller/signup") {
                    const checkName = yield seller_model_1.default.findOne({ username: username });
                    const checkEmail = yield seller_model_1.default.findOne({ email: email });
                    if (!checkName && !checkEmail) {
                        const pass = yield bcrypt.hash(password, 4);
                        console.log(pass);
                        yield seller_model_1.default.create({ username: username, email: email, password: pass });
                        return res.status(200).json({ message: "OK" });
                    }
                    else {
                        return res.status(200).json({ message: "user exists" });
                    }
                }
                else if (check == "/admin/signup") {
                    return res.status(200).json({ message: "Admin not allowed to signup" });
                }
                else {
                    return res.status(200).json({ message: "enter correct url" });
                }
            }
            catch (err) {
                console.error(err);
                return res.status(400).json({ message: "server error" });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("login Process");
                const ur = url.parse(req.url, true);
                const check = ur.pathname;
                console.log(check);
                const { username, password } = req.body;
                var result;
                if (check == "/buyer/login") {
                    result = yield user_model_1.default.findOne({ username: username });
                    if (!username) {
                        return res.status(200).json({ message: "wrong username" });
                    }
                }
                else if (check == "/seller/login") {
                    result = yield seller_model_1.default.findOne({ username: username });
                    if (!username) {
                        return res.status(200).json({ message: "wrong username" });
                    }
                }
                else if (check == "/admin/login") {
                    result = yield admin_model_1.default.findOne({ username: username });
                    if (!username) {
                        return res.status(200).json({ message: "wrong username" });
                    }
                }
                else {
                    return res.status(200).json({ message: "enter correct url" });
                }
                const pass = yield bcrypt.compare(password, result.password);
                if (pass) {
                    console.log('Login result', result);
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
                    console.log("token", token);
                    yield client.set(`${result.id}_${a._id}`, JSON.stringify(session_payload));
                    return res.send({ message: "User Login Succesfully", token: token });
                }
                return res.status(400).json({ message: "Incorrect Password" });
            }
            catch (err) {
                console.error(err);
                return res.status(400).json({ message: "server problem" });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("--------------logout process-------------------");
                const user_id = req.body.id;
                const session_id = req.body.session_id;
                console.log("sessen_idin logout-----", session_id);
                const session_result = yield session_model_1.default.updateOne({ _id: session_id }, {
                    $set: {
                        isSessionActive: false,
                        device_id: 2345
                    }
                });
                const rr = yield session_model_1.default.findOne({ _id: session_id });
                console.log("rr-----------", rr);
                console.log("session_result from logout----after update", session_result);
                yield client.DEL(`${user_id}_${session_id}`);
                console.log('Logout', session_result);
                return res.status(200).send('Logout');
            }
            catch (err) { }
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, newpass } = req.body;
                const result = yield user_model_1.default.findOne({ username: username });
                if (!result) {
                    res.status(200).json({ message: "invalid username" });
                }
                const newhashpass = yield bcrypt.hash(newpass, 4);
                const updatepass = yield user_model_1.default.updateOne({ username: username }, { $set: { password: newhashpass } });
                console.log("updated password", updatepass);
                res.status(200).json({ message: "password updated" });
            }
            catch (err) { }
        });
    }
    //login with google
    googleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stringifiedParams = JSON.stringify({
                client_id: "218198959414-ne85nk2ger3v9f3lqeqadlsfs4mjov5s.apps.googleusercontent.com",
                redirect_uri: 'http://localhost:4000/prod/viewAllProd',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile',
                ].join(' '),
                response_type: 'code',
                access_type: 'offline',
                prompt: 'consent',
            });
            const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
            res.status(200).json(googleLoginUrl);
        });
    }
    handleGoogleCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.query;
            var options = {
                method: 'POST',
                url: 'https://accounts.google.com/o/oauth2/token',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: '218198959414-ne85nk2ger3v9f3lqeqadlsfs4mjov5s.apps.googleusercontent.com',
                    client_secret: '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',
                    code: code,
                    redirect_uri: 'http://localhost:4000/prod/viewAllProd'
                })
            };
            axios.request(options).then(function (res) {
                console.log(res.data);
            }).catch(function (error) {
                console.error(error);
            });
        });
    }
}
exports.userController = new UserController();
