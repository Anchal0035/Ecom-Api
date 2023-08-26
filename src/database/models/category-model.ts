import { Schema, model, Document, Types } from 'mongoose';

interface category extends Document {
    category_name: string
}

const CategorySchema = new Schema<category>({
    category_name: {
        type: String,
        required: true
    },
  
})
export default model<category>('category',CategorySchema);