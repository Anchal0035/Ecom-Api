"use strict";
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("redis");
const admin_model_1 = __importDefault(require("../database/models/admin-model"));
const client = (0, redis_1.createClient)();
client.on("error", (err) => {
    console.log("redis error");
});
function adminAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers.authorization; //get token from header
        if (!token) {
            return res.status(200).json({ message: "ACCESS Denied" });
        }
        console.log("--------------------roleMiddleware started ---------------------");
        const decodedtoken = yield jsonwebtoken_1.default.verify(token, "secretkey");
        console.log("decode-----userid--", decodedtoken.id);
        const rr = yield admin_model_1.default.findOne({ _id: decodedtoken.id });
        console.log("rr==", rr);
        if (rr) {
            console.log("Access as Admin provided");
            next();
        }
        else {
            console.log("You dont have access");
            return res.status(200).json({ message: "no Access to this page " });
        }
    });
}
exports.default = adminAuth;
