import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await axios.get(
       ` https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('City not found or API error');
      setWeather(null);
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-indigo-200 to-purple-300 flex flex-col items-center justify-center px-4 py-8">
      <motion.h2
        className="text-4xl font-bold text-indigo-800 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Weather Forecast
      </motion.h2>

      <form
        onSubmit={fetchWeather}
        className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full max-w-xl"
      >
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Get Weather
        </button>
      </form>

      {error && (
        <motion.p
          className="text-red-600 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {weather && (
        <motion.div
          className="bg-white shadow-xl rounded-xl p-6 w-full max-w-xl text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-semibold text-indigo-800">
            {weather.name}, {weather.sys.country}
          </h3>

          <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>

          <div className="flex justify-center items-center space-x-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="w-16 h-16"
            />
            <div>
              <p className="text-xl font-bold">
                {weather.main.temp}°C
              </p>
              <p className="capitalize text-gray-600">
                {weather.weather[0].description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700 mt-4">
            <div>
              <p className="font-semibold">Humidity</p>
              <p>{weather.main.humidity}%</p>
            </div>
            <div>
              <p className="font-semibold">Wind</p>
              <p>{weather.wind.speed} m/s</p>
            </div>
            <div>
              <p className="font-semibold">Pressure</p>
              <p>{weather.main.pressure} hPa</p>
            </div>
            <div>
              <p className="font-semibold">Sunrise</p>
              <p>{formatTime(weather.sys.sunrise)}</p>
            </div>
            <div>
              <p className="font-semibold">Sunset</p>
              <p>{formatTime(weather.sys.sunset)}</p>
            </div>
            <div>
              <p className="font-semibold">Feels like</p>
              <p>{weather.main.feels_like}°C</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Weather;