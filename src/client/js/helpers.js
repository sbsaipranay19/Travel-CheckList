import { getGeoData, getWeatherData, getPixabayImage } from "./APIrequests";

// get user input
const getUserInput = () => {
  const city = document.getElementById("city").value.toLowerCase();
  const startDate = document
    .getElementById("startDate")
    .value.split("-")
    .join("/");
  const endDate = document.getElementById("endDate").value.split("-").join("/");
  return {
    city,
    startDate,
    endDate,
  };
};

// build objects
const buildTripObject = (geoData, weatherData, imagesData) => {
  return {
    city: geoData.geonames[0].toponymName,
    country: geoData.geonames[0].countryName,
    countryCode: geoData.geonames[0].countryCode,
    lat: geoData.geonames[0].lat,
    lng: geoData.geonames[0].lng,
    population: geoData.geonames[0].population,
    weather: weatherData.data[0].weather,
    weather: {
      ...weatherData.data[0].weather,
      temp: weatherData.data[0].temp,
    },
    imageURL: imagesData.hits[0].largeImageURL,
    startDate: getUserInput().startDate,
    endDate: getUserInput().endDate,
    duration: calculateTripDuration(),
  };
};

const buildTripsView = () => {
  const trips = getLocalTrips();

  const tripsContainer = document.getElementById("trips__container");
  tripsContainer.textContent = "";
  const fragment = document.createDocumentFragment(); 

  for (let trip of trips) {
    const newElement = document.createElement("div");
    newElement.innerHTML = `
          <div class="trip-image__container">
            <img class="trip-image" src="${trip.imageURL}" alt="logo">
          </div>
          <div class="trip-description__container">
            <p> <strong>${trip.city}</strong>, ${trip.country} </p>
            <p> Trip duration: <strong>${trip.duration}</strong> days</p>
            <p> Departure: <strong>${trip.startDate}</strong></p>
            <p> Return: <strong>${trip.endDate}</strong></p>

          <div class="trip-weather__container">
            <h2>Weather predictions:</h2>
                        <img class="weather-icon" src="https://www.weatherbit.io/static/img/icons/${
                          trip.weather.icon
                        }.png" alt="weather-icon">
              ${trip.weather.temp.toFixed()} °C, ${trip.weather.description}
          </div>
         
          
          <button id="${
            trip.id
          }" class="card-button remove-button" onclick="Client.removeTrip(event)">Remove</button>
       `;

    newElement.classList.add("trip__card");
    newElement.classList.add("trip__card-small");

    fragment.appendChild(newElement);
  }

  tripsContainer.appendChild(fragment); 
};

const buildAddTripView = (trip) => {
  document.getElementById("new-trip").style.display = "flex";

  const tripContainer = document.getElementById("new-trip__container");
  tripContainer.textContent = "";
  const newElement = document.createElement("div");
  newElement.innerHTML = `
          <div class="trip-image__container">
            <img class="trip-image" src="${trip.imageURL}" alt="logo">
          </div>
          <div class="trip-description__container">
           <p> <strong>${trip.city}</strong>, ${trip.country} </p>
            <p> Trip duration: <strong>${trip.duration}</strong> days</p>
            <p> Departure: <strong>${trip.startDate}</strong></p>
            <p> Return: <strong>${trip.endDate}</strong></p>
          <div class="trip-weather__container">
            <h2>Weather predictions:</h2>
                        <img class="weather-icon" src="https://www.weatherbit.io/static/img/icons/${
                          trip.weather.icon
                        }.png" alt="weather-icon">
              ${trip.weather.temp.toFixed()} °C, ${trip.weather.description}
          </div>
          <button class="card-button add-button" onclick="Client.addTrip()">Add trip</button>
       `;
  newElement.classList.add("trip__card");

  tripContainer.appendChild(newElement);
};


const requestDataFromAPIs = async (city) => {
  const geoData = await getGeoData(city);

  if (!geoData.totalResultsCount) {
    return alert("Please enter a valid city!");
  }

  let [weatherData, imagesData] = await Promise.all([
    getWeatherData(city),
    getPixabayImage(city),
  ]);

  if (!imagesData.totalHits) {
    imagesData = await getPixabayImage(geoData.geonames[0].countryName);
  }

  return { geoData, weatherData, imagesData };
};

// set trips
const setLocalTrips = (trips) => {
  localStorage.removeItem("trips");
  localStorage.setItem("trips", JSON.stringify(trips));
};

// get trips
const getLocalTrips = () => {
  return JSON.parse(localStorage.getItem("trips"));
};

// trip duration
const calculateTripDuration = () => {
  const { startDate, endDate } = getUserInput();
  const tripStart = new Date(startDate);
  const tripEnd = new Date(endDate);
  return Math.ceil(Math.abs(tripEnd - tripStart) / (1000 * 60 * 60 * 24));
};

export {
  getUserInput,
  buildTripObject,
  buildTripsView,
  buildAddTripView,
  requestDataFromAPIs,
  setLocalTrips,
  getLocalTrips,
};
