import os
import json

# Read all files from games folder
games = {"misc": []}

for filename in os.listdir("games"):
    #  create dict based on starting letter if it starts from A to Z
    if filename[0].isalpha():
        letter = filename[0].upper()
        if letter not in games:
            games[letter] = []
        games[letter].append(filename.strip())
    else:
        games["misc"].append(filename)

# Write the json file
with open("games.json", "w") as f:
    json.dump(games, f, indent=4)
