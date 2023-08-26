import express from "express";
import { productController } from "../controller/productController";
import auth from "../middleware/authMiddleware"
import sellerAuth from "../middleware/sellerMiddleware"
import buyerAuth from "../middleware/buyerMiddleware"
export const prodroute=express.Router();


prodroute.post("/addProd",auth,sellerAuth,productController.addProduct);
prodroute.get("/viewAllProd",productController.viewAllproducts);
prodroute.get("/viewProdofUser",auth,sellerAuth,productController.addProduct);
prodroute.post("/removeProd",auth,sellerAuth,productController.removeProduct);
prodroute.post("/updateProd",auth,sellerAuth,productController.updateProduct);
prodroute.post("/adToCart",auth,buyerAuth,productController.addToCart);
prodroute.get("/viewCart",auth,buyerAuth,productController.showCart);