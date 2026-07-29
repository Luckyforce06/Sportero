const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Friendship = sequelize.define(
  'Friendship',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted'),
      defaultValue: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = Friendship;
