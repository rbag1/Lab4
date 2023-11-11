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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    Promise.all([
        fetchSunriseSunsetData(lat, lng, today),
        fetchSunriseSunsetData(lat, lng, tomorrow)
    ]).then(([todayData, tomorrowData]) => {
        updateUI(todayData, tomorrowData);
    }).catch(() => displayError('Error fetching data'));
}


   function updateUI(data) {
    const display = document.getElementById('data-display');
    display.innerHTML = `
        <p><strong>Sunrise:</strong> ${formatTime(data.sunrise)}</p>
        <p><strong>Sunset:</strong> ${formatTime(data.sunset)}</p>
        <p><strong>Civil Dawn:</strong> ${formatTime(data.civil_twilight_begin)}</p>
        <p><strong>Civil Dusk:</strong> ${formatTime(data.civil_twilight_end)}</p>
        <p><strong>Day Length:</strong> ${formatDayLength(data.day_length)}</p>
        <p><strong>Solar Noon:</strong> ${formatTime(data.solar_noon)}</p>
    `;
}

function formatTime(timeString) {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDayLength(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

function displayError(message) {
    const display = document.getElementById('data-display');
    display.innerHTML = `<p class="error">${message}</p>`;
}

function fetchSunriseSunsetData(lat, lng, date) {
    const formattedDate = date.toISOString().split('T')[0];
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${formattedDate}&formatted=0`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                return data.results;
            } else {
                throw new Error('API Error');
            }
        });
}

function updateUI(todayData, tomorrowData) {
    const display = document.getElementById('data-display');
    display.innerHTML = `
        <h3>Today</h3>
        ${formatData(todayData)}
        <h3>Tomorrow</h3>
        ${formatData(tomorrowData)}
    `;
}

function formatData(data) {
    return `
        <p><strong>Sunrise:</strong> ${formatTime(data.sunrise)}</p>
        <p><strong>Sunset:</strong> ${formatTime(data.sunset)}</p>
        <p><strong>Civil Dawn:</strong> ${formatTime(data.civil_twilight_begin)}</p>
        <p><strong>Civil Dusk:</strong> ${formatTime(data.civil_twilight_end)}</p>
        <p><strong>Day Length:</strong> ${formatDayLength(data.day_length)}</p>
        <p><strong>Solar Noon:</strong> ${formatTime(data.solar_noon)}</p>
    `;
}


