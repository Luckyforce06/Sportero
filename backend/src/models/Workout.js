const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');

const Workout = sequelize.define('Workout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  intensity: {
    type: DataTypes.ENUM('Faible', 'Moyen', 'Intense'),
    defaultValue: 'Moyen'
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  estimatedTime: {
    type: DataTypes.INTEGER,
    defaultValue: 45
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  }
});

module.exports = Workout;
