import { Schema, model, Document, Types } from 'mongoose';
import address from './address-model';
import category from './category-model';

interface Product extends Document {
    product_name: string,
    description: string,
    review:string,
    category_id: Types.ObjectId,
    address_id: Types.ObjectId,
    selling_Price: number,
    user_id:Types.ObjectId
}

const ProductSchema = new Schema<Product>({
    product_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,

    },
    review:{
        type: String,
        required: false,

    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:category

    },
    address_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: address
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: address
    },
    selling_Price: {
        type: Number,
        required: true,

    },
})

export default model<Product>("products",ProductSchema);
