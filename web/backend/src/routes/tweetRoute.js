import express from 'express';
import { checkToken } from '../middlewares/auth.js';
import { getTweets, recordVote, getAllTweetsLabeled } from '../controllers/tweetController.js';

const router = express.Router();

router.get('/:idUser', checkToken, getTweets);
router.post('/:idTweet/vote', checkToken, recordVote);
router.get('/labeled', getAllTweetsLabeled);
export default router; 
