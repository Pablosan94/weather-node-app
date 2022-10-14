const { showMenu, readInput, pause } = require('./helpers/inquirer');

const main = async () => {
  let option;

  do {
    option = await showMenu();
    if (option !== '0') await pause();
  } while (option !== '0');
};

main();
