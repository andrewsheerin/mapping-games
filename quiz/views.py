from django.shortcuts import render
from django.http import JsonResponse
import json
import os

def index(request):
    """Render the main quiz page."""
    return render(request, 'quiz/index.html')

def get_countries(request):
    """API endpoint to get all countries data."""
    # Load countries data from JSON file
    json_path = os.path.join(os.path.dirname(__file__), 'static', 'quiz', 'data', 'countries.json')
    try:
        with open(json_path, 'r') as f:
            countries_data = json.load(f)
        return JsonResponse(countries_data, safe=False)
    except FileNotFoundError:
        return JsonResponse({'error': 'Countries data not found'}, status=404)

