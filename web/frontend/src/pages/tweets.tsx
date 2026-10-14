import { Header } from '@/components/Header';
import { LearnMore } from '@/components/LearnMore';
import React from "react";
import { TweetList } from "@/components/TweetList";

export default function Tweets() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-20 sm:p-8 md:p-12 font-[family-name:var(--font-geist-sans)]">
      <Header 
        title="#ÉFakeOuNão?"
        description="Vote para classificar se o tweet é fake ou true news." 
        showMenu={true}
        /> 
      <LearnMore />
      <TweetList />
    </div>
  );
}