document.getElementById('current-location').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchPositionData, showError);
    } else {
        displayError('Geolocation is not supported by this browser.');
    }
});

document.getElementById('search-location').addEventListener('click', function() {
    const location = document.getElementById('location-search').value;
    if (location) {
        fetchLocationData(location);
    } else {
        displayError('Please enter a location.');
    }
});

document.getElementById('predefined-locations').addEventListener('change', function() {
    const location = this.value;
    if (location) {
        fetchLocationData(location);
    }
});

function fetchPositionData(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    fetchData(lat, lng);
}

function fetchLocationData(location) {
    fetch(`https://geocode.maps.co/search?q=${location}`).then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            fetchData(lat, lon);
        } else {
            displayError('Location not found');
        }
    }).catch(() => displayError('Error fetching location data'));
}

function fetchData(lat, lng) {
    fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'OK') {
            updateUI(data.results);
        } else {
            displayError('Error fetching sunrise and sunset data');
        }
    }).catch(() => displayError('Error fetching data'));
}

function updateUI(data) {
    const display = document.getElementById('data-display');
    // Update this section to display all required information
   
