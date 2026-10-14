import json
import os

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

directory = 'low_confidence_tweets'  
files = [os.path.join(directory, f) for f in os.listdir(directory) if f.endswith('.json')]

merged_data = []
for file in files:
    data = load_json(file)
    if isinstance(data, list):  # Check if the data is a list
        merged_data.extend(data)

output_filename = 'merged_file.json'
with open(output_filename, 'w', encoding='utf-8') as file:
    json.dump(merged_data, file, ensure_ascii=False, indent=4)

print(f"Merged data saved to {output_filename}")
