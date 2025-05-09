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
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-300 to-fuchsia-300 flex flex-col items-center px-4 pt-28 pb-10">
      <motion.h2
        className="text-4xl sm:text-5xl font-extrabold text-indigo-900 drop-shadow-md text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Weather Forecast
      </motion.h2>

      <motion.p
        className="mt-2 text-indigo-800/90 text-lg text-center max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Stay informed with real-time weather updates — know before you go!
      </motion.p>

      <form
        onSubmit={fetchWeather}
        className="w-full max-w-lg flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8"
      >
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="flex-1 px-4 py-2 rounded-lg shadow-md border-none focus:ring-4 focus:ring-purple-400"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg font-medium hover:bg-fuchsia-700 transition"
        >
          Search
        </button>
      </form>

      {error && (
        <motion.p
          className="text-red-600 mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {weather && (
        <motion.div
          className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-3xl shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-semibold text-fuchsia-700">
                {weather.name}, {weather.sys.country}
              </h3>
              <p className="text-gray-600 text-sm">{new Date().toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-4">
              <motion.img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="icon"
                className="w-20 h-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
              <div>
                <p className="text-3xl font-bold text-indigo-700">{weather.main.temp}°C</p>
                <p className="capitalize text-gray-600 text-sm">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-sm text-gray-700">
            <div className="text-center">
              <p className="font-semibold text-purple-800">Humidity</p>
              <p>{weather.main.humidity}%</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-purple-800">Wind</p>
              <p>{weather.wind.speed} m/s</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-purple-800">Pressure</p>
              <p>{weather.main.pressure} hPa</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-purple-800">Sunrise</p>
              <p>{formatTime(weather.sys.sunrise)}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-purple-800">Sunset</p>
              <p>{formatTime(weather.sys.sunset)}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-purple-800">Feels Like</p>
              <p>{weather.main.feels_like}°C</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.p
        className="mt-10 text-indigo-700/90 italic text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        "Wherever you go, no matter what the weather, always bring your own sunshine." – Anthony J. D'Angelo
      </motion.p>
    </div>
  );
};

export default Weather;
