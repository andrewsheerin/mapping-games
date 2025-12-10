// Initialize the map
let map;
let countriesData;
let guessedCountries = new Set();
let countryLayers = {};

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Leaflet map
    map = L.map('map').setView([20, 0], 2);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        minZoom: 2
    }).addTo(map);
    
    // Load countries data
    loadCountriesData();
    
    // Set up event listeners
    setupEventListeners();
});

// Load countries data from JSON
async function loadCountriesData() {
    try {
        const response = await fetch('/api/countries/');
        countriesData = await response.json();
        
        // Update total count
        document.getElementById('total').textContent = countriesData.features.length;
        
        console.log(`Loaded ${countriesData.features.length} countries`);
    } catch (error) {
        console.error('Error loading countries data:', error);
        showFeedback('Error loading country data. Please refresh the page.', 'incorrect');
    }
}

// Set up event listeners
function setupEventListeners() {
    const input = document.getElementById('countryInput');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Submit on button click
    submitBtn.addEventListener('click', handleGuess);
    
    // Submit on Enter key
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
    
    // Reset game
    resetBtn.addEventListener('click', resetGame);
    
    // Focus on input
    input.focus();
}

// Handle country guess
function handleGuess() {
    const input = document.getElementById('countryInput');
    const guess = input.value.trim();
    
    if (!guess) {
        return;
    }
    
    // Normalize the guess (lowercase, remove extra spaces)
    const normalizedGuess = guess.toLowerCase().replace(/\s+/g, ' ');
    
    // Find matching country
    const matchedCountry = findCountry(normalizedGuess);
    
    if (matchedCountry) {
        const countryName = matchedCountry.properties.name;
        
        // Check if already guessed
        if (guessedCountries.has(countryName)) {
            showFeedback(`You already guessed ${countryName}!`, 'already-guessed');
        } else {
            // Add to guessed countries
            guessedCountries.add(countryName);
            
            // Display the country on map
            displayCountry(matchedCountry);
            
            // Update UI
            updateScore();
            addToGuessedList(countryName);
            showFeedback(`Correct! ${countryName}`, 'correct');
            
            // Check if all countries guessed
            if (guessedCountries.size === countriesData.features.length) {
                setTimeout(() => {
                    showFeedback('🎉 Congratulations! You guessed all countries!', 'correct');
                }, 500);
            }
        }
    } else {
        showFeedback(`"${guess}" is not correct. Try again!`, 'incorrect');
    }
    
    // Clear input
    input.value = '';
    input.focus();
}

// Find country by name (fuzzy matching)
function findCountry(guess) {
    if (!countriesData) return null;
    
    return countriesData.features.find(feature => {
        const countryName = feature.properties.name.toLowerCase();
        
        // Exact match
        if (countryName === guess) {
            return true;
        }
        
        // Check if guess is contained in country name or vice versa
        if (countryName.includes(guess) || guess.includes(countryName)) {
            return true;
        }
        
        // Check common alternative names
        const alternatives = getAlternativeNames(feature.properties.name);
        return alternatives.some(alt => 
            alt.toLowerCase() === guess || 
            alt.toLowerCase().includes(guess) ||
            guess.includes(alt.toLowerCase())
        );
    });
}

// Get alternative names for countries
function getAlternativeNames(countryName) {
    const alternatives = {
        'United States': ['usa', 'us', 'america', 'united states of america'],
        'United Kingdom': ['uk', 'britain', 'great britain', 'england'],
        'South Korea': ['korea', 'republic of korea'],
        'South Africa': ['rsa']
    };
    
    return alternatives[countryName] || [];
}

// Display country on map
function displayCountry(country) {
    const countryName = country.properties.name;
    
    // Create GeoJSON layer for the country
    const layer = L.geoJSON(country, {
        style: {
            fillColor: '#667eea',
            fillOpacity: 0.6,
            color: '#764ba2',
            weight: 2
        }
    }).addTo(map);
    
    // Store layer reference
    countryLayers[countryName] = layer;
    
    // Zoom to country
    const center = country.properties.center;
    map.flyTo([center[0], center[1]], 5, {
        duration: 1.5
    });
    
    // Add popup with country name
    layer.bindPopup(`<strong>${countryName}</strong>`).openPopup();
}

// Update score
function updateScore() {
    document.getElementById('score').textContent = guessedCountries.size;
    document.getElementById('guessedCount').textContent = guessedCountries.size;
}

// Add country to guessed list
function addToGuessedList(countryName) {
    const guessedList = document.getElementById('guessedList');
    const tag = document.createElement('div');
    tag.className = 'country-tag';
    tag.textContent = countryName;
    guessedList.appendChild(tag);
}

// Show feedback message
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'feedback';
    }, 3000);
}

// Reset game
function resetGame() {
    if (!confirm('Are you sure you want to reset the game? All progress will be lost.')) {
        return;
    }
    
    // Clear guessed countries
    guessedCountries.clear();
    
    // Remove all country layers from map
    Object.values(countryLayers).forEach(layer => {
        map.removeLayer(layer);
    });
    countryLayers = {};
    
    // Reset map view
    map.setView([20, 0], 2);
    
    // Clear guessed list
    document.getElementById('guessedList').innerHTML = '';
    
    // Reset score
    updateScore();
    
    // Clear feedback
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    
    // Focus on input
    document.getElementById('countryInput').focus();
    
    showFeedback('Game reset! Start guessing countries.', 'correct');
}
