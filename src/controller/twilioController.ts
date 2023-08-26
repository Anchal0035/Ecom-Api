import { Request, Response, NextFunction, json } from "express";
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID, TWILIO_PHONE_NUMBER } = process.env;
const twilioclient = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
import url = require("url");
import { createClient } from "redis";
import { checkBuyerExistence, createUserwithPhone, signInByPh_no } from "../services/twilio-services";
import { otpVerification } from "../services/twilio-services"
const client = createClient();
client.connect();

class twilioController {

    //Signup with phone number 
    async phoneLogin(req: Request, res: Response) {
        try {
            const number = req.body.number;
            signInByPh_no(number);
            return res.json({ message: "OTP send" });

        }
        catch (err) {
            return res.json({ message: "Error" });

        }

    }
    async verifyOtp(req: Request, res: Response) {
        try {
            console.log("entered controller to verify")
            const {number, otp, username,rolename}=req.body
    
            const check = await otpVerification(number, otp)
            if (check) {

                if(rolename=="Seller"){
                    
                }
                else if(rolename=="Buyer"){
                    const result=await checkBuyerExistence(number,username,rolename);
                    if(result){
                        return res.status(200).json({token:result});
                    }
                    else{
                        const createUser=await createUserwithPhone(number,username,rolename)
                        console.log(createUser,"in controller")
                        return res.status(200).json({message:createUser})
                        

                    }
                    
                }
                
            }
            else {
                return res.status(200).json("not verified")

            }

        }
        catch (err) {     
            return res.status(200).json("error in verificaton ")
        }

    }



}
export const TwilioController = new twilioController();