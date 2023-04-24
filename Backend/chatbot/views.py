from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .process import processMessage
from .weather_fetch import get_weather_geoloc

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        message = json.loads(request.body)['message']
        lat = json.loads(request.body)['lat']
        lon = json.loads(request.body)['lon']
        # Process the message and generate a response
        response = processMessage(message, lat, lon)
        print(response)
        if(response != None): 
            return JsonResponse({'response': response})