const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Program = require('./Program');

class Client extends Model {}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    selectedProgram :{
      type: DataTypes.STRING,
      references: {
        model: Program, // Reference the Program model
        key: 'id',
      },
      allowNull: false,
      
    },
    registeredAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'Clients',
    timestamps: true,
  }
);

module.exports = Client;
