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
exports.adminController = void 0;
const seller_model_1 = __importDefault(require("../database/models/seller-model"));
class AdminController {
    notApprovedList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const list = yield seller_model_1.default.find({ is_Approved: false });
                return res.status(200).json(list);
            }
            catch (err) {
                return res.status(200).json({ message: "sever error" });
            }
        });
    }
    approvedList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const list = yield seller_model_1.default.find({ is_Approved: true });
                return res.status(200).json(list);
            }
            catch (err) {
                return res.status(200).json({ message: "sever error" });
            }
        });
    }
    changeApproval(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("----------changeApproval--------");
                console.log(req.body);
                const user_id = req.body.user_id;
                console.log(user_id);
                const uu = yield seller_model_1.default.findOne({ _id: user_id });
                if (uu) {
                    const approve = !uu.is_Approved;
                    console.log(approve);
                    yield seller_model_1.default.updateOne({ _id: user_id }, { $set: { is_Approved: approve } });
                    return res.status(200).json({ message: "approval updated" });
                }
                else {
                    return res.status(200).json({ message: "user does not exist" });
                }
            }
            catch (err) {
                return res.status(200).json({ message: "sever error" });
            }
        });
    }
    removeSellerAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.body.user_id;
                const remove = yield seller_model_1.default.find({ _id: user_id });
                if (remove) {
                    yield seller_model_1.default.deleteOne({ _id: user_id });
                    return res.status(200).json({ message: "user deleted" });
                }
                else {
                    return res.status(200).json({ message: "user does not exist" });
                }
            }
            catch (err) {
                return res.status(200).json({ message: "sever error" });
            }
        });
    }
}
exports.adminController = new AdminController();
