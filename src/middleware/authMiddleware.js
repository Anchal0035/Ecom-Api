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
const session_model_1 = __importDefault(require("../database/models/session-model"));
const client = (0, redis_1.createClient)();
client.on("error", (err) => {
    console.log("redis error");
});
client.connect();
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(200).json({ message: "ACCESS Denied" });
        }
        try {
            console.log("--------------------AuthController started ---------------------");
            const decodedtoken = yield jsonwebtoken_1.default.verify(token, "secretkey");
            console.log("decode-----userid--", decodedtoken.id);
            console.log("decode --sessionid----", decodedtoken.session_id);
            const findSession = (yield client.get(`${decodedtoken.id}_${decodedtoken.session_id}`)) || (yield session_model_1.default.findOne({ id: decodedtoken.session_id }));
            console.log("   ");
            console.log("findsession=====", findSession);
            if (findSession.isSessionActive === false) {
                return res.status(400).send("Session out");
            }
            req.body.id = decodedtoken.id;
            console.log('req.body.id====', req.body.id);
            req.body.session_id = decodedtoken.session_id;
            console.log("--------------------AuthController closed ---------------------");
            next();
        }
        catch (err) {
            res.status(200).json({ message: "invalid token" });
        }
    });
}
exports.default = auth;
