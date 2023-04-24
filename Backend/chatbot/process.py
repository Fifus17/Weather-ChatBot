from random import choice
import json

import torch
import nltk

from .NeuralNet import NeuralNet
from .utilities import bagOfWords, tokenize, checkBagOfWords
from .weather_fetch import get_weather_geoloc, find_cords


def processMessage(inputSentence, latitude, longitude):

    # if(inputSentence == 'ok' or inputSentence == 'okey'):
    #     return None

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

    # finding if there's any City in the sentence
    posTags = nltk.pos_tag(inputSentence)
    nerTags = nltk.ne_chunk(posTags)

    locations = []
    for tag in nerTags:
        if hasattr(tag, 'label') and tag.label() == 'GPE':
            locations.append(' '.join(c[0] for c in tag))

    print(locations)
    # if there is then find its coordinates
    if (len(locations) > 0):
        cords = find_cords(locations[0])
        latitude = cords[0]
        longitude = cords[0]

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
            if len(locations) == 0 and latitude == 0 and longitude == 0:
                return {
                    'type': "message",
                    'text': "You didn't specify the location and blocked your geolocalisation. Please specify city you want a forecast for or allow application to fetch your localisation."
                }
            print(tag)
            if tag in dailyForecastTags:
                return {
                    'type': "currentWeather",
                    'data': get_weather_geoloc(latitude, longitude, False, tag)
                }
            else:
                return {
                    'type': "currentWeather",
                    'data': get_weather_geoloc(latitude, longitude, True, tag)
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