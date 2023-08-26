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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioController = void 0;
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID, TWILIO_PHONE_NUMBER } = process.env;
const twilioclient = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const redis_1 = require("redis");
const twilio_services_1 = require("../services/twilio-services");
const twilio_services_2 = require("../services/twilio-services");
const client = (0, redis_1.createClient)();
client.connect();
class twilioController {
    //Signup with phone number 
    phoneLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const number = req.body.number;
                (0, twilio_services_1.signInByPh_no)(number);
                return res.json({ message: "OTP send" });
            }
            catch (err) {
                return res.json({ message: "Error" });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("entered controller to verify");
                const { number, otp, username, rolename } = req.body;
                const check = yield (0, twilio_services_2.otpVerification)(number, otp);
                if (check) {
                    if (rolename == "Seller") {
                    }
                    else if (rolename == "Buyer") {
                        const result = yield (0, twilio_services_1.checkBuyerExistence)(number, username, rolename);
                        if (result) {
                            return res.status(200).json({ token: result });
                        }
                        else {
                            const createUser = yield (0, twilio_services_1.createUserwithPhone)(number, username, rolename);
                            console.log(createUser, "in controller");
                            return res.status(200).json({ message: createUser });
                        }
                    }
                }
                else {
                    return res.status(200).json("not verified");
                }
            }
            catch (err) {
                return res.status(200).json("error in verificaton ");
            }
        });
    }
}
exports.TwilioController = new twilioController();
