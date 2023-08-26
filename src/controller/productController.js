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
exports.productController = void 0;
const product_model_1 = __importDefault(require("../database/models/product-model"));
const category_model_1 = __importDefault(require("../database/models/category-model"));
const seller_model_1 = __importDefault(require("../database/models/seller-model"));
const addToCart_model_1 = __importDefault(require("../database/models/addToCart-model"));
class ProductController {
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.body.id;
                const useApproval = yield seller_model_1.default.findOne({ _id: user_id });
                if ((useApproval === null || useApproval === void 0 ? void 0 : useApproval.is_Approved) == true) {
                    const { name, details, categoryName, address_id, sellingPrice } = req.body;
                    console.log("body in add prod", req.body);
                    //const category_id = await this.checkcategory.bind(this)(categoryName);
                    var category_id = "";
                    const cResult = yield category_model_1.default.findOne({ category_name: categoryName });
                    console.log("cresult in cat", cResult);
                    if (cResult) {
                        category_id = cResult._id;
                        const result = yield product_model_1.default.create({
                            product_name: name,
                            description: details,
                            category_id: category_id,
                            address_id: address_id,
                            selling_Price: sellingPrice,
                            user_id: user_id
                        });
                        result.save();
                        console.log("add prod result", result);
                        return res.status(200).json({ result: "product added" });
                    }
                    else {
                        return res.status(200).json({ result: "category not exist" });
                    }
                }
                else {
                    return res.status(200).json({ message: "you are not approved by Admin" });
                }
            }
            catch (err) {
                return res.status(200).json({ message: "Please send proper details" });
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("body in add prod", req.body);
                const { id, name, details, categoryName, address_id, sellingPrice } = req.body;
                const rr = yield product_model_1.default.findOne({ _id: id });
                if (rr) {
                    //const category_id = await this.checkcategory(categoryName);
                    var category_id = "";
                    const cResult = yield category_model_1.default.findOne({ category_name: categoryName });
                    console.log("cresult in cat", cResult);
                    if (cResult) {
                        category_id = cResult._id;
                        const result = yield product_model_1.default.create({
                            product_name: name,
                            description: details,
                            category_id: category_id,
                            address_id: address_id,
                            selling_Price: sellingPrice,
                        });
                        console.log("update prod result", result);
                        return res.status(200).json({ result: "product updated" });
                    }
                }
                else {
                    return res.status(200).json({ message: "product doesn't exist" });
                }
            }
            catch (err) {
                return res.status(200).json({ message: "Please send proper details" });
            }
        });
    }
    checkcategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("category started");
            try {
                var category_id = "";
                const cResult = yield category_model_1.default.findOne({ category_name: categoryName });
                console.log("cresult in cat", cResult);
                if (cResult) {
                    category_id = cResult._id;
                    return category_id;
                }
                else {
                    yield category_model_1.default.create({ category_name: categoryName });
                    const rr = yield category_model_1.default.findOne({ category_name: categoryName });
                    category_id = rr._id;
                    return category_id;
                }
            }
            catch (err) {
                return "called but encounter error";
            }
        });
    }
    viewproductsofUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.body.id;
                const result = yield product_model_1.default.findOne({ user_id: user_id });
                console.log('Product listed', result);
                return res.status(200).json({ result });
            }
            catch (err) {
                console.error(err);
                return res.status(200).json({ result: "no product available in in this user" });
            }
        });
    }
    removeProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const result = yield product_model_1.default.findOne({ _id: id });
                console.log('Product listed', result);
                if (result) {
                    const rr = yield product_model_1.default.deleteOne({ _id: id });
                    return res.status(200).json({ message: rr });
                }
            }
            catch (err) {
                console.error(err);
                return res.status(200).json({ result: "no product available " });
            }
        });
    }
    viewAllproducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield product_model_1.default.find();
                console.log('Product listed', result);
                return res.status(200).json({ result });
            }
            catch (err) {
                console.error(err);
                return res.status(200).json({ result: "no product available in in this user" });
            }
        });
    }
    reviewProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //     console.log("--------add to cart started -------------")
            //     const user_id = req.body.id;
            //     const { product_id } = req.body;
            //     console.log("--------user_id,product_id -------------", user_id, product_id);
            //     const findProduct = await product.findOne({ _id: product_id });         
            //     if (findProduct) {
            //         const findStatus = await cart.findOne({ product_id: product_id, user_id: user_id });               
            //         if (findStatus) {
            //             const updates = await cart.updateOne(
            //                 {
            //                     product_id: product_id,
            //                     user_id: user_id,
            //                 },
            //                 {
            //                     $set: {
            //                         quantity: findStatus.quantity + 1,
            //                         totalCost: findStatus.cost*(findStatus.quantity+1)
            //                     }
            //                 })
            //         }
            //         else {
            //             const Createcart = await cart.create({ product_id: product_id, user_id: user_id, totalCost: findProduct.selling_Price ,cost:findProduct.selling_Price});
            //         }
            //         return res.status(200).json({ message: "Added to cart" });
            //     }
            // }
            try {
                // console.log("--------showcart -------------");
                // const user_id = req.body.id;
                // console.log("--------user_id -------------", user_id);
                // const findCartList = await cart.find({ user_id: user_id });
                // console.log("--------findcart -------------", findCartList);
                return res.status(200).json("findCartList");
            }
            catch (err) {
                return res.status(200).json({ message: "Something went wrong" });
            }
        });
    }
    showCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("--------showcart -------------");
                // const user_id = req.body.id;
                // console.log("--------user_id -------------", user_id);
                // const findCartList = await cart.findOne({ user_id: user_id });
                // console.log("--------findcart -------------", findCartList);
                return res.status(200).send("hello");
            }
            catch (err) {
                return res.status(200).json({ message: "Not product in cart" });
            }
        });
    }
    buyProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.body.id;
            const { product_id, address_id } = req.body;
            const findProductInCart = yield addToCart_model_1.default.find({ user_id: user_id });
        });
    }
}
exports.productController = new ProductController();
