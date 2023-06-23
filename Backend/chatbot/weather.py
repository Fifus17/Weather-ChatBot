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