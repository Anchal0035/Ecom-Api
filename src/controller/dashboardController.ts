import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import User from "../database/models/user-model";
import Address from "../database/models/address-model";
import { createClient } from "redis";
const client=createClient();

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();
class DashboardController {

    async updateProfile(req: Request, res: Response) {
        try {
            const user_id = req.body.id;
            const { username, email, gender, ph_no } = req.body;
            const result = await User.updateMany(
                { _id: user_id },
                {
                    $set: {
                        username: username,
                        email: email,
                        gender: gender,
                        ph_no: ph_no
                    }
                }
            )
            console.log("result of update profile---", result);
            res.status(200).json({ message: "profile update successful" });
        }
        catch (err) {
            console.error(err);
            return res.status(400).send('Please provide proper information');
        }
    }

    async addAddress(req: Request, res: Response) {
        try {
            console.log("-------------------updateAddress---------------");
            const user_id = req.body.id;
            console.log("user_id++++++", req.body.id);
            console.log("user_body++++++", req.body);
            const { House_No, Street, State, City, landmark } = req.body;
            console.log("data_entered++++++", House_No, Street, State, City, landmark);
            const result = await Address.create({ House_No: House_No, Street: Street, State: State, City: City, landmark: landmark, user_id: user_id })
            console.log("Address added result---", result);
            res.status(200).json({ message: "Address added to profile" });
        }
        catch (err) {
            console.error(err);
            return res.status(400).send('Please provide proper information');
        }
    }

    async updateAddress(req: Request, res: Response) {
        try {
            console.log("-------------------updateAddress---------------");
            const user_id = req.body.id;
            console.log("user_id++++++", req.body.id);
            console.log("user_body++++++", req.body);
            const { House_No, Street, State, City, landmark ,address_id} = req.body;
            console.log("data_entered++++++", House_No, Street, State, City, landmark);
            const result = await Address.updateMany(
                {_id: address_id},
                {$set:{ House_No: House_No, Street: Street, State: State, City: City, landmark: landmark }})
            console.log("Address added result---", result);
            res.status(200).json({ message: "Address updated to profile" });
        }
        catch (err) {
            console.error(err);
            return res.status(400).send('Please provide proper information');
        }
    }
    async listAddress(req: Request, res: Response) {
        try {
            const user_id = req.body.id;
            const result = await Address.find({ user_id: user_id })
            console.log("list of address result---", result);
            res.status(200).json({ message: "List of address", result });
        }
        catch (err) {
            console.error(err);
            return res.status(400).send('Please provide proper information');
        }
    }

    async deleteAccount(req: Request, res: Response){
        try{
            const user_id = req.body.id;
        const session_id=req.body.session_id;
        const result=await User.deleteOne({_id:user_id});
        const rr=await Address.deleteMany({user_id:user_id});
        await client.DEL(`${user_id}_${session_id}`)
        return res.status(200).json({message:"Account deleted"});
        }
        catch(err) {
            console.error(err);
            return res.status(400).send('Account is not deleted due to error');
        }    

    }

    async updatePassword(req: Request, res: Response){
        try{
            const user_id = req.body.id;
        const newpass=req.body;
        const newhashpass=await bcrypt.hash(newpass,4);
        
        const result=await User.updateOne({_id:user_id},
            {
                $set:{
                    password:newhashpass
                }
            });
        
        return res.status(200).json({message:"Account Password updated, Please login again"});
        }
        catch(err) {
            console.error(err);
            return res.status(400).send('Account Password not updated due to error');
        }    

    }


 
}

export const dashboardController = new DashboardController();
