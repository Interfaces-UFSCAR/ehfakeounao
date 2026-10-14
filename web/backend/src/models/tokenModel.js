import mongoose from 'mongoose';

const tokenSchema = {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}

const Token = mongoose.model('Token', tokenSchema);
export default Token;
