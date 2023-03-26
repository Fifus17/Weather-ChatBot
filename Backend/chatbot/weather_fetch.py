"""set of functions needed to fetch the weather from API"""
import datetime
import time

import requests,json

api_key = "1b311ee45be9d517454cab7c6dc3b9f5"
base_url = "https://api.openweathermap.org/data/2.5/weather?"
base_url_geo = "http://api.openweathermap.org/geo/1.0/direct?"
base_url_onecall = "https://api.openweathermap.org/data/2.5/onecall?"
def kelvin_to_celcius(temp):
    return temp-273.15
def get_location_from_city(city_name):
    complete_url = base_url_geo+"&q="+city_name+"&limit=1"+"&appid="+api_key
    response = requests.get(complete_url).json()
    if response:
        return response[0]["lat"],response[0]["lon"]
    return None

print(get_location_from_city("London"))
"""Funkcja używa weather API i printuje aktualną temperaturę dla danego miasta"""
def get_currentWeather(city_name):
    complete_url = base_url+"appid="+api_key+"&q="+city_name+"&limit=1"

    response = requests.get(complete_url)
    x = response.json()
    if x["cod"] != "404":
        y = x["main"]
        current_temperature = y["temp"]
        #here we can get more things to describe weather
        print("Current temperature at "+city_name,": ",round((kelvin_to_celcius(current_temperature)),2),"(in celsius)")
    else:
        print("City not found")

"""funkcja przyjmuje date (rok, miesiąc, dzień) i zwraca date w formacie UNIX timestamp (defaultowo dla
godziny 12"""
def get_unixTime(year,month,day,hour=12):
    unix_time = datetime.datetime(year,month,day,hour)
    return time.mktime(unix_time.timetuple())

"""Funkcja przyjmuje nazwe miasta i zwraca aktualną pogodę (wersja 2: na podany dzień i godzinę)"""

def get_weather(city_name):
    lat,lon = get_location_from_city(city_name) #pobieramy współrzędne dla danego miasta
    complete_url = base_url_onecall+"lat="+str(lat)+"&lon="+str(lon)+"&exclude=minutely,hourly"+"&appid="+api_key
    response = requests.get(complete_url).json()
    print(response)
    print(f"Current temperature in {city_name}: ",kelvin_to_celcius(response["current"]["temp"]))
    # print(f"Weather description: {response['current']['weather']['description']}")

get_currentWeather("London")
get_weather("London")



