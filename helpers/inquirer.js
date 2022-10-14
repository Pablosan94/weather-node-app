const inquirer = require('inquirer');
require('colors');

const questions = [
  {
    type: 'list',
    name: 'option',
    message: 'What do you want to do?',
    choices: [
      { value: '1', name: `Search location` },
      { value: '2', name: `History` },
      { value: '0', name: `Exit` },
    ],
  },
];

const showMenu = async () => {
  console.clear();

  const { option } = await inquirer.prompt(questions);

  return option;
};

const pause = async () => {
  const question = [
    {
      type: 'input',
      name: 'pause',
      message: `Press ${'ENTER'.green} to continue`,
    },
  ];

  console.log('\n');
  await inquirer.prompt(question);
};

const readInput = async (message) => {
  const question = [
    {
      type: 'input',
      name: 'location',
      message,
      validate(value) {
        if (value.length === 0) {
          return 'Please input a valid value';
        }
        return true;
      },
    },
  ];

  const { location } = await inquirer.prompt(question);

  return location;
};

const confirm = async (message) => {
  const question = [
    {
      type: 'confirm',
      name: 'ok',
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
};

const listLocations = async (locations = []) => {
  const choices = locations.map((location) => {
    return {
      value: location.id,
      name: `${location.name}`,
    };
  });

  choices.push({
    value: 'Cancel',
    name: 'Cancel'.bgRed.white,
  });

  const question = [
    {
      type: 'list',
      name: 'id',
      message: 'Select a result:',
      choices,
    },
  ];

  const { id } = await inquirer.prompt(question);

  return id;
};

module.exports = {
  showMenu,
  pause,
  readInput,
  confirm,
  listLocations,
};
