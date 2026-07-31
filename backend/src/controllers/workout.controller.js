const { Workout, Exercice, WorkoutExercice } = require('../models');

// Récupérer toutes les séances de l'utilisateur connecté
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Exercice,
          as: 'Exercises',
          through: { attributes: ['sets', 'reps', 'restSec', 'order'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(workouts);
  } catch (error) {
    console.error('Erreur getWorkouts:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer une séance complète liée à l'utilisateur connecté
exports.createWorkout = async (req, res) => {
  try {
    console.log('Données reçues du front :', req.body);
    const { title, category, intensity, description, estimatedTime, exercises } = req.body;

    const newWorkout = await Workout.create({
      title,
      category,
      intensity,
      description,
      estimatedTime,
      userId: req.user.id
    });

    console.log("Séance créée avec l'ID :", newWorkout.id);

    if (exercises && exercises.length > 0) {
      for (let i = 0; i < exercises.length; i++) {
        const exData = exercises[i];

        const [exercice] = await Exercice.findOrCreate({
          where: { name: exData.name },
          defaults: {
            category: exData.category || 'Pectoraux',
            muscleTarget: 'Général'
          }
        });

        await WorkoutExercice.create({
          WorkoutId: newWorkout.id,
          ExerciseId: exercice.id,
          sets: Number(exData.sets) || 4,
          reps: String(exData.reps || '10'),
          restSec: Number(exData.rest || exData.restSec) || 60,
          order: i + 1
        });
      }
    }

    const fullWorkout = await Workout.findByPk(newWorkout.id, {
      include: [
        {
          model: Exercice,
          as: 'Exercises',
          through: { attributes: ['sets', 'reps', 'restSec', 'order'] }
        }
      ]
    });

    res.status(201).json(fullWorkout);
  } catch (error) {
    console.error('Erreur lors de la création de la séance :', error);
    res.status(400).json({ error: error.message });
  }
};

// Récupérer une séance spécifique (accessible par son ID pour les participants du live)
exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findByPk(req.params.id, {
      include: [
        {
          model: Exercice,
          as: 'Exercises',
          through: { attributes: ['sets', 'reps', 'restSec', 'order'] }
        }
      ]
    });

    if (!workout) {
      return res.status(404).json({ error: 'Séance introuvable' });
    }

    res.json(workout);
  } catch (error) {
    console.error('Erreur getWorkoutById:', error);
    res.status(500).json({ error: error.message });
  }
};
