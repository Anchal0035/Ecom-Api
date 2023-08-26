"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    category_name: {
        type: String,
        required: true
    },
});
exports.default = (0, mongoose_1.model)('category', CategorySchema);
