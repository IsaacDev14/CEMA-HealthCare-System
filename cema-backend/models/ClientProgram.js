const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class ClientProgram extends Model {}

ClientProgram.init(
  {
    clientId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    programId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'ClientProgram',
    tableName: 'ClientPrograms',
    timestamps: true,
  }
);

module.exports = ClientProgram;
