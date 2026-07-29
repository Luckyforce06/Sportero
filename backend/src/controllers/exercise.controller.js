const { Exercice } = require('../models');

// Récupérer tous les exercices
exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercice.findAll({
      order: [['name', 'ASC']]
    });
    res.status(200).json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un exercice
exports.createExercise = async (req, res) => {
  try {
    const newEx = await Exercice.create(req.body);
    res.status(201).json(newEx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un exercice
exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Exercice.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Exercice non trouvé' });
    }

    res.status(200).json({ message: 'Exercice supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
