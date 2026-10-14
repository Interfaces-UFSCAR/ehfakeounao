import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Tweet from '../models/tweetModel.js';

dotenv.config();

const PASSWORD = 'teste123';

const users = [
    { fullName: 'Usuário Teste', email: 'teste@example.com' },
    { fullName: 'Lorem Ipsum', email: 'lorem@example.com' },
    { fullName: 'Dolor Sit', email: 'dolor@example.com' },
    { fullName: 'Amet Consectetur', email: 'amet@example.com' }
];

const sentences = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
    'Curabitur pretium tincidunt lacus, nulla gravida orci a odio.',
    'Nullam varius, turpis et commodo pharetra, est eros bibendum elit.',
    'Pellentesque habitant morbi tristique senectus et netus et malesuada fames.',
    'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.',
    'Maecenas faucibus mollis interdum, cras mattis consectetur purus.'
];

const tagPool = ['saúde', 'política', 'economia', 'vacina', 'eleições', 'lorem', 'ipsum'];

const UNVERIFIED_TWEETS = 30;
const labeledVotes = [
    ['true', 'true', 'true'],
    ['true', 'true', 'fake'],
    ['fake', 'fake', 'fake'],
    ['fake', 'fake', 'true'],
    ['irrelevant', 'irrelevant', 'irrelevant'],
    ['irrelevant', 'irrelevant', 'fake']
];

const tweetId = (n) => String(1850000000000000000n + BigInt(n));
const tweetText = (n) => `${sentences[n % sentences.length]} ${sentences[(n * 3 + 1) % sentences.length]}`;

const majority = (votes) => {
    const count = (label) => votes.filter(v => v === label).length;
    return ['true', 'fake', 'irrelevant'].sort((a, b) => count(b) - count(a))[0];
};

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash(PASSWORD, 10);
    const savedUsers = [];
    for (const user of users) {
        savedUsers.push(await User.findOneAndUpdate(
            { email: user.email },
            { $setOnInsert: { ...user, password: hashedPassword, verified: true } },
            { upsert: true, new: true }
        ));
    }
    const voters = savedUsers.slice(1);

    for (let n = 0; n < UNVERIFIED_TWEETS; n++) {
        await Tweet.updateOne(
            { tweet_id: tweetId(n) },
            { $setOnInsert: { text: tweetText(n), label: 'unverified', votes: [], tags: [] } },
            { upsert: true }
        );
    }

    for (let i = 0; i < labeledVotes.length; i++) {
        const n = UNVERIFIED_TWEETS + i;
        const result = await Tweet.updateOne(
            { tweet_id: tweetId(n) },
            {
                $setOnInsert: {
                    text: tweetText(n),
                    label: majority(labeledVotes[i]),
                    votes: labeledVotes[i].map((vote, v) => ({ user: voters[v]._id, vote })),
                    tags: [tagPool[i % tagPool.length], tagPool[(i + 3) % tagPool.length]]
                }
            },
            { upsert: true }
        );
        if (result.upsertedId) {
            await User.updateMany(
                { _id: { $in: voters.map(u => u._id) } },
                { $push: { votedTweets: result.upsertedId } }
            );
        }
    }

    console.log(`Users: ${await User.countDocuments()} | Tweets: ${await Tweet.countDocuments()}`);
    console.log(`Login: ${users[0].email} / ${PASSWORD}`);
    await mongoose.disconnect();
};

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});
