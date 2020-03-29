require('dotenv').config();
require('console.table');

const orm = require('./config/orm');
const renderMainMenu = require('./controller');

async function main() {
  await orm.connect();
  renderMainMenu();
}

main();