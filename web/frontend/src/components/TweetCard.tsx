import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from "lucide-react";
import { ThumbsDown } from "lucide-react"; 
import { X } from "lucide-react";
import { Input } from '@/components/ui/input';

interface TweetCardProps {
  tweet_id: string;
  text: string;
  onVote: (vote: "true" | "fake" | "irrelevant", tags: string[]) => void;
}

export const TweetCard: React.FC<TweetCardProps> = ({ tweet_id, text, onVote }) => {
  const [selected, setSelected] = useState<"true" | "fake" | "irrelevant" | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleConfirm = () => {
    if (selected) {
      onVote(selected, tags);
    }
  };

  const handleAddTag = () => {
    if (inputValue.trim() !== '') {
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-neutral-400">Tweet #{tweet_id}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 break-words">
        {text}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <div key={tag} className="relative flex items-center bg-gray-900 text-gray-400 text-sm rounded-md px-3 py-1">
                <span>{tag}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2 p-0.5 w-5 h-5"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Insira palavras-chave para este tweet" 
            />
            <Button onClick={handleAddTag}>Adicionar</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <div className="flex flex-wrap justify-between mb-4 gap-2 sm:gap-4">
          <Button
            variant="destructive"
            onClick={() => setSelected("fake")}
            className={
              `flex-1 sm:flex-none ${selected === "fake" ? "brightness-110" : "opacity-50 hover:opacity-75"}`
            }
          >
            É falso
            <ThumbsDown className="w-6 h-6 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelected("irrelevant")}
            className={
              `flex-1 sm:flex-none ${selected === "irrelevant" ? "brightness-110" : "opacity-50 hover:opacity-75"}`
            }
          >
            Irrelevante
          </Button>
          <Button
            variant="green"
            onClick={() => setSelected("true")}
            className={
              `flex-1 sm:flex-none ${selected === "true" ? "brightness-110" : "opacity-50 hover:opacity-75"}`
            }
          >
            É verdadeiro
            <ThumbsUp className="w-6 h-6 ml-2" />
          </Button>
        </div>
        {selected && (
          <Button
            variant="default"
            onClick={handleConfirm}
            className="animate-fade-in"
          >
            Enviar classificação
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};