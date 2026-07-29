const express = require('express');
const cors = require('cors');

const { connectDB, sequelize } = require('./config/db');

// 2. Imports des Routeurs et Contrôleurs
const authRoutes = require('./routers/auth.router');
const workoutRoutes = require('./routers/workout.router');
const exerciceRoutes = require('./routers/exercice.router');
const friendRouter = require('./routers/friend.router');

const { getWorkouts, createWorkout } = require('./controllers/workout.controller.js');

const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Endpoints API
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercices', exerciceRoutes);
app.use('/api/friends', friendRouter);

// 5. Initialisation & Démarrage du serveur
const startServer = async () => {
  try {
    // Connexion à la BDD
    await connectDB();

    // Synchronisation des modèles avec la BDD
    await sequelize.sync();
    console.log('🔄 Modèles Sequelize synchronisés avec PostgreSQL.');

    // Lancement de Express
    app.listen(PORT, () => {
      console.log(`🚀 Serveur Sportero actif sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur lors du démarrage du serveur :', err);
  }
};

startServer();
