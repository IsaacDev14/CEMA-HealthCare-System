const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Program extends Model {}

Program.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Program',
    tableName: 'Programs',
    timestamps: true,
  }
);

module.exports = Program;
 