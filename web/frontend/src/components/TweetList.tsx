import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { TweetCard } from "./TweetCard";
import { ProgressBar } from "./ProgressBar";

const api = process.env.NEXT_PUBLIC_API_URL;
interface Tweet {
  tweet_id: string;
  text: string;
}

export const TweetList: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    if (!token || !userId) {
      router.push('/');
      return;
    }

    const fetchTweets = async () => {
      try {
        setProgress(33);
        const response = await fetch(`${api}/tweets/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tweets");
        }
        const data: Tweet[] = await response.json();
        setTweets(data);
        setProgress(100);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [router]);

  const handleVote = async (tweetId: string, vote: "true" | "fake" | "irrelevant", tags: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      if (!token || !userId) {
        throw new Error("No token or user ID found");
      }
      const response = await fetch(`${api}/tweets/${tweetId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tweet_id: tweetId,
          user_id: userId,
          vote: vote,
          tags: tags
        })
      });
      if (!response.ok) {
        throw new Error("Failed to vote");
      }
      setTweets(tweets.filter(tweet => tweet.tweet_id !== tweetId));
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <ProgressBar progress={progress} />
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,28rem),1fr))] gap-6 mt-8">
      {tweets.map((tweet) => (
        <TweetCard
          key={tweet.tweet_id}
          tweet_id={tweet.tweet_id}
          text={tweet.text}
          onVote={(vote, tags) => handleVote(tweet.tweet_id, vote, tags)}
        />
      ))}
    </div>
  );
};
