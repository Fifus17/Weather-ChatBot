"""set of functions needed to fetch the weather from API"""
import datetime
import math
import time

import requests
from .config import api_key
import json
from geopy.geocoders import Nominatim
api_key = api_key

geolocator = Nominatim(user_agent="weather_chatbot") # for getting geolocation form the address

base_url_geo = "http://api.openweathermap.org/geo/1.0/direct?"
base_url_onecall = "https://api.openweathermap.org/data/2.5/onecall?"

# util function for getting coordinates of the address
def find_cords(address):
    location = geolocator.geocode(address[0])
    return [location.latitude, location.longitude]

# util function for converting units
def kelvin_to_celcius(temp):
    return temp-273.15

# function to get longitude and latitude based on name of the city
def get_location_from_city(city_name):
        complete_url = base_url_geo+"&q="+city_name+"&limit=1"+"&appid="+api_key
        response = requests.get(complete_url).json()
        if response:
            return response[0]["lat"], response[0]["lon"]
        return None

# util function to get unixTime
def get_unixTime(year, month, day):

    data = datetime.datetime(year, month, day, 12)
    unixtime = int(data.timestamp())
    return unixtime

rainIDs = [200, 201, 202, 230, 231, 232, 300, 301, 302, 310, 311, 312, 313, 314, 321, 500, 501, 502, 503, 504, 511, 520, 521, 522, 531, 615, 616]
snowIDs = [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622]
sunnyIDs = [800, 801, 802]
thunderstormsIDs = [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]

def printDays(days):
    
    pass

def returnMessage(response, tag):
    if tag == "raining-later-that-day":
        rain = False
        weather = 0
        for hourlyWeather in response['hourly']:
            if hourlyWeather['weather'][0]['id'] in rainIDs:
                rain = True
                weather = hourlyWeather
                break
        if rain:
            return f'There propably will be {weather["weather"][0]["description"]} starting around {datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour)}:{datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute)}.'
        return "It shouldn't rain in the next 24 hours"
    elif tag == "raining-this-week":
        rain = False
        days = []
        for index, dailyWeather in enumerate(response['daily']):
            if dailyWeather['weather'][0]['id'] in rainIDs and index > 0:
                rain = True
                days.append("tomorrow" if index == 1 else datetime.datetime.fromtimestamp(dailyWeather['dt']).strftime("%A"))
        if rain:
            return f'In the next week, it should rain {days[0] + " and " if days[0] == "tomorrow" else ""} on {", ".join(days) if days[0] != "tomorrow" else ", ".join(days[1:-1])}{ " and " + days[-1] if days[-1] != "tomorrow" else ""}.'
        return "Luckily, it shouldn't rain this week"
    elif tag == "snowing-later-that-day":
        snow = False
        weather = 0
        for hourlyWeather in response['hourly']:
            if hourlyWeather['weather'][0]['id'] in snowIDs:
                snow = True
                weather = hourlyWeather
                break
        if snow:
            return f'There propably will be {weather["weather"][0]["description"]} starting around {datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour)}:{datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute)}.'
        return "It shouldn't snow in the next 24 hours."
    elif tag == "snowing-this-week":
        snow = False
        days = []
        for index, dailyWeather in enumerate(response['daily']):
            if dailyWeather['weather'][0]['id'] in snowIDs and index > 0:
                snow = True
                days.append("tomorrow" if index == 1 else datetime.datetime.fromtimestamp(dailyWeather['dt']).strftime("%A"))
        if snow:
            return f'In the next week, it should snow {days[0] + " and " if days[0] == "tomorrow" else ""} on {", ".join(days) if days[0] != "tomorrow" else ", ".join(days[1:-1])}{ " and " + days[-1] if days[-1] != "tomorrow" else ""}.'
        return "It shouldn't snow this week."
    elif tag == "sunny-later-that-day":
        sunny = False
        weather = 0
        for hourlyWeather in response['hourly']:
            if hourlyWeather['weather'][0]['id'] in sunnyIDs:
                sunny = True
                weather = hourlyWeather
                break
        if sunny:
            return f'There propably will be {weather["weather"][0]["description"]} starting around {datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour)}:{datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute)} so we will see some sun!.'
        return "We won't see much sun in the next 24 hours."
    elif tag == "sunny-this-week":
        sunny = False
        days = []
        for index, dailyWeather in enumerate(response['daily']):
            if dailyWeather['weather'][0]['id'] in sunnyIDs and index > 0:
                sunny = True
                days.append("tomorrow" if index == 1 else datetime.datetime.fromtimestamp(dailyWeather['dt']).strftime("%A"))
        if sunny:
            return f'In the next week, it should be sunny {days[0] + " and " if days[0] == "tomorrow" else ""} on {", ".join(days) if days[0] != "tomorrow" else ", ".join(days[1:-1])}{ " and " + days[-1] if days[-1] != "tomorrow" else ""}.'
        return "Unluckily, we won't see much sun in the upcoming week"
    elif tag == "thunderstorms-later-that-day":
        storm = False
        weather = 0
        for hourlyWeather in response['hourly']:
            if hourlyWeather['weather'][0]['id'] in thunderstormsIDs:
                storm = True
                weather = hourlyWeather
                break
        if storm:
            return f'There propably will be {weather["weather"][0]["description"]} starting around {datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour)}:{datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute)}. Be careful!'
        return "We shouldn't see any lightnings on the sky in the next 24 hours."
    elif tag == "thunderstorms-this-week":
        storm = False
        days = []
        for index, dailyWeather in enumerate(response['daily']):
            if dailyWeather['weather'][0]['id'] in thunderstormsIDs and index > 0:
                storm = True
                days.append("tomorrow" if index == 1 else datetime.datetime.fromtimestamp(dailyWeather['dt']).strftime("%A"))
        if storm:
            return f'In the next week, we will observe some storms {days[0] + " and " if days[0] == "tomorrow" else ""} on {", ".join(days) if days[0] != "tomorrow" else ", ".join(days[1:-1])}{ " and " + days[-1] if days[-1] != "tomorrow" else ""}.'
        return "Upcoming week should be free of storms!"
    elif tag == "windy-later-that-day":
        return "I'm sorry, I cannot answer to that yet. Try asking me another time!"
    elif tag == "windy-this-week":
        return "I'm sorry, I cannot answer to that yet. Try asking me another time!"
    elif tag == "temperature-later-that-day":
        return "Here's the forecast for the next 24 hours."
    elif tag == "temperature-this-week":
        return "Here's the forecast for the next week."

def get_weather_geoloc(latitude, longitude, isHourly, tag):
    if(longitude == 0 and latitude == 0): return None
    complete_url = base_url_onecall+"lat=" + \
        str(latitude)+"&lon="+str(longitude) +"&appid="+api_key
    response = requests.get(complete_url).json()
    print(f'latitude: {latitude}')
    print(f'longitude: {longitude}')
    location = geolocator.reverse((latitude, longitude))
    return {
        "text": returnMessage(response, tag),
        "weather": response['current']['weather'][0]['id'],
        "temperature": math.ceil(kelvin_to_celcius(response['current']["temp"])),
        "city": location.raw['address'].get('city') or location.raw['address'].get('town'),
        "region": location.raw['address'].get('state'),
        "forecast": "clock" if isHourly else "calendar",
        "forecastDay": [
            {
                "weather": weather['weather'][0]['id'],
                "temperature": math.ceil(kelvin_to_celcius(weather['temp']['day'])),
                "date": "Tomorrow" if index == 1 else datetime.datetime.fromtimestamp(weather['dt']).strftime("%A")
            } for index, weather in enumerate(response['daily']) if index > 0
        ] ,
        "forecastHour": [
            {
                "weather": weather['weather'][0]['id'],
                "temperature": math.ceil(kelvin_to_celcius(weather['temp'])),
                "hour": f'{datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour}' if datetime.datetime.fromtimestamp(response["current"]["dt"]).hour > 9 else f'0{datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour}',
                "minutes": f'{datetime.datetime.fromtimestamp(weather["dt"]).minute}' if datetime.datetime.fromtimestamp(weather["dt"]).minute > 9 else f'0{datetime.datetime.fromtimestamp(weather["dt"]).minute}',
                "day": True if (weather['dt'] < response['current']['sunset'] and weather['dt'] > response['current']['sunrise']) else False
            } for index, weather in enumerate(response['hourly']) if index < 24
        ]
    }

# function to get current weather in given city
def get_weather(city_name):
    if(get_location_from_city(city_name) is None):
        print("The city with given name may not exist\n")
        return
    lat, lon = get_location_from_city(city_name)
    complete_url = base_url_onecall+"lat=" + \
        str(lat)+"&lon="+str(lon) + \
        "&exclude=minutely,hourly"+"&appid="+api_key
    response = requests.get(complete_url).json()

    print(f"Current temperature in {city_name}: {round(kelvin_to_celcius(response['current']['temp']))} (in celcius)")
    print(f"Wind speed: {response['current']['wind_speed']} m/s")
    print(f"Weather description: {response['current']['weather'][0]['description']}")

# function to get weather based on city name and date (can print data up to one week)
def get_weatherFromDate(city_name,year,month,day):
    if(get_location_from_city(city_name) is None):
        print("The city with given name may not exist\n")
        return
    lat,lon = get_location_from_city(city_name)

    #get unixTime from given date
    unixTime = str(int((get_unixTime(year,month,day))))

    complete_url = base_url_onecall+"lat=" + \
        str(lat)+"&lon="+str(lon) + \
        "&exclude=hourly,minutely,alerts"+"&appid="+api_key+"&dt="+unixTime

    response = requests.get(complete_url).json()
    # print(response)
    with open('ChatBot/weatherData.json', 'w') as weatherDataJson:
        json.dump(response, weatherDataJson, indent=4)
    found = False
    for day_ in response['daily']:
        if day_['dt'] == int(unixTime):
            temp = day_['temp']['day']
            weather_desc = day_['weather'][0]['description']
            wind_speed = day_['wind_speed']
            found = True
            print(f"Temperature in {city_name} for {day}-{month}-{year}: {round(kelvin_to_celcius(temp))} (in celcius)")
            print(f"Wind speed: {wind_speed} m/s")
            print("Weather description: ",weather_desc)
    if not found:
        print("Not avaiable data for given date :< (I can give you forcast up week from current date)")


# get_weatherFromDate("Bochnia",2023,4,8)


# ostatnia pętla bez flagi tylko break/else
#  string format do url
# try/except czy jest api key
# zamiast config.py przejść na config.txt