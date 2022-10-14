const axios = require('axios');
const fs = require('fs');

class Searches {
  history = [];
  dataPath = './db/data.json';

  constructor() {
    this.retrieveData();
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

  get capitalizedHistory() {
    return this.history.map((location) => {
      let words = location.split(' ');
      words = words.map((word) => word[0].toUpperCase() + word.substring(1));

      return words.join(' ');
    });
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

  addToHistory(location = '') {
    if (this.history.includes(location.toLowerCase())) {
      return;
    }

    this.history.unshift(location.toLowerCase());

    this.storeData();
  }

  storeData() {
    const data = this.history;

    fs.writeFileSync(this.dataPath, JSON.stringify(data));
  }

  retrieveData() {
    if (!fs.existsSync(this.dataPath)) return;

    const data = fs.readFileSync(this.dataPath, { encoding: 'utf-8' });

    if (data) {
      this.history = JSON.parse(data);
    }
  }
}

module.exports = Searches;
