let apiKey = "86bca7e68a1bdf77956b5e4ed10598f5";
let units = "metric";
let celsiusTemp = null;

//formates date from timestamp getted from weather api
function formateDate(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let day = days[date.getDay()];
  return `Last update: ${day}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
                <div class="weather-forecast-day">${formatDay(
                  forecastDay.dt
                )}</div>
              <img  
                    class="icon"
                    src="http://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png"
                    alt=""
                />
                <div class="weather-forecast-temperature">
                  <span class="weather-forecast-temp-max">${Math.round(
                    forecastDay.temp.max
                  )}°</span>
                  <span class="weather-forecast-temp-min">${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </div>
              </div>
            `;
    }
  });

  forecastHTML += `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

//get forecast for the next 5-7 days and call the function to display data
function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}&exclude=minutely,hourly`;

  axios.get(apiUrl).then(displayForecast);
}

//display the main info (temperature, wind etc.)
function displayTemperature(response) {
  celsiusTemp = Math.round(response.data.main.temp);
  let city = response.data.name;
  let country = response.data.sys.country;
  let description = response.data.weather[0].description;
  let wind = response.data.wind.speed;
  let humidity = response.data.main.humidity;

  let iconEl = document.querySelector("#icon");

  iconEl.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconEl.setAttribute("alt", description);
  document.querySelector("#date").innerHTML = formateDate(response.data.dt);
  document.querySelector("#main-temperature").innerHTML = celsiusTemp;
  document.querySelector("#city-name").innerHTML = `${city}, ${country}`;
  document.querySelector("#description").innerHTML = description;
  document.querySelector("#wind").innerHTML = `${Math.round(wind * 3.6)} km/h`;
  document.querySelector("#humidity").innerHTML = `${humidity} %`;

  getForecast(response.data.coord);
}

function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input").value;
  search(searchInput);
  celsiusLink.classList.add("active-link");
  fahrenheitLink.classList.remove("active-link");
}

function convertToFahrenheit(tempCelsius) {
  return Math.round((tempCelsius * 9) / 5 + 32);
}

function showFahrenheit() {
  let tempElement = document.querySelector("#main-temperature");
  tempElement.innerHTML = convertToFahrenheit(celsiusTemp);

  celsiusLink.classList.remove("active-link");
  fahrenheitLink.classList.add("active-link");
}

function showCelsius() {
  let tempElement = document.querySelector("#main-temperature");
  tempElement.innerHTML = celsiusTemp;
  celsiusLink.classList.add("active-link");
  fahrenheitLink.classList.remove("active-link");
}

function retrivePosition(position) {
  let userCoords = { lat: "", lon: "" };
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=${units}`;
  userCoords.lat = position.coords.latitude;
  userCoords.lon = position.coords.longitude;
  axios
    .get(`${apiUrl}&lat=${userCoords.lat}&lon=${userCoords.lon}`)
    .then(displayTemperature);
}
function error() {
  alert("Unable to retrieve your location");
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(retrivePosition, error);
}

search("Ternopil");
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsius);

let locationButton = document.querySelector(".location");
locationButton.addEventListener("click", getCurrentLocation);
