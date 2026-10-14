import json
import os

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

file1_path = '/home/kaka/tcc/ml/low_confidence_tweets.json'  
file2_path = '/home/kaka/tcc/ml/test.tweets.json' 

data1 = load_json(file1_path)
data2 = load_json(file2_path)

if not isinstance(data1, list) or not isinstance(data2, list):
    raise ValueError("Both files must contain a list of JSON objects.")

tweet_ids1 = {item['tweet_id'] for item in data1 if 'tweet_id' in item}
tweet_ids2 = {item['tweet_id'] for item in data2 if 'tweet_id' in item}

duplicates = tweet_ids1.intersection(tweet_ids2)

unique_data1 = [item for item in data1 if item['tweet_id'] not in duplicates]
unique_data2 = [item for item in data2 if item['tweet_id'] not in duplicates]

merged_data = unique_data1 + unique_data2

filtered_data = [{'tweet_id': item['tweet_id'], 'text': item['text']} for item in merged_data]

num_objects = len(filtered_data)

print(f"Number of objects in the merged file: {num_objects}")

output_filename = 'merged_tweets_no_duplicates.json'
with open(output_filename, 'w', encoding='utf-8') as file:
    json.dump(filtered_data, file, ensure_ascii=False, indent=4)

print(f"Merged data without duplicates saved to {output_filename}")
