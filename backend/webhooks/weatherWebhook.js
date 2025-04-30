const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
import axios from "axios"
import dotenv from "dotenv"
dotenv.config();6
const API_KEY = process.env.WEATHER_API_KEY;
export const getWeather = async (req, res) => {
  const city = req.body.queryResult.parameters["geo-city"]; // Get the city from the Dialogflow query

  if (!city) {
    return res.json({
      fulfillmentText: "Sorry, I could not determine the city.",
    });
  }

  try {
    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric", // You can change units to 'imperial' for Fahrenheit
      },
    });

    const weather = weatherResponse.data;
    const temperature = weather.main.temp;
    const description = weather.weather[0].description;

    return res.json({
      fulfillmentText: `The weather in ${city} is currently ${description} with a temperature of ${temperature}°C.`,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return res.json({
      fulfillmentText:
        "Sorry, I could not fetch the weather data. Please try again later.",
    });
  }
};
