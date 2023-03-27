"""set of functions needed to fetch the weather from API"""
import datetime
import time

import requests
import config
import json
api_key = config.api_key

base_url = "https://api.openweathermap.org/data/2.5/weather?"
base_url_geo = "http://api.openweathermap.org/geo/1.0/direct?"
base_url_onecall = "https://api.openweathermap.org/data/2.5/onecall?"

#util function for converting units
def kelvin_to_celcius(temp):
    return temp-273.15

#function to get longitude and latitude based on name of the city
def get_location_from_city(city_name):
        complete_url = base_url_geo+"&q="+city_name+"&limit=1"+"&appid="+api_key
        response = requests.get(complete_url).json()
        if response:
            return response[0]["lat"], response[0]["lon"]
        return None

"""Funkcja używa weather API i printuje aktualną temperaturę dla danego miasta"""
def get_currentWeather(city_name):
    complete_url = base_url+"appid="+api_key+"&q="+city_name+"&limit=1"

    response = requests.get(complete_url)
    x = response.json()
    if x["cod"] != "404":
        y = x["main"]
        current_temperature = y["temp"]
        # here we can get more things to describe weather
        print("Current temperature at "+city_name, ": ",
                round((kelvin_to_celcius(current_temperature)), 2), "(in celsius)")
    else:
        print("City not found")

"""funkcja przyjmuje date (rok, miesiąc, dzień) i zwraca date w formacie UNIX timestamp (defaultowo dla
godziny 12"""
#util function to get unixTime
def get_unixTime(year, month, day):

    data = datetime.datetime(year, month, day, 12)
    unixtime = int(data.timestamp())
    return unixtime
    # unix_time = datetime.datetime(year, month, day,0)
    # # return unix_time.timestamp()
    # return time.mktime(unix_time.timetuple())

"""Funkcja przyjmuje nazwe miasta i zwraca aktualną pogodę (wersja 2: na podany dzień i godzinę)"""

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
    print(response)

    print(f"Current temperature in {city_name}: {round(kelvin_to_celcius(response['current']['temp']))} (in celcius)")
    print(f"Wind speed: {response['current']['wind_speed']} m/s")
    print(f"Weather description: {response['current']['weather'][0]['description']}")


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
    print(response)
    print(f"Current temperature in {city_name}: {round(kelvin_to_celcius(response['current']['temp']))} (in celcius)")
    print(f"Wind speed: {response['current']['wind_speed']} m/s")

get_weather("Gliwice")
get_weatherFromDate("Gliwice",2023,3,31)
print(get_unixTime(2023,3,31))




