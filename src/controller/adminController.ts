import { Request, Response } from "express";
import seller from "../database/models/seller-model";

class AdminController {
    async notApprovedList(req: Request, res: Response) {
        try {
            const list = await seller.find({ is_Approved: false });
            return res.status(200).json(list);

        }
        catch (err) {
            return res.status(200).json({ message: "sever error" });
        }
    }
    async approvedList(req: Request, res: Response) {
        try {
            const list = await seller.find({ is_Approved: true });
            return res.status(200).json(list);

        }
        catch (err) {
            return res.status(200).json({ message: "sever error" });
        }
    }

    async changeApproval(req: Request, res: Response) {
        try {
            console.log("----------changeApproval--------")
            console.log(req.body);
            
            const user_id = req.body.user_id;
            console.log(user_id);
            const uu: any = await seller.findOne({ _id: user_id });
            if (uu) {
                const approve = !uu.is_Approved;
                console.log(approve);
                await seller.updateOne({ _id: user_id }, { $set: { is_Approved: approve } });
                return res.status(200).json({ message: "approval updated" });
            }
            else{
                return res.status(200).json({ message: "user does not exist" });
            }
        }
        catch (err) {
            return res.status(200).json({ message: "sever error" });
        }
    }
    async removeSellerAccount(req: Request, res: Response) {
        try {
            const user_id = req.body.user_id;
            const remove = await seller.find({_id: user_id });
            if(remove){
                await seller.deleteOne({_id:user_id});
                return res.status(200).json({message:"user deleted"});
            }
            else{
                return res.status(200).json({ message: "user does not exist" });
            }

        }
        catch (err) {
            return res.status(200).json({ message: "sever error" });
        }
    }

}

export const adminController=new AdminController();