const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Feedback extends Model {}

Feedback.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateSubmitted: {
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
    modelName: 'Feedback',
    tableName: 'Feedbacks',
    timestamps: true,
  }
);

module.exports = Feedback;
