"""set of functions needed to fetch the weather from API"""
import requests,json
#my API key DO UZUPELNIENIA
api_key = ""
base_url = ""

def get_currentWeather(city_name):
    complete_url = base_url+"appid="+api_key+"&q="+city_name

    response = requests.get(complete_url)
    x = response.json()
    if x["cod"] != "404":
        y = x["main"]
        current_temperature = y["temp"]
        #here we can get more things to describe weather
        print("Current temperature at "+city_name,": ",current_temperature)
    else:
        print("City not found")