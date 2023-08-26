"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const address_model_1 = __importDefault(require("./address-model"));
const category_model_1 = __importDefault(require("./category-model"));
const ProductSchema = new mongoose_1.Schema({
    product_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: false,
    },
    category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: category_model_1.default
    },
    address_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: address_model_1.default
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: address_model_1.default
    },
    selling_Price: {
        type: Number,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("products", ProductSchema);
