import { Schema, model, Document, Types } from 'mongoose';
import user from './user-model';

// post schema
interface Session extends Document {
  user_id: Types.ObjectId;
  device_type: string;
  device_id: string;
  isSessionActive:boolean
  
}

const sessionSchema = new Schema<Session>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: user,
    required: true
  },
  device_type: {
    type: String,
    required: true
  },
  device_id: {
    type: String,
    required: true
  },
  isSessionActive:{
    type:Boolean,
    required:false,
  }
},
{timestamps:
     { createdAt: 'created_at'}
});


export default model<Session>('Session', sessionSchema);