import { Request, Response } from "express";
import product from "../database/models/product-model";
import category from "../database/models/category-model";
import seller from "../database/models/seller-model";
import purchased from "../database/models/purchasedproduct-model";
import cart from "../database/models/addToCart-model";

class ProductController {

    async addProduct(req: Request, res: Response) {
        try {
            const user_id = req.body.id;
            const useApproval = await seller.findOne({ _id: user_id })
            if (useApproval?.is_Approved == true) {
                const { name, details, categoryName, address_id, sellingPrice } = req.body;
                console.log("body in add prod", req.body);
                //const category_id = await this.checkcategory.bind(this)(categoryName);
                var category_id = "";
                const cResult = await category.findOne({ category_name: categoryName })
                console.log("cresult in cat", cResult);
                if (cResult) {
                    category_id = cResult._id;
                    const result = await product.create({
                        product_name: name,
                        description: details,
                        category_id: category_id,
                        address_id: address_id,
                        selling_Price: sellingPrice,
                        user_id: user_id
                    })
                    result.save();
                    console.log("add prod result", result);
                    return res.status(200).json({ result: "product added" });
                }
                else {
                    return res.status(200).json({ result: "category not exist" });
                }
            }
            else {
                return res.status(200).json({ message: "you are not approved by Admin" })
            }
        }
        catch (err) {
            return res.status(200).json({ message: "Please send proper details" })
        }
    }

    async updateProduct(req: Request, res: Response) {
        try {

            console.log("body in add prod", req.body);
            const { id, name, details, categoryName, address_id, sellingPrice } = req.body;
            const rr = await product.findOne({ _id: id });
            if (rr) {
                //const category_id = await this.checkcategory(categoryName);
                var category_id = "";
                const cResult = await category.findOne({ category_name: categoryName })
                console.log("cresult in cat", cResult);
                if (cResult) {
                    category_id = cResult._id;
                    const result = await product.create({
                        product_name: name,
                        description: details,
                        category_id: category_id,
                        address_id: address_id,
                        selling_Price: sellingPrice,

                    })
                    console.log("update prod result", result);
                    return res.status(200).json({ result: "product updated" });
                }
            }
            else {
                return res.status(200).json({ message: "product doesn't exist" });
            }
        }
        catch (err) {
            return res.status(200).json({ message: "Please send proper details" })
        }
    }


    async checkcategory(categoryName: string): Promise<string> {
        console.log("category started");
        try {
            var category_id = "";
            const cResult = await category.findOne({ category_name: categoryName })
            console.log("cresult in cat", cResult);
            if (cResult) {
                category_id = cResult._id;
                return category_id;
            }
            else {
                await category.create({ category_name: categoryName });
                const rr: any = await category.findOne({ category_name: categoryName });
                category_id = rr._id;
                return category_id;
            }
        }
        catch (err) {
            return "called but encounter error";
        }

    }

    async viewproductsofUser(req: any, res: any) {
        try {
            const user_id = req.body.id;
            const result: any = await product.findOne({ user_id: user_id });
            console.log('Product listed', result);
            return res.status(200).json({ result });
        } catch (err) {
            console.error(err);
            return res.status(200).json({ result: "no product available in in this user" });
        }
    }
    async removeProduct(req: any, res: any) {
        try {
            const { id } = req.body;
            const result: any = await product.findOne({ _id: id });
            console.log('Product listed', result);
            if (result) {
                const rr = await product.deleteOne({ _id: id });
                return res.status(200).json({ message: rr });
            }

        } catch (err) {
            console.error(err);
            return res.status(200).json({ result: "no product available " });
        }
    }

    async viewAllproducts(req: any, res: any) {
        try {
            const result: any = await product.find();
            console.log('Product listed', result);
            return res.status(200).json({ result });
        } catch (err) {
            console.error(err);
            return res.status(200).json({ result: "no product available in in this user" });
        }
    }

    async reviewProduct(req: Request, res: Response) {

    }

    async addToCart(req: Request, res: Response) {
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
    }


    async  showCart(req: Request, res: Response) {
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
    }
    async buyProduct(req: Request, res: Response) {
        const user_id = req.body.id;
        const { product_id, address_id } = req.body;
        const findProductInCart = await cart.find({ user_id: user_id });



    }
}



export const productController = new ProductController();
