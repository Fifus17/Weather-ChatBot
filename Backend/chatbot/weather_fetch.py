"""set of functions needed to fetch the weather from API"""
import datetime
import math
import time

import requests
from .config import api_key
import json
from geopy.geocoders import Nominatim
api_key = api_key
from .weather import WeatherForecast
geolocator = Nominatim(user_agent="weather_chatbot") # for getting geolocation form the address

base_url_geo = "http://api.openweathermap.org/geo/1.0/direct?"
base_url_onecall = "https://api.openweathermap.org/data/2.5/onecall?"

# util function for getting coordinates of the address
def find_cords(address):
    location = geolocator.geocode(address)
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
def get_unix_time(year, month, day):

    data = datetime.datetime(year, month, day, 12)
    unixtime = int(data.timestamp())
    return unixtime

def return_message(weather, tag):
    if tag == "raining-later-that-day":
        return weather.get_rain_later_message()
    elif tag == "raining-this-week":
        return weather.get_rain_this_week_message()
    elif tag == "snowing-later-that-day":
        return weather.get_snow_later_message()
    elif tag == "snowing-this-week":
        return weather.get_snow_this_week_message()
    elif tag == "sunny-later-that-day":
        return weather.get_sunny_later_message()
    elif tag == "sunny-this-week":
        return weather.get_sunny_this_week_message()
    elif tag == "thunderstorms-later-that-day":
        return weather.get_thunderstorms_later_message()
    elif tag == "thunderstorms-this-week":
        return weather.get_thunderstorms_this_week_message()
    elif tag == "windy-later-that-day":
        return weather.get_windy_later_message()
    elif tag == "windy-this-week":
        return weather.get_windy_this_week_message()
    elif tag == "temperature-later-that-day":
        return weather.get_temperature_later_message()
    elif tag == "temperature-this-week":
        return weather.get_temperature_this_week_message()

def get_weather_geoloc(latitude, longitude, isHourly, tag):
    if(longitude == 0 and latitude == 0): return None

    complete_url = "{0}lat={1}&lon={2}&appid={3}".format(
        base_url_onecall, latitude, longitude, api_key
    )
    response = requests.get(complete_url).json()
    forecast = WeatherForecast(response)
    print(f'latitude: {latitude}')
    print(f'longitude: {longitude}')
    location = geolocator.reverse((latitude, longitude))
    return {
        "text": return_message(forecast,tag),
        "weather": response['current']['weather'][0]['id'],
        "temperature": math.ceil(kelvin_to_celcius(response['current']["temp"])),
        "city": location.raw['address'].get('city') or location.raw['address'].get('town'),
        "day": True if (response['current']['dt'] < response['current']['sunset'] and response['current']['dt'] > response['current']['sunrise']) else False,
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
    complete_url = "{}lat={}&lon={}&exclude=minutely,hourly&appid={}".format(
        base_url_onecall, lat, lon, api_key
    )

    response = requests.get(complete_url).json()

    print(f"Current temperature in {city_name}: {round(kelvin_to_celcius(response['current']['temp']))} (in celcius)")
    print(f"Wind speed: {response['current']['wind_speed']} m/s")
    print(f"Weather description: {response['current']['weather'][0]['description']}")

# function to get weather based on city name and date (can print data up to one week)
def get_weather_from_date(city_name, year, month, day):
    if(get_location_from_city(city_name) is None):
        print("The city with given name may not exist\n")
        return
    lat,lon = get_location_from_city(city_name)

    #get unixTime from given date
    unixTime = str(int((get_unix_time(year, month, day))))
    complete_url = "{}lat={}&lon={}&exclude=hourly,minutely,alerts&appid={}&dt={}".\
        format(base_url_onecall, lat, lon,api_key, unixTime)
    # complete_url = base_url_onecall+"lat=" + \
    #     str(lat)+"&lon="+str(lon) + \
    #     "&exclude=hourly,minutely,alerts"+"&appid="+api_key+"&dt="+unixTime

    response = requests.get(complete_url).json()
    # print(response)
    with open('ChatBot/weatherData.json', 'w') as weatherDataJson:
        json.dump(response, weatherDataJson, indent=4)
    for day_ in response['daily']:
        if day_['dt'] == int(unixTime):
            temp = day_['temp']['day']
            weather_desc = day_['weather'][0]['description']
            wind_speed = day_['wind_speed']
            print(f"Temperature in {city_name} for {day}-{month}-{year}: {round(kelvin_to_celcius(temp))} (in celcius)")
            print(f"Wind speed: {wind_speed} m/s")
            print("Weather description: ",weather_desc)
            break
    else:
        print("Not avaiable data for given date :< (I can give you forcast up week from current date)")

# try/except czy jest api key
# zamiast config.py.py przejść na config.py.txt