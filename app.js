require('dotenv').config();
const axios = require('axios');
const {
  showMenu,
  readInput,
  pause,
  listLocations,
} = require('./helpers/inquirer');
const Searches = require('./models/searches');

const main = async () => {
  let option;
  const searches = new Searches();

  do {
    option = await showMenu();

    switch (option) {
      case '1':
        const search = await readInput('Search for a location: ');
        const locations = await searches.location(search);
        const id = await listLocations(locations);
        if (id !== 'Cancel') {
          const selectedLocation = locations.find(
            (location) => location.id === id
          );

          const weather = await searches.weather(
            selectedLocation.lat,
            selectedLocation.lng
          );

          console.log('\nCity information\n'.green);
          console.log('City:', selectedLocation.name);
          console.log('Lat:', selectedLocation.lat);
          console.log('Lng:', selectedLocation.lng);
          console.log('Temperature:', weather.temp);
          console.log('Min:', weather.min);
          console.log('Max', weather.max);
          console.log('Weather description:', weather.description);
        }
        break;
    }

    if (option !== '0') await pause();
  } while (option !== '0');
};

main();
