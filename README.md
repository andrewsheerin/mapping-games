# 🌍 Country Quiz Game

An interactive Django web application that helps users learn world geography through a fun quiz game. Users type country names, and the corresponding country shapefile appears on an interactive Leaflet map, automatically zooming to its location.

## Features

- **Interactive Map**: Powered by Leaflet.js for smooth map interactions
- **Country Quiz**: Guess all 25+ countries included in the dataset
- **Auto-zoom**: Map automatically pans and zooms to each guessed country
- **Visual Feedback**: Countries are highlighted on the map when guessed correctly
- **Score Tracking**: Real-time score display showing progress
- **Guessed Countries List**: Visual list of all correctly guessed countries
- **Fuzzy Matching**: Accepts alternative country names (e.g., "USA" for "United States")
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Backend**: Django 6.0
- **Frontend**: HTML5, CSS3, JavaScript
- **Mapping**: Leaflet.js 1.9.4
- **Data Format**: GeoJSON for country shapefiles

## Installation

### Prerequisites
- Python 3.12 or higher
- pip package manager

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/andrewsheerin/mapping-games.git
cd mapping-games
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run database migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

5. Open your browser and navigate to:
```
http://localhost:8000
```

## Usage

1. **Start the Quiz**: The map loads showing a world view
2. **Type Country Names**: Enter a country name in the input field at the top
3. **Submit Your Guess**: Click "Submit" or press Enter
4. **Watch the Map**: If correct, the country shape appears and the map zooms to its location
5. **Track Progress**: Your score updates automatically
6. **Reset Game**: Click "Reset Game" to start over

### Accepted Country Names

The quiz accepts various forms of country names:
- Full names: "United States"
- Common abbreviations: "USA", "UK"
- Alternative names: "America", "Britain"

## Project Structure

```
mapping-games/
├── manage.py                          # Django management script
├── requirements.txt                   # Python dependencies
├── db.sqlite3                        # SQLite database (generated)
├── mapping_quiz_project/             # Django project settings
│   ├── __init__.py
│   ├── settings.py                   # Project configuration
│   ├── urls.py                       # Main URL routing
│   ├── wsgi.py
│   └── asgi.py
└── quiz/                             # Quiz application
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── views.py                      # View logic
    ├── urls.py                       # App URL routing
    ├── templates/
    │   └── quiz/
    │       └── index.html            # Main quiz page
    └── static/
        └── quiz/
            ├── css/
            │   └── style.css         # Styling
            ├── js/
            │   └── quiz.js           # Quiz logic & map interaction
            └── data/
                └── countries.json    # Country GeoJSON data
```

## Adding More Countries

To add more countries to the quiz:

1. Open `quiz/static/quiz/data/countries.json`
2. Add a new feature object with:
   - Country name
   - Center coordinates [latitude, longitude]
   - Geometry (polygon coordinates)

Example:
```json
{
  "type": "Feature",
  "properties": {
    "name": "New Country",
    "center": [latitude, longitude]
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[lon1, lat1], [lon2, lat2], ...]]
  }
}
```

## Development

### Running in Development Mode
```bash
python manage.py runserver
```

### Creating a Superuser (for admin access)
```bash
python manage.py createsuperuser
```

### Access Admin Panel
Navigate to `http://localhost:8000/admin/`

## Future Enhancements

- Add all 195 countries with accurate shapefiles
- Implement difficulty levels (continents, regions)
- Add timer mode for speed challenges
- Include capital cities quiz mode
- Add multiplayer functionality
- Implement user authentication and leaderboards
- Add hints system
- Include country flags and facts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Country data based on simplified GeoJSON representations
- Map tiles provided by OpenStreetMap
- Built with Django and Leaflet.js