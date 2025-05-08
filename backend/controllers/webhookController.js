import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = process.env.WEATHER_API_KEY;

// ---------- Weather Handler ----------
const getWeather = async (city) => {
  try {
    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const weather = weatherResponse.data;
    const temperature = weather.main.temp;
    const description = weather.weather[0].description;

    return `The weather in ${city} is currently ${description} with a temperature of ${temperature}°C.`;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return `Sorry, I could not fetch the weather data for ${city}.`;
  }
};

// ---------- Crop Info Handler ----------
const getCropInfo = (cropName) => {
  const filePath = path.resolve("data/crops.json");
  const crops = JSON.parse(fs.readFileSync(filePath));
  const crop = crops[cropName];
  //console.log(crop)
  if (!crop) return `Sorry, I don't have information about ${cropName}.`;

  return `${cropName.toUpperCase()}:\n${crop.description}\nClimate: ${
    crop.climate
  }\nSoil: ${crop.soil}\nPests: ${crop.pests}`;
};

// ---------- Market Price Handler ----------
const getMarketPrice = (cropName) => {
  try {
    const filePath = path.resolve("data/marketPrices.json");
    const prices = JSON.parse(fs.readFileSync(filePath));

    const crop = prices[cropName];
    if (!crop) {
      console.log("Crop not found in market data:", cropName);
      return `Sorry, I don't have market price data for ${cropName}.`;
    }

    return `The current market price of ${cropName} is ${crop.price} at ${crop.market}.`;
  } catch (error) {
    console.error("Market price fetch error:", error);
    return "Error fetching market price data.";
  }
};

// ---------- Main Webhook Handler ----------
export const handleWebhook = async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters;
  console.log(intent);
  console.log(parameters);

  if (intent === "get_crop_info") {
    const cropName = parameters["crop-name"]?.toLowerCase().trim();
    const response = getCropInfo(cropName);
    // console.log("Intent:", intent);
    // console.log("Parameters:", parameters);
    // console.log("Crop name:", parameters["crop-name"]); // for crop

    return res.json({ fulfillmentText: response });
  }

  if (intent === "get_weather") {
    const city = parameters["geo-city"];
    const response = await getWeather(city);
    console.log("Intent:", intent);
    return res.json({ fulfillmentText: response });
  }

  if (intent === "get_market_price") {
    const cropName = parameters["crop-name"]?.toLowerCase().trim();
    const response = getMarketPrice(cropName);
    //console.log("Resolved crop price:", cropName, response);
    //console.log("Intent:", intent);
    return res.json({ fulfillmentText: response });
  }

  // Fallback
  return res.json({
    fulfillmentText: "Sorry, I couldn’t understand your request.",
  });
};
export const webhook = async (req, res) => {
  const query = req.body.queryResult.queryText;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "ayansh03/agribot",
      prompt: query,
      stream: false,
    });
     
    const agribotReply = response.data.response;

    return res.json({
      fulfillmentText: agribotReply,
    });
  } catch (error) {
    console.error("Error from agribotto:", error.message);
    return res.json({
      fulfillmentText: "Sorry couldnot fetch",
    });
  }
};
