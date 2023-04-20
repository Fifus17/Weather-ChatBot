import torch
import torch.nn as nn

# Model of our Neural Network with 2 hidden layers

class NeuralNet(nn.Module):
    def __init__(self, inputVectorSize, hiddenVectorSize, noTags):
        super(NeuralNet, self).__init__()
        self.layer1 = nn.Linear(inputVectorSize, hiddenVectorSize)
        self.layer2 = nn.Linear(hiddenVectorSize, hiddenVectorSize)
        self.layer3 = nn.Linear(hiddenVectorSize, noTags)
        self.relu = nn.ReLU()

    def forward(self, data):
        output = self.layer1(data)
        output = self.relu(output)
        output = self.layer2(output)
        output = self.relu(output)
        output = self.layer3(output)
        return output