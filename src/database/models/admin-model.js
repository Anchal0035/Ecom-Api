"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genderStatus = void 0;
const mongoose_1 = require("mongoose");
var genderStatus;
(function (genderStatus) {
    genderStatus["male"] = "male";
    genderStatus["female"] = "female";
    genderStatus["others"] = "others";
})(genderStatus || (exports.genderStatus = genderStatus = {}));
const AdminSchema = new mongoose_1.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String,
        unique: true
    },
    gender: {
        required: false,
        enum: genderStatus,
        type: String
    },
    image: {
        required: false,
        type: String
    },
    ph_no: {
        required: false,
        type: Number
    },
    role: {
        type: String,
        default: "Admin"
    }
});
exports.default = (0, mongoose_1.model)('admin', AdminSchema);
