import { Schema, model, Document } from 'mongoose';

interface Admin extends Document {
    username: string;
    email: string;
    password: string;
    gender: string;
    image: string,
    ph_no: number
    role: string

}

export enum genderStatus {
    male = 'male',
    female = 'female',
    others = 'others'
}


const AdminSchema = new Schema<Admin>({
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
        default:"Admin"
        

    }
})
export default model<Admin>('admin', AdminSchema);