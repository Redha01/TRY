let button = document.getElementById("Weather-button");

let locationButton = document.getElementById("MY-location");

locationButton.addEventListener("click", getWeatherByLocation);

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function successCallback(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = "9ceb055852d21de16bac66dc03b3dea7";

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(resp => resp.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error("Error fetching current weather:", error);
        });

    fetch(forecastUrl)
        .then(resp => resp.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error("Error fetching forecast:", error);
        });
}

function errorCallback(error) {
    alert("Error getting location: " + error.message);
}



button.addEventListener("click" , getWeather);

function getWeather() {
    const apiKey = "9ceb055852d21de16bac66dc03b3dea7";
    const cityInput = document.getElementById("city");
    const city = document.getElementById("city").value;

    if (!city) {
        cityInput.focus();
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl) 
    .then(resp => resp.json())
    .then(data => {
        displayWeather(data);
    })
    .catch(error => {
        console.error("error: " + error);
    });

    fetch(forecastUrl) 
    .then(resp => resp.json())
    .then(data => {
        displayHourlyForecast(data.list);
    })
    .catch(error => {
        console.error("error: " + error);
    });
}

function displayWeather(data) {
    let tempdivinfo = document.querySelector('.temp-div');
    let weatherinfodiv = document.querySelector('.weather-info');
    let weathericon = document.getElementById('weather-icon');
    let HourlyForecastDiv = document.querySelector('.hourly-forecast');

    weatherinfodiv.innerHTML = '';
    HourlyForecastDiv.innerHTML = '';
    tempdivinfo.innerHTML = '';

    if (data.cod === "404") {
        weatherinfodiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        let cityName = data.name;
        let temperature = Math.round(data.main.temp - 273.15)
        let description = data.weather[0].description;
        let iconCode = data.weather[0].icon
        let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`

        let temperatureHTML = `
        <p>${temperature}°C</p>
        `;

        let weatherHTML = `
        <p>    ${cityName}    </p>
        <p>   ${description}     </p>
        `

        tempdivinfo.innerHTML = temperatureHTML;
        weatherinfodiv.innerHTML = weatherHTML;
        weathericon.alt = description;
        weathericon.src = iconUrl;

        showImage()
    }
}

function displayHourlyForecast(hourlyData) {
    let HourlyForecastDiv = document.querySelector('.hourly-forecast');
    const next24Hours = hourlyData.slice(0,8); // ← صححت: sclice ➜ slice

    next24Hours.forEach(item => {
        let dataTime = new Date(item.dt * 1000); // ← صححت: DataTransfer ➜ Date
        let hour = dataTime.getHours();
        let temperature = Math.round(item.main.temp - 273.15)
        let iconCode = item.weather[0].icon
        let iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`

        let hourlyItemHTML = `
        <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span> ${temperature}°C</span>
        </div>
        `;
        HourlyForecastDiv.innerHTML += hourlyItemHTML;
    });
}

function showImage() {
    let weathericon = document.getElementById('weather-icon');
    weathericon.style.display = "block";
}
