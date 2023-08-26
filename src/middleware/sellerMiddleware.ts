import jwt from 'jsonwebtoken';
import { createClient } from "redis";
import { Request, Response, NextFunction } from "express";
import seller from '../database/models/seller-model';

const client=createClient();

client.on("error",(err:Error)=>{
    console.log("redis error");
})

export default async function sellerAuth(req:Request,res:Response,next:NextFunction) {

    const token=req.headers.authorization;//get token from header
    
    if(!token){
        return res.status(200).json({message:"ACCESS Denied"});
    }
    console.log("--------------------roleMiddleware started ---------------------");
    const decodedtoken:any =await jwt.verify(token,"secretkey");
    console.log("decode-----userid--",decodedtoken.id);
    const rr:any=await seller.findOne({_id:decodedtoken.id})
    console.log("rr==",rr)
    if(rr){
        console.log("Access as seller provided");

        next();
    }
    else{
        console.log("You dont have access");
        return res.status(200).json({message:"no Access to this page "})
    }
}