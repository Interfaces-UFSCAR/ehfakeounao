import mongoose from 'mongoose';

const userSchema = {
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    votedTweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }]
}

const User = mongoose.model('User', userSchema);
export default User;