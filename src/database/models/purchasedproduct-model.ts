
import { Schema, model, Document, Types } from 'mongoose';
import product from './product-model';
import User from './user-model';
import address from './address-model';

interface Purchased extends Document {
    product_id: Types.ObjectId,
    user_id: Types.ObjectId,
    status: boolean,
    cost: number,
    address_id: Types.ObjectId
    quantity: number
    delivered:boolean
}

const PurchasedSchema = new Schema<Purchased>({
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
    status: {
        required: true,
        type: Boolean

    },
    cost: {
        required: true,
        type: Number

    },
    address_id: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: address

    },
    quantity: {
        type: Number,
        default: 1
    },
    delivered:{
        
        type: Boolean,
        default:false

    }
})
export default model<Purchased>("purchased", PurchasedSchema);