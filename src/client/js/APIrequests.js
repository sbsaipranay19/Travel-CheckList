//URL and API Key of GeoNames Web Service
const geonamesBaseURL =
  "https://secure.geonames.org/searchJSON?formatted=true&q=";
const geonamesUsername = "&username=hardik100";

//URL and API Key of WeatherBit
const weatherbitBaseURL = "https://api.weatherbit.io/v2.0/current?city=";
const weatherbitAPIKey = "d3b3314ebbdd44f48c31198b36d11db9";

//URL and API Key of Pixabay
const pixabayURL = "https://pixabay.com/api/";
const pixabayAPIKey = "16683047-bf5b77e8ce69745020c843720";

const baseURL =  "http://127.0.01:8000";

//get data from geonames api
const getGeoData = async (city) => {
  if (!city) alert("You must enter a city");
  const geonamesEndpoint = `${geonamesBaseURL}${city}${geonamesUsername}`;
  try {
    const response = await fetch(geonamesEndpoint);
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

// get data from weatherbit api
const getWeatherData = async (city) => {
  if (!city) alert("You must enter a city");
  const weatherbitEndpoint = `${weatherbitBaseURL}${city}&key=${weatherbitAPIKey}`;
  try {
    const response = await fetch(weatherbitEndpoint);
    if (response) return response.json();
  } catch (error) {
    console.error(error);
  }
};

//get image from pixabay image
const getPixabayImage = async (location) => {
  try {
    const pixabayEndpoint = `${pixabayURL}?key=${pixabayAPIKey}&q=${location}&image_type=photo&pretty=true&category=places`;
    let response = await fetch(pixabayEndpoint);
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

//get trips
const getTrips = async () => {
  try {
    const trips = await fetch(`${baseURL}/trips`);
    return trips.json();
  } catch (error) {
    console.error(error);
  }
};

//set trips
const postTrip = async (trip) => {
  try {
    const trips = await fetch(`${baseURL}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trip }),
    });
    return trips.json();
  } catch (error) {
    console.error(error);
  }
};

//remove trips
const deleteTrip = async (tripId) => {
  try {
    const trips = await fetch(`${baseURL}/trips/${tripId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return trips.json();
  } catch (error) {
    console.error(error);
  }
};

export {
  getGeoData,
  getWeatherData,
  getPixabayImage,
  getTrips,
  postTrip,
  deleteTrip,
};
