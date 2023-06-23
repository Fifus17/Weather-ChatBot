from random import choice
import json

import torch
import nltk

from .NeuralNet import NeuralNet
from .utilities import bag_of_words, tokenize, check_bag_of_words
from .weather_fetch import get_weather_geoloc, find_cords


def process_message(input_sentence, latitude, longitude):

    if(input_sentence == 'ok' or input_sentence == 'okey'):
        return None

    # Checking for gpu
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # Reading json
    with open('chatbot/intents.json', 'r') as JSONdata:
        intents = json.load(JSONdata)

    # Training file
    FILE = "chatbot/data.pth"
    data = torch.load(FILE)

    # Neural Net parameters
    input_size = data["input_size"]
    hidden_size = data["hidden_size"]
    output_size = data["output_size"]
    all_words = data['all_words']
    tags = data['tags']
    model_state = data["model_state"]

    model = NeuralNet(input_size, hidden_size, output_size).to(device)
    model.load_state_dict(model_state)
    model.eval()

    input_sentence = tokenize(input_sentence)

    # finding if there's any City in the sentence
    pos_tags = nltk.pos_tag(input_sentence)
    ner_tags = nltk.ne_chunk(pos_tags)

    locations = []
    for tag in ner_tags:
        if hasattr(tag, 'label') and tag.label() == 'GPE':
            locations.append(' '.join(c[0] for c in tag))

    print(locations)
    # if there is then find its coordinates
    if (len(locations) > 0):
        cords = find_cords(locations)
        print(cords)
        latitude = cords[0]
        longitude = cords[1]

    X = bag_of_words(input_sentence, all_words)
    if(check_bag_of_words(X)):
        return {
            "type": "message",
            "text": "Sorry, I don't understand..."
        }
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)

    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()] 

    weather_tags = ["raining-later-that-day", "raining-this-week", "snowing-later-that-day", "snowing-this-week", "sunny-later-that-day", "sunny-this-week", "thunderstorms-later-that-day", "thunderstorms-this-week", "windy-later-that-day", "windy-this-week", "temperature-later-that-day", "temperature-this-week"]
    daily_forecast_tags = ["raining-this-week", "snowing-this-week", "sunny-this-week", "thunderstorms-this-week", "windy-this-week", "temperature-this-week"]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.70:
        if tag in weather_tags:
            if len(locations) == 0 and latitude == 0 and longitude == 0:
                return {
                    'type': "message",
                    'text': "You didn't specify the location and blocked your geolocalisation. Please specify city you want a forecast for or allow application to fetch your localisation."
                }
            print(tag)
            if tag in daily_forecast_tags:
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