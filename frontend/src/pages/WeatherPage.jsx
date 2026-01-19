import { useState, useEffect } from 'react';

const WeatherPage = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
        console.log(API_KEY)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=McKinney,TX,US&appid=${API_KEY}&units=imperial`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
        setError('');
      } catch (err) {
        console.error('Weather error:', err);
        setError('Unable to load weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">McKinney Weather</h1>
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-500">Loading weather...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">McKinney Weather</h1>
      
      {error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      ) : weather && (
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{weather.name}, {weather.sys.country}</h2>
            <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {Math.round(weather.main.temp)}°F
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                alt={weather.weather[0].description}
                className="w-16 h-16"
              />
              <span className="text-xl text-gray-700 capitalize">{weather.weather[0].description}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Feels Like</p>
              <p className="text-lg font-semibold text-gray-900">{Math.round(weather.main.feels_like)}°F</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Humidity</p>
              <p className="text-lg font-semibold text-gray-900">{weather.main.humidity}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Wind</p>
              <p className="text-lg font-semibold text-gray-900">{Math.round(weather.wind.speed)} mph</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Pressure</p>
              <p className="text-lg font-semibold text-gray-900">{weather.main.pressure} hPa</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Forecast</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">High</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(weather.main.temp_max)}°F</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Low</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(weather.main.temp_min)}°F</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;