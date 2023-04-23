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

def get_weekday_date():
    pass

def get_weather_geoloc(latitude, longitude, isHourly):
    if(longitude == 0 and latitude == 0): return None
    complete_url = base_url_onecall+"lat=" + \
        str(latitude)+"&lon="+str(longitude) +"&appid="+api_key
    response = requests.get(complete_url).json()
    print(f'latitude: {latitude}')
    print(f'longitude: {longitude}')
    location = geolocator.reverse((latitude, longitude))
    return {
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
            } for weather in response['hourly']
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