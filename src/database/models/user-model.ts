import { Schema, model, Document } from 'mongoose';

interface User extends Document {
    username: string;
    email: string;
    password: string;
    gender: string;
    image: string,
    ph_no: string
    role: string

}

export enum genderStatus {
    male = 'male',
    female = 'female',
    others = 'others'
}


const UserSchema = new Schema<User>({
    username: {
        required: true,
        type: String,
        unique: true
    },
    email: {
        required: false,
        type: String,
        unique: true
    },
    password: {
        required: false,
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
        type: String
    },
    role: {
        
        type: String,
        default:"Buyer"
        

    }
})
export default model<User>('Users', UserSchema);