from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
# from .ChatBot.process import processMessage

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        message = json.loads(request.body)['message']
        # Process the message and generate a response
        
        # response = processMessage(message)
        response = "lol"
        return JsonResponse({'response': response})