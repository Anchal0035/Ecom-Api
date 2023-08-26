import {Schema ,model, Document,Types} from 'mongoose';

interface Address extends Document{
    House_No:string,
    Street:string,
    State:string,
    City:string,
    landmark:string,
    user_id:string,
}

const Addressschema=new Schema<Address>({
    House_No:{
        type:String,
        required:false,
    },
    Street:{
        type:String,
        required:false,

    },
    State:{
        type:String,
        required:true,

    },
    City:{
        type:String,
        required:true,

    },
    landmark:{
        type:String,
        required:false,

    },
    user_id:{
        type:String,   
        required:true
    },


})
export default  model<Address>('address',Addressschema);