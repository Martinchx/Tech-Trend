import { Schema, model } from 'mongoose';

let reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    product: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true },
}, {
    timestamps: true,
    versionKey: false
});

export default model('Review', reviewSchema); 