import numpy as np
import json
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import time

from utilities import tokenize, stem, bag_of_words
from NeuralNet import NeuralNet

# Reading intents from json and saving them in variable intents
with open('Backend/chatbot/intents.json', 'r') as file:
    intents = json.load(file)

# Creating arrays for holding data from preprocessing
all_words = []
tags = []
xy = []
ignored_characters = ['?', "!", '.', ',', '-', ';']

# Reading all training data in intents.json and adding words to allWords array

for intent in intents['intents']:
    # Adding tags
    if intent['tag'] not in tags:
        tags.append(intent['tag'])
    
    # Adding stemmed words
    for sentence in intent['patterns']:
        individual_words = [stem(word) for word in tokenize(sentence) if word not in ignored_characters] # array
        for word in individual_words:
            # if word not already in allWords array, append it
            if word not in all_words:
                all_words.append(word)

        # Adding tuples of tags and corresponding words
        xy.append((intent['tag'], individual_words))

# sorting?

# Creating arrays for holding training data
x_train = []
y_train = []


# Creating data for training
for (tag, sentence_words) in xy:
    x_train.append(bag_of_words(sentence_words, all_words))
    y_train.append(tags.index(tag))

# Changing arrays into numpy arrays
x_train = np.array(x_train)
y_train = np.array(y_train)

# TRAINING

# Parameters
no_epochs = 250000
batch_size = 50
learning_rate = 0.001
input_size = len(x_train[0])
hidden_size = 8
output_size = len(tags)

class ChatDataset(Dataset):

    def __init__(self):
        self.n_samples = len(x_train)
        self.x_data = x_train
        self.y_data = y_train

    # support indexing such that dataset[i] can be used to get i-th sample
    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    # we can call len(dataset) to return the size
    def __len__(self):
        return self.n_samples

dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset,
                          batch_size=batch_size,
                          shuffle=True,
                          num_workers=0)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model = NeuralNet(input_size, hidden_size, output_size).to(device)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

start = time.time()

# Train the model
for epoch in range(no_epochs):
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
        print (f'Epoch [{epoch+1}/{no_epochs}], Loss: {loss.item():.4f}, Current time: {time.time() - start}, Estimated time: {(no_epochs - epoch) * ((time.time() - start) / epoch)}')

end = time.time()
print(f'Final loss: {loss.item():.4f}')
print(f'Total time: {end - start}')

data = {
"model_state": model.state_dict(),
"input_size": input_size,
"hidden_size": hidden_size,
"output_size": output_size,
"all_words": all_words,
"tags": tags
}

FILE = "Backend/chatbot/data.pth"
torch.save(data, FILE)

print(f'Training complete. File saved to {FILE}')