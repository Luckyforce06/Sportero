const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');

const WorkoutExercice = sequelize.define('WorkoutExercice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sets: {
    type: DataTypes.INTEGER,
    defaultValue: 4
  },
  reps: {
    type: DataTypes.STRING,
    defaultValue: '10'
  },
  restSec: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

module.exports = WorkoutExercice;
