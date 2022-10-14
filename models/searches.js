const axios = require('axios');

class Searches {
  history = [];

  constructor() {
    // TODO: read from DB
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_TOKEN,
      limit: 5,
      language: 'en',
    };
  }

  get paramsOpenWeatherMap() {
    return {
      appid: process.env.OPENWEATHERMAP_TOKEN,
      units: 'metric',
      lang: 'en',
    };
  }

  async location(where = '') {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${where}.json`,
        params: this.paramsMapbox,
      });

      const { data } = await instance.get();

      return data.features.map((location) => ({
        id: location.id,
        name: location.place_name,
        lng: location.center[0],
        lat: location.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async weather(lat = 0, lon = 0) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeatherMap, lat, lon },
      });

      const res = await instance.get();
      const { weather, main } = res.data;

      return {
        description: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      return [];
    }
  }
}

module.exports = Searches;
