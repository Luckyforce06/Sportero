const { Workout, Exercice, WorkoutExercice } = require('../models');

// Récupérer toutes les séances avec leurs exercices
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.findAll({
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
    console.error('Erreur getWoarkouts:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer une séance complète avec ses exercices
exports.createWorkout = async (req, res) => {
  try {
    console.log('Données reçues du front :', req.body); // 👈 Vérifie ce que tu reçois
    const { title, category, intensity, description, estimatedTime, exercises } = req.body;

    const newWorkout = await Workout.create({
      title,
      category,
      intensity,
      description,
      estimatedTime
    });

    console.log("Séance créée avec l'ID :", newWorkout.id);
    console.log('Tableau des exercices reçus :', exercises); // 👈 Vérifie si les exercices sont bien là

    if (exercises && exercises.length > 0) {
      for (let i = 0; i < exercises.length; i++) {
        const exData = exercises[i];
        console.log(`Traitement de l'exercice ${i} :`, exData);

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
        console.log('Lien inséré avec succès pour :', exData.name);
      }
    } else {
      console.log('⚠️ Aucun exercice trouvé dans req.body.exercises !');
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
