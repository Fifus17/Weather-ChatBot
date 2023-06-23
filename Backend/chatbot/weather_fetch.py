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

#determines the lowest value of strong winds, in m/s
strong_wind = 20

import datetime

class WeatherForecast:
    def __init__(self, response):
        self.response = response
        self.rainIDs = [200, 201, 202, 230, 231, 232, 300, 301, 302, 310, 311, 312, 313, 314, 321, 500, 501, 502, 503, 504,
                   511, 520, 521, 522, 531, 615, 616]
        self.snowIDs = [600, 601, 602, 611, 612, 615, 616, 620, 621, 622]
        self.sunnyIDs = [800, 801, 802]
        self.thunderstormsIDs = [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]
        self.strong_wind = 20  # m/s

    def get_weather_description(self, weather):
        return weather['weather'][0]['description']

    def get_formatted_time(self, timestamp):
        dt = datetime.datetime.fromtimestamp(timestamp + self.response["timezone_offset"])
        return dt.strftime("%H:%M")

    def get_day_name(self, timestamp):
        dt = datetime.datetime.fromtimestamp(timestamp)
        return dt.strftime("%A")

    def check_weather_condition(self, weather, condition_ids):
        return weather['weather'][0]['id'] in condition_ids

    def check_hourly_rain(self):
        for hourlyWeather in self.response['hourly']:
            if self.check_weather_condition(hourlyWeather, self.rainIDs):
                return hourlyWeather
        return None

    def check_daily_rain(self):
        days = []
        print("resposne",self.response['daily'])
        for index, dailyWeather in enumerate(self.response['daily']):
            if self.check_weather_condition(dailyWeather, self.rainIDs) and index > 0:
                days.append("tomorrow" if index == 1 else self.get_day_name(dailyWeather['dt']))
        print(days,"\n")
        return days

    def check_hourly_snow(self):
        for hourlyWeather in self.response['hourly']:
            if self.check_weather_condition(hourlyWeather, self.snowIDs):
                return hourlyWeather
        return None

    def check_daily_snow(self):
        days = []
        for index, dailyWeather in enumerate(self.response['daily']):
            if self.check_weather_condition(dailyWeather, self.snowIDs) and index > 0:
                days.append("tomorrow" if index == 1 else self.get_day_name(dailyWeather['dt']))
        return days

    def check_hourly_sunny(self):
        for hourlyWeather in self.response['hourly']:
            if self.check_weather_condition(hourlyWeather, self.sunnyIDs):
                return hourlyWeather
        return None

    def check_daily_sunny(self):
        days = []
        for index, dailyWeather in enumerate(self.response['daily']):
            if self.check_weather_condition(dailyWeather, self.sunnyIDs) and index > 0:
                days.append("tomorrow" if index == 1 else self.get_day_name(dailyWeather['dt']))
        return days

    def check_hourly_thunderstorms(self):
        for hourlyWeather in self.response['hourly']:
            if self.check_weather_condition(hourlyWeather, self.thunderstormsIDs):
                return hourlyWeather
        return None

    def check_daily_thunderstorms(self):
        days = []
        for index, dailyWeather in enumerate(self.response['daily']):
            if self.check_weather_condition(dailyWeather, self.thunderstormsIDs) and index > 0:
                days.append("tomorrow" if index == 1 else self.get_day_name(dailyWeather['dt']))
        return days

    def check_hourly_windy(self):
        for hourlyWeather in self.response['hourly']:
            if hourlyWeather['wind_speed'] > self.strong_wind:
                return hourlyWeather
        return None

    def check_daily_windy(self):
        days = []
        for index, dailyWeather in enumerate(self.response['daily']):
            if dailyWeather['wind_speed'] > self.strong_wind and index > 0:
                days.append("tomorrow" if index == 1 else self.get_day_name(dailyWeather['dt']))
        return days

    def get_rain_later_message(self):
        weather = self.check_hourly_rain()
        if weather:
            time = self.get_formatted_time(weather['dt'])
            description = self.get_weather_description(weather)
            return f'There probably will be {description} starting around {time}.'
        return "It shouldn't rain in the next 24 hours."

    def get_rain_this_week_message(self):
        days = self.check_daily_rain()
        print(days)
        if days:
            day_list = ", ".join(days[:-1])
            last_day = days[-1]
            return f'In the next week, it should rain on {day_list}{ " and " + last_day if last_day != "tomorrow" else ""}.'
        return "Luckily, it shouldn't rain this week."

    def get_snow_later_message(self):
        weather = self.check_hourly_snow()
        if weather:
            time = self.get_formatted_time(weather['dt'])
            description = self.get_weather_description(weather)
            return f'There probably will be {description} starting around {time}.'
        return "It shouldn't snow in the next 24 hours."

    def get_snow_this_week_message(self):
        days = self.check_daily_snow()
        if days:
            day_list = ", ".join(days[:-1])
            last_day = days[-1]
            return f'In the next week, it should snow on {day_list}{ " and " + last_day if last_day != "tomorrow" else ""}.'
        return "It shouldn't snow this week."

    def get_sunny_later_message(self):
        weather = self.check_hourly_sunny()
        if weather:
            time = self.get_formatted_time(weather['dt'])
            description = self.get_weather_description(weather)
            return f'There probably will be {description} starting around {time}, so we will see some sun!'
        return "We won't see much sun in the next 24 hours."

    def get_sunny_this_week_message(self):
        days = self.check_daily_sunny()
        if days:
            day_list = ", ".join(days[:-1])
            last_day = days[-1]
            return f'In the next week, it should be sunny on {day_list}{ " and " + last_day if last_day != "tomorrow" else ""}.'
        return "Unluckily, we won't see much sun in the upcoming week."

    def get_thunderstorms_later_message(self):
        weather = self.check_hourly_thunderstorms()
        if weather:
            time = self.get_formatted_time(weather['dt'])
            description = self.get_weather_description(weather)
            return f'There probably will be {description} starting around {time}. Be careful!'
        return "We shouldn't see any lightning in the next 24 hours."

    def get_thunderstorms_this_week_message(self):
        days = self.check_daily_thunderstorms()
        if days:
            day_list = ", ".join(days[:-1])
            last_day = days[-1]
            return f'In the next week, we will observe some storms on {day_list}{ " and " + last_day if last_day != "tomorrow" else ""}.'
        return "The upcoming week should be free of storms!"

    def get_windy_later_message(self):
        weather = self.check_hourly_windy()
        if weather:
            wind_speed = self.convert_to_kilometers_per_hour(weather['wind_speed'])
            return f"The wind is quite speedy today ({wind_speed} km/h). Be careful!"
        return "The wind is going to be light today!"

    def get_windy_this_week_message(self):
        days = self.check_daily_windy()
        if days:
            return "In the next week, we will observe some strong winds. Be careful!"
        return "Strong winds should not appear in the next week."

    def get_temperature_later_message(self):
        return "Here's the forecast for the next 24 hours."

    def get_temperature_this_week_message(self):
        return "Here's the forecast for the next week."

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

# rainIDs = [200, 201, 202, 230, 231, 232, 300, 301, 302, 310, 311, 312, 313, 314, 321, 500, 501, 502, 503, 504, 511, 520, 521, 522, 531, 615, 616]
# snowIDs = [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622]
# sunnyIDs = [800, 801, 802]
# thunderstormsIDs = [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]



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
# def return_message(response, tag):
#     if tag == "raining-later-that-day":
#         rain = False
#         weather = 0
#         for hourlyWeather in response['hourly']:
#             if hourlyWeather['weather'][0]['id'] in rainIDs:
#                 rain = True
#                 weather = hourlyWeather
#                 break
#         if rain:
#             return f'There probably will be {weather["weather"][0]["description"]} starting around {datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour)}:{datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute)}.'
#         return "It shouldn't rain in the next 24 hours"
#     elif tag == "raining-this-week":
#         rain = False
#         days = []
#         for index, dailyWeather in enumerate(response['daily']):
#             if dailyWeather['weather'][0]['id'] in rainIDs and index > 0:
#                 rain = True
#                 days.append("tomorrow" if index == 1 else datetime.datetime.fromtimestamp(dailyWeather['dt']).strftime("%A"))
#         if rain:
#             return f'In the next week, it should rain {days[0] + " and " if days[0] == "tomorrow" else ""} on {", ".join(days) if days[0] != "tomorrow" else ", ".join(days[1:-1])}{ " and " + days[-1] if days[-1] != "tomorrow" else ""}.'
#         return "Luckily, it shouldn't rain this week"
#     elif tag == "snowing-later-that-day":
#         snow = False
#         weather = 0
#         for hourlyWeather in response['hourly']:
#             if hourlyWeather['weather'][0]['id'] in snowIDs:
#                 snow = True
#                 weather = hourlyWeather
#                 break
#         if snow:
#             return f'There probably will be {weather["weather"][0]["description"]} starting around {datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour)}:{datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute)}.'
#         return "It shouldn't snow in the next 24 hours."
#     elif tag == "snowing-this-week":
#         snow = False
#         days = []
#         for index, dailyWeather in enumerate(response['daily']):
#             if dailyWeather['weather'][0]['id'] in snowIDs and index > 0:
#                 snow = True
#                 days.append("tomorrow" if index == 1 else datetime.datetime.fromtimestamp(dailyWeather['dt']).strftime("%A"))
#         if snow:
#             return f'In the next week, it should snow {days[0] + " and " if days[0] == "tomorrow" else ""} on {", ".join(days) if days[0] != "tomorrow" else ", ".join(days[1:-1])}{ " and " + days[-1] if days[-1] != "tomorrow" else ""}.'
#         return "It shouldn't snow this week."
#     elif tag == "sunny-later-that-day":
#         sunny = False
#         weather = 0
#         for hourlyWeather in response['hourly']:
#             if hourlyWeather['weather'][0]['id'] in sunnyIDs:
#                 sunny = True
#                 weather = hourlyWeather
#                 break
#         if sunny:
#             return f'There probably will be {weather["weather"][0]["description"]} starting around {datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour)}:{datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute)} so we will see some sun!.'
#         return "We won't see much sun in the next 24 hours."
#     elif tag == "sunny-this-week":
#         sunny = False
#         days = []
#         for index, dailyWeather in enumerate(response['daily']):
#             if dailyWeather['weather'][0]['id'] in sunnyIDs and index > 0:
#                 sunny = True
#                 days.append("tomorrow" if index == 1 else datetime.datetime.fromtimestamp(dailyWeather['dt']).strftime("%A"))
#         if sunny:
#             return f'In the next week, it should be sunny {days[0] + " and " if days[0] == "tomorrow" else ""} on {", ".join(days) if days[0] != "tomorrow" else ", ".join(days[1:-1])}{ " and " + days[-1] if days[-1] != "tomorrow" else ""}.'
#         return "Unluckily, we won't see much sun in the upcoming week"
#     elif tag == "thunderstorms-later-that-day":
#         storm = False
#         weather = 0
#         for hourlyWeather in response['hourly']:
#             if hourlyWeather['weather'][0]['id'] in thunderstormsIDs:
#                 storm = True
#                 weather = hourlyWeather
#                 break
#         if storm:
#             return f'There probably will be {weather["weather"][0]["description"]} starting around {datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).hour)}:{datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute if datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute > 9 else "0" + str(datetime.datetime.fromtimestamp(weather["dt"] + response["timezone_offset"]).minute)}. Be careful!'
#         return "We shouldn't see any lightnings on the sky in the next 24 hours."
#     elif tag == "thunderstorms-this-week":
#         storm = False
#         days = []
#         for index, dailyWeather in enumerate(response['daily']):
#             if dailyWeather['weather'][0]['id'] in thunderstormsIDs and index > 0:
#                 storm = True
#                 days.append("tomorrow" if index == 1 else datetime.datetime.fromtimestamp(dailyWeather['dt']).strftime("%A"))
#         if storm:
#             return f'In the next week, we will observe some storms {days[0] + " and " if days[0] == "tomorrow" else ""} on {", ".join(days) if days[0] != "tomorrow" else ", ".join(days[1:-1])}{ " and " + days[-1] if days[-1] != "tomorrow" else ""}.'
#         return "Upcoming week should be free of storms!"
#     elif tag == "windy-later-that-day":
#         wind = False
#         weather = 0
#         for hourlyWeather in response['hourly']:
#             if hourlyWeather['wind_speed'] > strong_wind:
#                 wind = True
#                 weather = hourlyWeather
#                 break
#         if wind:
#             return f"The wind is quite speedy today ({weather['wind_speed']*3.6} km/h). Be careful!"
#         return "The wind is going to be light today!"
#     elif tag == "windy-this-week":
#         wind = False
#         days = []
#         for index, dailyWeather in enumerate(response['daily']):
#             if dailyWeather['wind_speed'] > strong_wind and index > 0:
#                 wind = True
#                 days.append("tomorrow" if index == 1 else datetime.datetime.fromtimestamp(dailyWeather['dt']).strftime("%A"))
#         if wind:
#             return f'In the next week, we will observe some strong winds, be careful'
#         return "Strong wind should not appear in the next week"
#     elif tag == "temperature-later-that-day":
#         return "Here's the forecast for the next 24 hours."
#     elif tag == "temperature-this-week":
#         return "Here's the forecast for the next week."


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
    # complete_url = base_url_onecall+"lat=" + \
    #     str(lat)+"&lon="+str(lon) + \
    #     "&exclude=minutely,hourly"+"&appid="+api_key
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