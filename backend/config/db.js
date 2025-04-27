const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage:
    process.env.NODE_ENV === 'production'
      ? '/tmp/cema.db' // Vercel writable directory
      : path.join(__dirname, '../../cema.db'), // Local path
  logging: process.env.NODE_ENV === 'production' ? false : console.log, // Disable logging in production
});

module.exports = sequelize;