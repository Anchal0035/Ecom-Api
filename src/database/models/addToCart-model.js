"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const product_model_1 = __importDefault(require("./product-model"));
const user_model_1 = __importDefault(require("./user-model"));
const CartSchema = new mongoose_1.Schema({
    product_id: {
        required: true,
        type: mongoose_1.Schema.Types.ObjectId,
        ref: product_model_1.default
    },
    user_id: {
        required: true,
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.default
    },
    cost: {
        required: true,
        type: Number
    },
    totalCost: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1
    }
});
exports.default = (0, mongoose_1.model)("Cart", CartSchema);
