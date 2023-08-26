"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Addressschema = new mongoose_1.Schema({
    House_No: {
        type: String,
        required: false,
    },
    Street: {
        type: String,
        required: false,
    },
    State: {
        type: String,
        required: true,
    },
    City: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
        required: false,
    },
    user_id: {
        type: String,
        required: true
    },
});
exports.default = (0, mongoose_1.model)('address', Addressschema);
