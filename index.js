const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 4000;

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.use(express.static('public'));

app.get('/api/weather', (req, res) => {
  const address = req.query.address;
  if (!address) {
    console.log("No address provided");
    return res.status(400).send('Address parameter is missing');
  }

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${address}&units=metric&appid=${WEATHER_API_KEY}`;
  console.log("Request URL:", url);

  axios
    .get(url)
    .then((response) => {
      console.log("API response received:", response.data);
      const data = response.data;
      const cityName = data.name;
      const temperature = data.main.temp;
      const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
      const weatherData = {
        cityName: cityName,
        temperature: temperature,
        sunsetTime: sunsetTime,
      };

      res.json(weatherData); 
    })
    .catch((error) => {
      console.error("Error fetching data from OpenWeatherMap API:", error.message);
      res.status(500).send('Error occurred while fetching weather data');
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
