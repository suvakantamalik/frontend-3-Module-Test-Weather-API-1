const headingDiv = document.getElementById("headingDiv");

const key = "5934b679b1b2ebabe03a40919634c51d";
document.getElementById("fetchButton").addEventListener("click", fetchData);

function fetchData() {
  showLoading();

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
  }
  else{
    alert("Geolocation is not supported by your browser.");
  }
}

function successCallBack(position){
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

  editHeadingDiv(latitude, longitude);

  displayMap(latitude, longitude);

  fetchWeatherData(latitude, longitude);
}

function errorCallBack(error){
  hideLoading();
  alert(`Error fetching  geolocation: ${error.message}`);
}

function editHeadingDiv(latitude, longitude){

  headingDiv.innerHTML = `
    <h2>Welcome To The Weather App</h2> <br>
    <p>Here is your current location</p><br>
    <h4 class="long-lat">Lat: ${latitude}</h4>
    <h4 class="long-lat">Long: ${longitude}</h4>
  `;
}
function displayMap(latitude, longitude){
  const mapSection = document.getElementById("mapSection");
  mapSection.innerHTML = `
        <iframe width="100%" height="100%" frameborder="0" style="border: 0"
        src="https://www.openstreetmap.org/export/embed.html?bbox=
        ${longitude - 0.05},${latitude - 0.05},${longitude + 0.05},${latitude + 0.05}&marker=${latitude},${longitude}"
        allowfullscreen></iframe>
        <br/>
        <small><a href="https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=12/${latitude}/${longitude}" target="_blank">View Larger Map</a></small>
  `;
}

function fetchWeatherData(latitude, longitude){
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`;

  fetch(url)
    .then((response) => {
      if(!response.ok){
        throw new Error(
          `API error: ${response.status} - ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displayWeatherData(data);
    })
    .catch((error) => {
      hideLoading();
      console.log("Error fetching weather data: ", error);
      alert(`Could not fetch weather data. Error:${error.message}. 
            Please try again later.`);
    })
}

function displayWeatherData(data){
  hideLoading();
  const weatherSection = document.getElementById("weatherSection");

  weatherSection.style.display = "block";

  const location = data.name;
  const windSpeed = data.wind.speed * 3.6;
  const humidity = data.main.humidity;

  let timezone = data.timezone;
  timezone = convertTimezone(timezone);
  
  const pressure = data.main.pressure * 0.00001;
  
  const windDegree = data.wind.deg;
  const windDirection = convertWindDirection(windDegree);
  
  // const uvIndex = current.uvi;
  // console.log(uvIndex)
  const temp = data.main.feels_like;
  


  weatherSection.innerHTML = `
  <div class="weatherSectionSubSec">
    <h2>Your Weather Data</h2>  
  
    <div id="weatherSectionHeading">
      <p>Location: ${location}</p>
      <p>Wind Speed: ${windSpeed} kmph</p>
      <p>Humidity: ${humidity}%</p>
      <p>Time Zone: ${timezone}</p>
      <p>Pressure: ${pressure.toFixed(2)} atm</p>
      <p>Wind Direction : ${windDirection}</p>

      <p>Feels like: ${temp.toFixed(2)}°</p>      
    </div> 
  </div>
  `;
}

function convertWindDirection(deg) {
  const directions = ['North', 'North East', 'East', 'South East ', 'South', 'South West', 'West', 'North West'];
  const index = Math.floor((deg + 22.5) / 45) % 8;
  return directions[index];
}

function convertTimezone(timezone) {
  const offset = timezone / 3600; // Convert seconds to hours
  const hours = Math.floor(offset);
  const minutes = Math.abs((offset % 1) * 60);

  let sign = '+';
  if (hours < 0) {
    sign = '-';
  }

  return `GMT ${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function showLoading(){
  const loadingSection = document.getElementById("loading");
  loadingSection.style.display = "block";
}

function hideLoading(){
  const loadingSection = document.getElementById("loading");
  loadingSection.style.display = "none";
}