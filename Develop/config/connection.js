const Sequelize = require('sequelize');
require('dotenv').config();

//created varible with help of Emiliano (proferror)
let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    'ecommerce_db',
    'root',
    '1234',
    {
      host: '127.0.0.1',
      dialect: 'mysql',
      port: 3306
    }
  );
}

module.exports = sequelize;