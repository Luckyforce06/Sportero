const express = require('express');
const router = express.Router();

// 1. Déstructurer avec les bons noms de fonctions
const {
  getExercises,
  createExercise,
  deleteExercise
} = require('../controllers/exercise.controller');

// 2. Définir les routes
router.get('/', getExercises);
router.post('/', createExercise);
router.delete('/:id', deleteExercise);

module.exports = router;
