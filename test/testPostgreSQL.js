const Sequelize = require('sequelize');
const pg = require('pg');

const uri = 'postgres://nvvdmmyccvxpoc:V4aefMOIM1m_PAy2Xx8dcpDC9P@ec2-54-235-95-102.compute-1.amazonaws.com:5432/d4qrsh611v83tq';

const sequelize = new Sequelize(uri, {
  host: 'ec2-54-235-95-102.compute-1.amazonaws.com',
  dialect: 'postgres',
  dialectOptions: { ssl: true }
});

const Temperatures = sequelize.define('temperatures', {
  zip: {
    type: Sequelize.INTEGER
  },
  temp: {
    type: Sequelize.TEXT
  }
});

sequelize.sync({
  force: true
})