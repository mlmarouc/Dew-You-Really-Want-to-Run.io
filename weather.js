// Variable Declarations
let inputValue = document.querySelector('.inputValue');
let button = document.querySelector('.button');
let runMessage = document.querySelector('.runMessage');
let cityName = document.querySelector('.name');
let desc = document.querySelector('.desc');
let icon = document.querySelector('.icon');
let temp = document.querySelector('.temp');
let humid = document.querySelector('.humid');
let dew = document.querySelector('.dew');
let geolocationElement = document.querySelector('.geolocation');
let errorElement = document.querySelector('.error'); // Reference to the error element

document.getElementById('currentYear').textContent = new Date().getFullYear();

// Function to handle the weather data fetching and UI update
async function fetchWeatherData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    let nameValue = data.name;
    let tempValue = data.main.temp;
    let descValue = data.weather[0].description;
    let humidValue = data.main.humidity;
    let weatherIcon = data.weather[0].icon;

    tempValue = Math.round((tempValue - 273.15) * 9 / 5 + 32);

    function calculateDewPoint(temperature, humidity) {
      const tempC = (temperature - 32) * 5 / 9;
      const a = 17.27;
      const b = 237.7;
      const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100.0);
      const dewPointC = (b * alpha) / (a - alpha);
      const dewPointF = (dewPointC * 9 / 5) + 32;
      return dewPointF.toFixed(0);
    }

    let capitalizedCityName = capitalizeFirstLetter(nameValue);
    let capitalizedDescValue = capitalizeFirstLetters(descValue);

    const temperature = tempValue;
    const humidity = humidValue;
    const dewPoint = calculateDewPoint(temperature, humidity);

    cityName.innerHTML = capitalizedCityName;
    temp.innerHTML = `Temperature: ${tempValue}°F`;
    desc.innerHTML = capitalizedDescValue;
    humid.innerHTML = `Humidity: ${humidValue}%`;
    dew.innerHTML = `Dew point: ${dewPoint}°`;

    if (dewPoint < 55) {
      dew.innerHTML += '<br>Dry. Running is unaffected.';
      runMessage.innerHTML = "Run your little heart out!";
    } else if (dewPoint >= 55 && dewPoint < 60) {
      dew.innerHTML += '<br>Dry and comfortable.';
      runMessage.innerHTML = "Easy runs are a breeze, but hard ones might break a sweat.";
    } else if (dewPoint >= 60 && dewPoint < 65) {
      dew.innerHTML += '<br>Getting sticky.';
      runMessage.innerHTML = "Easy runs are tricksy, and hard ones are a workout.";
    } else if (dewPoint >= 65 && dewPoint < 70) {
      dew.innerHTML += "<br>Unpleasant. Lots of moisture in the air.";
      runMessage.innerHTML = 'Ew. Easy runs are a struggle, and hard ones are like a sauna. Sweaty spaghetti.';
    } else if (dewPoint >= 70 && dewPoint < 75) {
      dew.innerHTML += '<br>Uncomfortable and oppressive.';
      runMessage.innerHTML = 'Prepare yourself. Easy runs are tough and hard runs will be like running into Mordor.';
    } else if (dewPoint >= 75 && dewPoint < 80) {
      dew.innerHTML += '<br>Dangerous. Hard runs not recommended.';
      runMessage.innerHTML = 'Danger zone! Run at your own risk.';
    } else if (dewPoint >= 80) {
      dew.innerHTML += '<br>Deadly. Running not recommended.';
      runMessage.innerHTML = "Running not recommended. It's hotter than the devil's taint. Save yourself.";
    }

    let iconElement = document.createElement('img');
    iconElement.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

    while (icon.firstChild) {
      icon.removeChild(icon.firstChild);
    }
    icon.appendChild(iconElement);

    errorElement.textContent = '';
  } catch (err) {
    console.error('Error fetching weather data:', err);
    errorElement.textContent = 'Search must be in the form of a city or a valid zip code.';
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

    if (geolocationElement) {
      geolocationElement.textContent = `Latitude: ${latitude.toFixed(2)}, Longitude: ${longitude.toFixed(2)}`;
    }
  } catch (error) {
    console.error('Error getting geolocation:', error);
  }
}

// Invoke fetchWeatherByGeolocation() when the page loads
window.addEventListener('load', fetchWeatherByGeolocation);

// Event listener for Submit button click
button.addEventListener('click', async function (event) {
  event.preventDefault();
  await handleUserInput();
});

// Event listener for Enter key press
inputValue.addEventListener('keydown', async function (event) {
  if (event.key === 'Enter') {
    await handleUserInput();
  }
});

// Function to handle user input
async function handleUserInput() {
  const query = inputValue.value.trim();
  const apiKey = '65a83fc7b17ba173851ff67b47c624be';
  let url;

  if (isZipCode(query)) {
    url = `https://api.openweathermap.org/data/2.5/weather?zip=${query}&appid=${apiKey}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}`;
  }

  await fetchWeatherData(url);
}

// Function to check if a string is a valid zip code
function isZipCode(query) {
  return /^\d{5}$/.test(query);
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to capitalize the first letter of each word in a string
function capitalizeFirstLetters(string) {
  return string.split(' ').map(capitalizeFirstLetter).join(' ');
}

// Add the best time of the day to run/day of the week
// Fix city, state
// Current location faster

// API with AccuWeather
// // Select necessary elements
// const inputValue = document.querySelector('.inputValue');
// const button = document.querySelector('.button');
// const runMessage = document.querySelector('.runMessage');
// const cityName = document.querySelector('.name');
// const desc = document.querySelector('.desc');
// const icon = document.querySelector('.icon');
// const temp = document.querySelector('.temp');
// const humid = document.querySelector('.humid');
// const dew = document.querySelector('.dew');
// const geolocationElement = document.querySelector('.geolocation');
// const errorElement = document.querySelector('.error'); // Reference to the error element

// const apiKey = 'k8MslyDGUvV8KgKMCqMOYv9o3SoZHid8';

// // Function to get the location key for a city
// async function getLocationKey(city) {
//     const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     if (data.length > 0) {
//         return data[0].Key; // Return the location key of the first result
//     } else {
//         throw new Error('City not found');
//     }
// }

// // Function to get the location key for latitude and longitude
// async function getLocationKeyByCoords(lat, lon) {
//     const url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${lon}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     if (data && data.Key) {
//         return data; // Return the location data
//     } else {
//         throw new Error('Location not found');
//     }
// }

// // Function to get the current conditions for a location key
// async function getCurrentConditions(locationKey) {
//     const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`;
//     const response = await fetch(url);
//     const data = await response.json();
//     if (data.length > 0) {
//         return data[0]; // Return the current conditions data
//     } else {
//         throw new Error('Current conditions not found');
//     }
// }

// // Function to fetch weather data for a city
// async function fetchWeatherData(city) {
//     try {
//         const locationKey = await getLocationKey(city);
//         const currentConditions = await getCurrentConditions(locationKey);
//         console.log(currentConditions);

//         // Extract required data
//         const nameValue = city;
//         const tempValue = currentConditions.Temperature.Imperial.Value;
//         const descValue = currentConditions.WeatherText;
//         const humidValue = currentConditions.RelativeHumidity;
//         const weatherIcon = currentConditions.WeatherIcon;

//         // Calculate dew point (example calculation, may need adjustment)
//         const dewPoint = calculateDewPoint(tempValue, humidValue);

//         // Capitalize city name and description
//         const capitalizedCityName = capitalizeFirstLetter(nameValue);
//         const capitalizedDescValue = capitalizeFirstLetters(descValue);

//         // Update the UI
//         cityName.innerHTML = capitalizedCityName;
//         temp.innerHTML = `Temperature: ${tempValue}°F`;
//         desc.innerHTML = capitalizedDescValue;
//         humid.innerHTML = `Humidity: ${humidValue}%`;
//         dew.innerHTML = `Dew point: ${dewPoint}°`;

//         // Update run message
//         updateRunMessage(dewPoint);

//         // Create the weather icon element
//         const iconElement = document.createElement('img');
//         iconElement.src = `https://developer.accuweather.com/sites/default/files/${weatherIcon}-s.png`;

//         // Remove any existing weather icons
//         while (icon.firstChild) {
//             icon.removeChild(icon.firstChild);
//         }

//         // Add the weather icon to the UI
//         icon.appendChild(iconElement);

//         // Error input message
//         errorElement.textContent = '';
//     } catch (err) {
//         console.error('Error fetching weather data:', err);
//         // Display the error message on the website
//         errorElement.textContent = 'Search must be in the form of a city.';
//     }
// }

// // Function to fetch weather data based on current location
// async function fetchWeatherByGeolocation() {
//     try {
//         navigator.geolocation.getCurrentPosition(async (position) => {
//             const latitude = position.coords.latitude;
//             const longitude = position.coords.longitude;
//             const locationData = await getLocationKeyByCoords(latitude, longitude);
//             const locationKey = locationData.Key;
//             const cityNameValue = locationData.LocalizedName;
//             const currentConditions = await getCurrentConditions(locationKey);
//             console.log(currentConditions);

//             // Extract required data
//             const tempValue = currentConditions.Temperature.Imperial.Value;
//             const descValue = currentConditions.WeatherText;
//             const humidValue = currentConditions.RelativeHumidity;
//             const weatherIcon = currentConditions.WeatherIcon;

//             // Calculate dew point (example calculation, may need adjustment)
//             const dewPoint = calculateDewPoint(tempValue, humidValue);

//             // Capitalize city name and description
//             const capitalizedCityName = capitalizeFirstLetter(cityNameValue);
//             const capitalizedDescValue = capitalizeFirstLetters(descValue);

//             // Update the UI
//             cityName.innerHTML = capitalizedCityName;
//             temp.innerHTML = `Temperature: ${tempValue}°F`;
//             desc.innerHTML = capitalizedDescValue;
//             humid.innerHTML = `Humidity: ${humidValue}%`;
//             dew.innerHTML = `Dew point: ${dewPoint}°`;

//             // Update run message
//             updateRunMessage(dewPoint);

//             // Create the weather icon element
//             const iconElement = document.createElement('img');
//             iconElement.src = `https://developer.accuweather.com/sites/default/files/${weatherIcon}-s.png`;

//             // Remove any existing weather icons
//             while (icon.firstChild) {
//                 icon.removeChild(icon.firstChild);
//             }

//             // Add the weather icon to the UI
//             icon.appendChild(iconElement);

//             // Error input message
//             errorElement.textContent = '';
//         }, (error) => {
//             console.error('Error getting geolocation:', error);
//             errorElement.textContent = 'Unable to retrieve your location.';
//         });
//     } catch (error) {
//         console.error('Error fetching weather data for geolocation:', error);
//         errorElement.textContent = 'Could not fetch weather data for your location.';
//     }
// }

// // Event listener for Submit button click
// button.addEventListener('click', async function(event) {
//     event.preventDefault(); // Prevent form submission

//     if (inputValue.value) {
//         const city = inputValue.value;
//         await fetchWeatherData(city);
//     } else {
//         errorElement.textContent = 'Please enter a city name.';
//     }
// });

// // Event listener for Enter key press
// inputValue.addEventListener('keydown', async function(event) {
//     if (event.key === 'Enter') {
//         if (inputValue.value) {
//             const city = inputValue.value;
//             await fetchWeatherData(city);
//         } else {
//             errorElement.textContent = 'Please enter a city name.';
//         }
//     }
// });

// // // Function to calculate the dew point
// // function calculateDewPoint(temperature, humidity) {
// //     const a = 17.62;
// //     const b = 243.12;
// //     const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100.0);
// //     const dewPoint = (b * alpha) / (a - alpha);
// //     return dewPoint.toFixed(0); // Return dew point with 0 decimal places
// // }

// function calculateDewPoint(temperature, humidity) {
//   // Convert temperature from Fahrenheit to Celsius
//   const tempC = (temperature - 32) * 5 / 9;
  
//   // Constants for Magnus formula
//   const a = 17.27;
//   const b = 237.7;
  
//   // Calculate alpha term
//   const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100.0);
  
//   // Calculate dew point in Celsius
//   const dewPointC = (b * alpha) / (a - alpha);
  
//   // Convert dew point back to Fahrenheit
//   const dewPointF = (dewPointC * 9 / 5) + 32;
  
//   return dewPointF.toFixed(0); // Return dew point with 0 decimal places
// }


// // Function to capitalize the first letter of a string
// function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }

// // Function to capitalize the first letter of each word in a string
// function capitalizeFirstLetters(string) {
//     let words = string.split(' ');
//     for (var i = 0; i < words.length; i++) {
//         words[i] = capitalizeFirstLetter(words[i]);
//     }
//     return words.join(' ');
// }

// // Function to update the run message based on the dew point
// function updateRunMessage(dewPoint) {
//     if (dewPoint < 55) {
//         dew.innerHTML += '<br>Dry. Running is unaffected.';
//         runMessage.innerHTML = "Run your little heart out!";
//     } else if (dewPoint >= 55 && dewPoint < 60) {
//         dew.innerHTML += '<br>Dry and comfortable.';
//         runMessage.innerHTML = "Easy runs are a breeze, but hard ones might break a sweat.";
//     } else if (dewPoint >= 60 && dewPoint < 65) {
//         dew.innerHTML += '<br>Getting sticky.';
//         runMessage.innerHTML = "Easy runs are tricksy, and hard ones are a workout.";
//     } else if (dewPoint >= 65 && dewPoint < 70) {
//         dew.innerHTML += "<br>Unpleasant. Lots of moisture in the air.";
//         runMessage.innerHTML = 'Ew. Easy runs are a struggle, and hard ones are like a sauna. Sweaty spaghetti.';
//     } else if (dewPoint >= 70 && dewPoint < 75) {
//         dew.innerHTML += '<br>Uncomfortable and oppressive.';
//         runMessage.innerHTML = 'Prepare yourself. Easy runs are tough and hard runs will be like running into Mordor.';
//     } else if (dewPoint >= 75 && dewPoint < 80) {
//         dew.innerHTML += '<br>Dangerous. Hard runs not recommended.';
//         runMessage.innerHTML = 'Danger zone! Run at your own risk.';
//     } else if (dewPoint >= 80) {
//         dew.innerHTML += '<br>Deadly. Running not recommended.';
//         runMessage.innerHTML = "Running not recommended. It's hotter than the devil's taint. Save yourself.";
//     }
// }

// // Automatically fetch weather data for current location on page load
// window.addEventListener('load', fetchWeatherByGeolocation);

