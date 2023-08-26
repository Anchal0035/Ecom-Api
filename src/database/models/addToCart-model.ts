
import { Schema, model, Document, Types } from 'mongoose';
import product from './product-model';
import User from './user-model';


interface Cart extends Document {
    product_id: Types.ObjectId,
    user_id: Types.ObjectId,
    cost: number,
totalCost:number,
    quantity: number
}

const CartSchema = new Schema<Cart>({
    product_id: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: product
    },
    user_id: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: User
    },
    cost: {
        required: true,
        type: Number

    },
    totalCost:{
        type: Number,
        required: true,
    
    },
    quantity: {
        type: Number,
        default: 1
    }
})
export default model<Cart>("Cart", CartSchema);