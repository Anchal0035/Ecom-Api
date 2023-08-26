"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prodroute = void 0;
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controller/productController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const sellerMiddleware_1 = __importDefault(require("../middleware/sellerMiddleware"));
const buyerMiddleware_1 = __importDefault(require("../middleware/buyerMiddleware"));
exports.prodroute = express_1.default.Router();
exports.prodroute.post("/addProd", authMiddleware_1.default, sellerMiddleware_1.default, productController_1.productController.addProduct);
exports.prodroute.get("/viewAllProd", productController_1.productController.viewAllproducts);
exports.prodroute.get("/viewProdofUser", authMiddleware_1.default, sellerMiddleware_1.default, productController_1.productController.addProduct);
exports.prodroute.post("/removeProd", authMiddleware_1.default, sellerMiddleware_1.default, productController_1.productController.removeProduct);
exports.prodroute.post("/updateProd", authMiddleware_1.default, sellerMiddleware_1.default, productController_1.productController.updateProduct);
exports.prodroute.post("/adToCart", authMiddleware_1.default, buyerMiddleware_1.default, productController_1.productController.addToCart);
exports.prodroute.get("/viewCart", authMiddleware_1.default, buyerMiddleware_1.default, productController_1.productController.showCart);
