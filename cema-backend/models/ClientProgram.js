const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class ClientProgram extends Model {}

ClientProgram.init(
  {
    clientId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Clients',
        key: 'id',
      },
    },
    programId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Programs',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'ClientProgram',
  }
);

module.exports = ClientProgram;