"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_model_1 = __importDefault(require("./user-model"));
const sessionSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.default,
        required: true
    },
    device_type: {
        type: String,
        required: true
    },
    device_id: {
        type: String,
        required: true
    },
    isSessionActive: {
        type: Boolean,
        required: false,
    }
}, { timestamps: { createdAt: 'created_at' }
});
exports.default = (0, mongoose_1.model)('Session', sessionSchema);
