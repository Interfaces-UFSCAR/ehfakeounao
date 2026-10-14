import mongoose from "mongoose";

const tweetSchema = {
    tweet_id : {
        type: String,
        required: true,
        unique: true
    },
    text : {
        type: String,
        required: true
    },
    label : {
        type: String,
        enum: ['true', 'fake', 'unverified', 'irrelevant'],
        default: 'unverified'
    },
    votes: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            vote: { type: String, enum: ['true', 'fake', 'irrelevant'], required: true }
        }
    ],
    tags: [
        {
            type: String
        }
    ]
}

const Tweet = mongoose.model('Tweet', tweetSchema);
export default Tweet;