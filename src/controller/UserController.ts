import { Request, Response, json } from "express";
import url = require("url");
import User from "../database/models/user-model"
import seller from "../database/models/seller-model";
import Session from "../database/models/session-model"
import admin from "../database/models/admin-model";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { createClient } from "redis";
const TWILIO_ACCOUNT_SID = "AC74bf0c1a09a8e97d0fdaec63d9582fe7"
const TWILIO_AUTH_TOKEN = "1b2d914f7306417f6ddab2ea4e31aa2d"
const twilioclient = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

require('dotenv').config();
var axios = require("axios").default;

const client = createClient();

client.on("error", (err: Error) => {
    console.log("redis error");
})

client.connect();

class UserController {

    async signup(req: Request, res: Response) {
        try {
            const ur = url.parse(req.url, true)
            const check = ur.pathname;
            console.log(check);
            const { username, email, password } = req.body;
            console.log("body", req.body);
            if (check == "/buyer/signup") {
                const checkName = await User.findOne({ username: username });
                const checkEmail = await User.findOne({ email: email })
                if (!checkName && !checkEmail) {
                    const pass = await bcrypt.hash(password, 4);
                    console.log(pass);
                    await User.create({ username: username, email: email, password: pass });
                    return res.status(200).json({ message: "OK" });
                }
                else {
                    return res.status(200).json({ message: "user exists" });
                }

            }
            else if (check == "/seller/signup") {
                const checkName = await seller.findOne({ username: username });
                const checkEmail = await seller.findOne({ email: email })
                if (!checkName && !checkEmail) {
                    const pass = await bcrypt.hash(password, 4);
                    console.log(pass);
                    await seller.create({ username: username, email: email, password: pass });
                    return res.status(200).json({ message: "OK" });
                }
                else {
                    return res.status(200).json({ message: "user exists" });
                }
            }
            else if (check == "/admin/signup") {
                return res.status(200).json({ message: "Admin not allowed to signup" })
            }

            else {
                return res.status(200).json({ message: "enter correct url" });
            }


        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ message: "server error" });
        }
    }

    async login(req: Request, res: Response) {
        try {
            console.log("login Process");
            const ur = url.parse(req.url, true)
            const check = ur.pathname;
            console.log(check);
            const { username, password } = req.body;
            var result: any;
            if (check == "/buyer/login") {
                result = await User.findOne({ username: username });
                if (!username) {
                    return res.status(200).json(
                        { message: "wrong username" });
                }
            }

            else if (check == "/seller/login") {
                result = await seller.findOne({ username: username });
                if (!username) {
                    return res.status(200).json(
                        { message: "wrong username" });
                }
            }
            else if (check == "/admin/login") {
                result = await admin.findOne({ username: username });
                if (!username) {
                    return res.status(200).json(
                        { message: "wrong username" });
                }
            }

            else {
                return res.status(200).json({ message: "enter correct url" });
            }

            const pass = await bcrypt.compare(password, result.password)
            if (pass) {
                console.log('Login result', result);
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

                console.log("token", token);


                await client.set(`${result.id}_${a._id}`, JSON.stringify(session_payload))
                return res.send({ message: "User Login Succesfully", token: token })

            }
            return res.status(400).json({ message: "Incorrect Password" });
        }
        catch (err) {
            console.error(err);
            return res.status(400).json({ message: "server problem" });
        }


    }

    async logout(req: Request, res: Response) {
        try {
            console.log("--------------logout process-------------------");
            const user_id = req.body.id;
            const session_id = req.body.session_id;
            console.log("sessen_idin logout-----", session_id);

            const session_result = await Session.updateOne(
                { _id: session_id },
                {
                    $set: {
                        isSessionActive: false,
                        device_id: 2345
                    }
                }
            );
            const rr = await Session.findOne({ _id: session_id });
            console.log("rr-----------", rr);
            console.log("session_result from logout----after update", session_result);
            await client.DEL(`${user_id}_${session_id}`);
            console.log('Logout', session_result);
            return res.status(200).send('Logout');
        }
        catch (err) { }
    }

    async forgetPassword(req: Request, res: Response) {
        try {
            const { username, newpass } = req.body;
            const result = await User.findOne({ username: username })
            if (!result) {
                res.status(200).json({ message: "invalid username" });
            }
            const newhashpass = await bcrypt.hash(newpass, 4);
            const updatepass = await User.updateOne(
                { username: username }, { $set: { password: newhashpass } });
            console.log("updated password", updatepass);
            res.status(200).json({ message: "password updated" })

        }
        catch (err) { }
    }

    //login with google
    async googleLogin(req: Request, res: Response): Promise<void> {
        const stringifiedParams = JSON.stringify({
            client_id: "218198959414-ne85nk2ger3v9f3lqeqadlsfs4mjov5s.apps.googleusercontent.com" as string,
            redirect_uri: 'http://localhost:4000/prod/viewAllProd',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ].join(' '), // space seperated string
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent',
        });

        const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
        res.status(200).json(googleLoginUrl);

    }
    async handleGoogleCallback(req: Request, res: Response) {
        const { code } = req.query;

        var options = {
            method: 'POST',
            url: 'https://accounts.google.com/o/oauth2/token',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: '218198959414-ne85nk2ger3v9f3lqeqadlsfs4mjov5s.apps.googleusercontent.com',
                client_secret: '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',
                code: code as string,
                redirect_uri: 'http://localhost:4000/prod/viewAllProd'
            })
        };

        axios.request(options).then(function (res: any) {
            console.log(res.data);
        }).catch(function (error: Error) {
            console.error(error);
        });

    }
 
}

export const userController = new UserController();

