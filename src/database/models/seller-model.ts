import { Schema, model, Document, Types } from 'mongoose';
import user from './user-model';


interface seller extends Document {
    username: string;
    email: string;
    password: string;
    gender: string;
    image: string,
    ph_no: number
    role: string
    is_Approved:boolean

}

export enum genderStatus {
    male = 'male',
    female = 'female',
    others = 'others'
}

const SellerSchema = new Schema<seller>({
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
        default:"Seller"
    },
    is_Approved:{
        type:Boolean,
        default:false
    }
})
export default model<seller>('seller', SellerSchema);