from random import choice
import json

import torch

from .NeuralNet import NeuralNet
from .utilities import bagOfWords, tokenize, checkBagOfWords
from .weather_fetch import get_weather_geoloc


def processMessage(inputSentence, latitude, longitude):

    if(inputSentence == 'ok' or inputSentence == 'okey'):
        return None

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

    inputSentence = tokenize(inputSentence)
    X = bagOfWords(inputSentence, allWords)
    if(checkBagOfWords(X)):
        return {
            "type": "message",
            "text": "Sorry, I don't understand..."
        }
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)

    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    weatherTags = ["raining-later-that-day", "raining-this-week", "snowing-later-that-day", "snowing-this-week", "sunny-later-that-day", "sunny-this-week", "thunderstorms-later-that-day", "thunderstorms-this-week", "windy-later-that-day", "windy-this-week", "temperature-later-that-day", "temperature-this-week"]
    dailyForecastTags = ["raining-this-week", "snowing-this-week", "sunny-this-week", "thunderstorms-this-week", "windy-this-week", "temperature-this-week"]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.70:
        if tag in weatherTags:
            print(tag)
            if tag in dailyForecastTags:
                return {
                    'type': "currentWeather",
                    'data': get_weather_geoloc(latitude, longitude, False)
                }
            else:
                return {
                    'type': "currentWeather",
                    'data': get_weather_geoloc(latitude, longitude, True)
                }
        else:
            for intent in intents['intents']:
                if tag == intent['tag']:
                    return {
                        'type': "message",
                        'text': choice(intent['responses'])
                    }
    else:
        return {
            'type': "message",
            'text': "Sorry, I don't understand..."
        }