db.users.updateOne(
  { email: "teste@example.com" },
  {
    $setOnInsert: {
      fullName: "Usuário Teste",
      password: "$2a$10$k6YksC38MMrJ33lScgRE1utCeEKBN58ncwigmWOiEsi.4bGCtLS6W",
      verified: true,
      votedTweets: []
    }
  },
  { upsert: true }
);

for (let i = 1; i <= 10; i++) {
  db.tweets.updateOne(
    { tweet_id: String(i) },
    { $setOnInsert: { text: `Tweet de exemplo ${i} sobre as eleições de 2022.`, label: "unverified", votes: [], tags: [] } },
    { upsert: true }
  );
}

print(`Usuários: ${db.users.countDocuments()} | Tweets: ${db.tweets.countDocuments()}`);
print("Login: teste@example.com / teste123");
