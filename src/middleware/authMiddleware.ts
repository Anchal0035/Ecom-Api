import jwt from 'jsonwebtoken';
import { createClient } from "redis";
import { Request, Response, NextFunction } from "express";
import session from "../database/models/session-model"


const client=createClient();

client.on("error",(err:Error)=>{
    console.log("redis error");
})

client.connect();

export default async function auth(req:Request,res:Response,next:NextFunction){
    const token=req.headers.authorization;
    if(!token){
        return res.status(200).json({message:"ACCESS Denied"});
    }
    try{
        console.log("--------------------AuthController started ---------------------");
        const decodedtoken:any =await jwt.verify(token,"secretkey");
        console.log("decode-----userid--",decodedtoken.id);
        console.log("decode --sessionid----",decodedtoken.session_id);
        const findSession:any = await client.get(`${decodedtoken.id}_${decodedtoken.session_id}`) || await session.findOne({id: decodedtoken.session_id});
        console.log("   ");
        console.log("findsession=====",findSession);
        if(findSession.isSessionActive===false){
            return res.status(400).send("Session out");
        }
        req.body.id = decodedtoken.id
        console.log('req.body.id====',req.body.id);
        req.body.session_id = decodedtoken.session_id
        
        console.log("--------------------AuthController closed ---------------------");
        next();
    }
    catch(err){
        res.status(200).json({message:"invalid token"})
    }
}