
document.getElementById('current-location').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            fetchData(lat, lng);
        }, showError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

document.getElementById('search-location').addEventListener('click', function() {
    const location = document.getElementById('location-search').value;
    fetch(`https://geocode.maps.co/search?q=${location}`).then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            fetchData(lat, lon);
        } else {
            showError("Location not found");
        }
    }).catch(showError);
});

function fetchData(lat, lng) {
    fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'OK') {
            updateUI(data.results);
        } else {
            showError("Error fetching sunrise and sunset data");
        }
    }).catch(showError);
}

function updateUI(data) {
    const display = document.getElementById('data-display');
    display.innerHTML = `<p>Sunrise: ${new Date(data.sunrise).toLocaleTimeString()}</p>
                         <p>Sunset: ${new Date(data.sunset).toLocaleTimeString()}</p>`;
    // Add more data processing and UI updates here
}

function showError(error) {
    alert(typeof error === 'string' ? error : "An error occurred");
}
