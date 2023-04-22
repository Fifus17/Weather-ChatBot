import numpy as np
import json
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import time

from utilities import tokenize, stem, bagOfWords
from NeuralNet import NeuralNet

# Reading intents from json and saving them in variable intents
with open('Backend/chatbot/intents.json', 'r') as file:
    intents = json.load(file)

# Creating arrays for holding data from preprocessing
allWords = []
tags = []
xy = []
ignoredCharacters = ['?', "!", '.', ',', '-', ';']

# Reading all training data in intents.json and adding words to allWords array

for intent in intents['intents']:
    # Adding tags
    if intent['tag'] not in tags:
        tags.append(intent['tag'])
    
    # Adding stemmed words
    for sentence in intent['patterns']:
        individualWords = [stem(word) for word in tokenize(sentence) if word not in ignoredCharacters] # array
        for word in individualWords:
            # if word not already in allWords array, append it
            if word not in allWords: 
                allWords.append(word)

        # Adding tuples of tags and corresponding words
        xy.append((intent['tag'], individualWords))

# sorting?

# Creating arrays for holding training data
xTrain = []
yTrain = []


# Creating data for training
for (tag, sentenceWords) in xy:
    xTrain.append(bagOfWords(sentenceWords, allWords))
    yTrain.append(tags.index(tag))

# Changing arrays into numpy arrays
xTrain = np.array(xTrain)
yTrain = np.array(yTrain)

# TRAINING

# Parameters
noEpochs = 250000
batchSize = 50
learningRate = 0.001
inputSize = len(xTrain[0])
hiddenSize = 8
outputSize = len(tags)

class ChatDataset(Dataset):

    def __init__(self):
        self.n_samples = len(xTrain)
        self.x_data = xTrain
        self.y_data = yTrain

    # support indexing such that dataset[i] can be used to get i-th sample
    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    # we can call len(dataset) to return the size
    def __len__(self):
        return self.n_samples

dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset,
                          batch_size=batchSize,
                          shuffle=True,
                          num_workers=0)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model = NeuralNet(inputSize, hiddenSize, outputSize).to(device)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learningRate)

start = time.time()

# Train the model
for epoch in range(noEpochs):
    for (words, labels) in train_loader:
        words = words.to(device)
        labels = labels.to(dtype=torch.long).to(device)
        
        # Forward pass
        outputs = model(words)
        # if y would be one-hot, we must apply
        # labels = torch.max(labels, 1)[1]
        loss = criterion(outputs, labels)
        
        # Backward and optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
    if (epoch+1) % 100 == 0:
        print (f'Epoch [{epoch+1}/{noEpochs}], Loss: {loss.item():.4f}, Current time: {time.time()-start}, Estimated time: {(noEpochs-epoch)*((time.time()-start)/epoch)}')

end = time.time()
print(f'Final loss: {loss.item():.4f}')
print(f'Total time: {end - start}')

data = {
"model_state": model.state_dict(),
"input_size": inputSize,
"hidden_size": hiddenSize,
"output_size": outputSize,
"all_words": allWords,
"tags": tags
}

FILE = "Backend/chatbot/data.pth"
torch.save(data, FILE)

print(f'Training complete. File saved to {FILE}')