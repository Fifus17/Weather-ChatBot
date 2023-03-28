from random import choice
import json

import torch

from NeuralNet import NeuralNet
from utilities import bagOfWords, tokenize

# Checking for gpu
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Reading json
with open('ChatBot/intents.json', 'r') as JSONdata:
    intents = json.load(JSONdata)

# Training file
FILE = "ChatBot/data.pth"
data = torch.load(FILE)

# Neural Net parameters
inputSize = data["input_size"]
hiddenSize = data["hidden_size"]
outputSize = data["output_size"]
allWords = data['all_words']
tags = data['tags']
modelState = data["model_state"]

model = NeuralNet(inputSize, hiddenSize, outputSize).to(device)
model.load_state_dict(modelState)
model.eval()

print("Starting new conversation...")

while True:

    # User input
    inputSentence = input(">>> ")

    # Exit command
    if inputSentence == "exit":
        break

    inputSentence = tokenize(inputSentence)
    X = bagOfWords(inputSentence, allWords)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)

    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.5:
        if tag == "weather":
            # TODO
            print("TODO weather")
        else:
            for intent in intents['intents']:
                if tag == intent['tag']:
                    print(f"BOT: {choice(intent['responses'])}")
    else:
        print("BOT: Sorry, I don't understand...")