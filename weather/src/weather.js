// Variable Declarations
var inputValue = document.querySelector('.inputValue');
var button = document.querySelector('.button');
var runMessage = document.querySelector('.runMessage');
var cityName = document.querySelector('.name');
var desc = document.querySelector('.desc');
var icon = document.querySelector('.icon');
var temp = document.querySelector('.temp');
var humid = document.querySelector('.humid');
var dew = document.querySelector('.dew');
var geolocationElement = document.querySelector('.geolocation');
var errorElement = document.querySelector('.error'); // Reference to the error element

// Function to handle the weather data fetching and UI update
async function fetchWeatherData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    var nameValue = data['name'];
    var tempValue = data['main']['temp'];
    var descValue = data['weather'][0]['description'];
    var humidValue = data['main']['humidity'];
    var weatherIcon = data['weather'][0]['icon'];

    console.log(descValue);

    tempValue = Math.round((data.main.temp - 273.15) * 9 / 5 + 32);

    // API provides temperature and relative humidity data
    function calculateDewPoint(temperature, humidity) {
      const a = 17.27;
      const b = 237.7;
      const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100.0);
      const dewPoint = (b * alpha) / (a - alpha);
      return dewPoint.toFixed(0); // Return dew point with 0 decimal places
    }

    // Capitalize the first letter of the city name
    var capitalizedCityName = capitalizeFirstLetter(nameValue);
    // Capitalize the first letters of the description
    var capitalizedDescValue = capitalizeFirstLetters(descValue);

    // Extract temperature and humidity from the API response
    const temperature = tempValue;
    const humidity = humidValue;

    // Calculate the dew point
    const dewPoint = calculateDewPoint(temperature, humidity);

    // Update the UI with the fetched data
    cityName.innerHTML = capitalizedCityName;
    temp.innerHTML = `Temperature: ${tempValue}°F`;
    desc.innerHTML = capitalizedDescValue;
    humid.innerHTML = `Humidity: ${humidValue}%`;
    dew.innerHTML = `Dew point: ${dewPoint}°`;

    // Check the dew point ranges and display the corresponding message
if (dewPoint <55) {
  dew.innerHTML += '<br>Dry. Running is unaffected.';
  runMessage.innerHTML = "Run your little heart out!";
} else if (dewPoint >= 55 && dewPoint < 60) {
  dew.innerHTML += '<br>Dry and comfortable.';
  runMessage.innerHTML = "Easy runs are a breeze, but hard ones might break a sweat.";
} else if (dewPoint >= 60 && dewPoint < 65) {
  dew.innerHTML += '<br>Getting sticky.';
  runMessage.innerHTML = "Easy runs are tricksy, and hard ones are a workout in themselves.";
} else if (dewPoint >= 65 && dewPoint < 70) {
  dew.innerHTML += "<br>Unpleasant. There's lots of moisture in the air.";
  runMessage.innerHTML = 'Ew. Easy runs are a struggle, and hard ones are like a sauna. Sweaty spaghetti.';
} else if (dewPoint >= 70 && dewPoint <75) {
  dew.innerHTML += '<br>It is uncomfortable and oppressive.';
  runMessage.innerHTML = 'Prepare yourself. Easy runs are tough and hard runs will be like running into Mordor.';
} else if (dewPoint >75 && dewPoint <80) {
  dew.innerHTML += '<br>Dangerous. Hard runs not recommended.';
  runMessage.innerHTML = 'Danger zone! Run at your own risk.';
} else if (dewPoint >=80) {
  dew.innerHTML += '<br>Deadly. Running not recommended.';
  runMessage.innerHTML = "Running not recommended. It's hotter than the devil's taint. Save yourself.";
}

    // Create the weather icon element
    var iconElement = document.createElement('img');
    iconElement.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

    // Remove any existing weather icons
    while (icon.firstChild) {
      icon.removeChild(icon.firstChild);
    }

    // Add the weather icon to the UI
    icon.appendChild(iconElement);
    
    //Error input message
    errorElement.textContent = '';
  } catch (err) {
    // Display the error message on the website
    errorElement.textContent = 'Search must be in the form of a city.';
  }
}

// Function to fetch weather data based on geolocation
async function fetchWeatherByGeolocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiKey = '65a83fc7b17ba173851ff67b47c624be';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    await fetchWeatherData(url);

    // Display geolocation information
    geolocationElement.textContent = `Latitude: ${latitude.toFixed(2)}, Longitude: ${longitude.toFixed(2)}`;
  } catch (error) {
    console.error('Error getting geolocation:', error);
    // Provide a default location or handle the error as needed
  }
}

// Invoke fetchWeatherByGeolocation() when the page loads
window.addEventListener('load', fetchWeatherByGeolocation);

// Event listener for Submit button click
button.addEventListener('click', async function(event) {
  event.preventDefault(); // Prevent form submission

  if (inputValue.value) {
    const city = inputValue.value;
    const apiKey = '65a83fc7b17ba173851ff67b47c624be';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    await fetchWeatherData(url);
  } else {
    await fetchWeatherByGeolocation();
  }
});

// Event listener for Enter key press
inputValue.addEventListener('keydown', async function(event) {
  if (event.key === 'Enter') {
    if (inputValue.value) {
      const city = inputValue.value;
      const apiKey = '65a83fc7b17ba173851ff67b47c624be';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
      await fetchWeatherData(url);
    } else {
      await fetchWeatherByGeolocation();
    }
  }
});

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to capitalize the first letter of each word in a string
function capitalizeFirstLetters(string) {
  var words = string.split(' ');
  for (var i = 0; i < words.length; i++) {
    words[i] = capitalizeFirstLetter(words[i]);
  }
  return words.join(' ');
}



//Add the best time of the day to run/day of the week
//Better icons?
//Fix city, state, zip
//Current location faster

