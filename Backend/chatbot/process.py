from random import choice
import json

import torch
import nltk

from .NeuralNet import NeuralNet
from .utilities import bag_of_words, tokenize, check_bag_of_words
from .weather_fetch import get_weather_geoloc, find_cords

def load_model_and_data():

    # Checking for gpu
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # Training file
    FILE = "chatbot/data.pth"
    data = torch.load(FILE)

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    data = torch.load("chatbot/data.pth")

    model = NeuralNet(data["input_size"], data["hidden_size"], data["output_size"]).to(device)
    model.load_state_dict(data["model_state"])
    model.eval()

    return model, data['all_words'], data['tags'], device

def process_message(input_sentence, latitude, longitude):

    if(input_sentence.lower() in ('ok', 'okey')):
        return None

    # Reading json
    with open('chatbot/intents.json', 'r') as JSONdata:
        intents = json.load(JSONdata)

    model, all_words, tags, device = load_model_and_data()

    input_sentence = tokenize(input_sentence)

    # finding if there's any City in the sentence
    pos_tags = nltk.pos_tag(input_sentence)
    ner_tags = nltk.ne_chunk(pos_tags)

    locations = [' '.join(c[0] for c in tag) for tag in ner_tags if hasattr(tag, 'label') and tag.label() == 'GPE']

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