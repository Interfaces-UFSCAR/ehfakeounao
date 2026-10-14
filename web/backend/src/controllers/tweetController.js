import User from "../models/userModel.js";
import Tweet from "../models/tweetModel.js";

const getTweets = async (req, res) => {
    try {
        const userId = req.params.idUser;
        const page = parseInt(req.query.page) || 1;
        const tweets = await getTweetsPage(userId, page);
        res.json(tweets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar tweets." });
    }
};

const getTweetsPage = async(userId, page=1, pageSize=1000) => {
    try {
        const userVotedTweets = await User.findById(userId).select('votedTweets');
        if (!userVotedTweets) {
            return { error: "Usuário não encontrado." };
        }
        const alreadyVoted = userVotedTweets.votedTweets;
        
        const availableTweets = await Tweet.find(
            { _id: { $nin: alreadyVoted }, 
        }).limit(pageSize).skip((page - 1) * pageSize);

        return availableTweets;

    } catch (error) {
        throw new Error("Erro ao buscar tweets.");
    }
}

const recordVote = async (req, res) => {
    try {
        const userId = req.body.user_id;
        const tweetId = req.params.idTweet;
        const vote = req.body.vote;
        const tags = req.body.tags;
        const tweet = await Tweet.findOne({ tweet_id: tweetId });
        if (!tweet) {
            return res.status(404).json({ error: "Tweet não encontrado." });
        }
        tweet.votes.push({ user: userId, vote });
        if (tweet.votes.length >= 3) {
            const trueVotes = tweet.votes.filter(v => v.vote === 'true').length;
            const fakeVotes = tweet.votes.filter(v => v.vote === 'fake').length;
            const irrelevantVotes = tweet.votes.filter(v => v.vote === 'irrelevant').length;
            if (trueVotes > fakeVotes && trueVotes > irrelevantVotes) {
                tweet.label = 'true';
            } else if (fakeVotes > trueVotes && fakeVotes > irrelevantVotes) {
                tweet.label = 'fake';
            } else if (irrelevantVotes > trueVotes && irrelevantVotes > fakeVotes) {
                tweet.label = 'irrelevant';
            }
        }
        tweet.tags.push(...tags); 
        await tweet.save();
        await User.findByIdAndUpdate(userId, { $push: { votedTweets: tweet._id } });
        res.status(200).json({ message: "Voto registrado." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar voto." });
    }
};

const getAllTweetsLabeled = async (req, res) => {
    try {
        const tweets = await Tweet.find({ label: { $ne: 'unverified' } });
        res.json(tweets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar tweets." });
    }
};

export { getTweets, recordVote, getAllTweetsLabeled };




