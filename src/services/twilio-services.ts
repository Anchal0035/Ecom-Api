const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID, TWILIO_PHONE_NUMBER } = process.env;
const twilioclient = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
import bcrypt from "bcrypt";
import { createClient } from "redis";
import User from "../database/models/user-model";
import Session from "../database/models/session-model";
import * as jwt from "jsonwebtoken";

const client = createClient();
client.on("error", (err: Error) => {
    console.log("redis error");
})
client.connect();

export const signInByPh_no = async (number: string) => {
    //otp generation
    var minm = 10000;
    var maxm = 99999;
    var randomNumber = Math.floor(Math.random() * (maxm - minm + 1)) + minm

    //message
    const message = `Hello from OLX! Your verification code is: ${randomNumber}`;
    //sms creation
    const response1 = await twilioclient.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${number}`,
        body: message,
    });
    console.log(response1);
    const hash = await bcrypt.hash(randomNumber.toString(), 2)
    redisSession(number, hash)
}

export const redisSession = async (num: string, otp: string) => {
    let otpdata = {
        id: num,
        otp: otp
    }
    const redisss = await client.set(`${num}_otp`, JSON.stringify(otpdata));
    console.log("rediss session check", redisss);

}

export const otpVerification = async (num: string, otp: string) => {
    console.log("num in service ", num);
    const getsession: any = await client.get(`${num}_otp`)
    console.log("session", getsession);
    console.log("json otp", JSON.parse(getsession).otp);
    const check = await bcrypt.compare(otp, JSON.parse(getsession).otp)
    console.log(check);
    return check;

}
export const checkBuyerExistence = async (num: string, rolename: string, username: string) => {
    console.log("--------------------------start checking user with phone number--------------------");
    const check = await User.findOne({ ph_no: num, username: username, role: rolename });
    if (check) {
        const token=createSession(num, rolename, username);
        return token;
        
    }
    return false;
}

export const createUserwithPhone = async (num: string, rolename: string, username: string) => {
    try {
        console.log("--------------------------start creation with phone number--------------------");
        const createUser = await User.create({ username: username, ph_no: num, role: rolename });
        console.log("-----user created with phone in twilio service--- ", createUser);
        const token=createSession(num, rolename, username);
        return token;
    }
    catch (err) {
        return ("error in creating user")
    }

}

export const createSession = async (num: string, rolename: string, username: string) => {
    console.log("------------------------------entered in createSession in twilio service------------------");

    const result = await User.findOne({ ph_no: num, username: username, role: rolename });
    if (result) {
        let session_payload: any = {
            user_id: result._id,
            device_id: "1234",
            device_type: "google chrome",
            isSessionActive: true
        }
        await Session.create([
            session_payload
        ])
        const a: any = await Session.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
        console.log("session-id===", a);
        const token = jwt.sign({ id: result._id, session_id: a._id, role_id: result.role }, "secretkey", { expiresIn: '3h' });

        console.log("token in twillio service", token);


        await client.set(`${result.id}_${a._id}`, JSON.stringify(session_payload))
        console.log("---------------completed cretesession in twilio service-------------------------");
        return token;
    }
}