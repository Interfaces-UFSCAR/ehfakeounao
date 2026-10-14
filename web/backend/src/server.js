import express from 'express';
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import tweetRoute from './routes/tweetRoute.js';
import healthRoute from './routes/healthRoute.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const uri = process.env.MONGO_URI;

const app = express();
const PORT = 3001;

const allowedOrigins = [process.env.FRONTEND_URL, 'https://ehfakeounao.vercel.app','http://localhost:3000', 'http://localhost:3001', 'http://172.24.140.225'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/tweets', tweetRoute);
app.use('/health', healthRoute);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });