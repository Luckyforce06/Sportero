const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');

const Exercise = sequelize.define('Exercise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Pectoraux', 'Dos', 'Jambes', 'Épaules', 'Bras', 'Abdos', 'Cardio'),
    allowNull: false
  },
  muscleTarget: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Exercise;
