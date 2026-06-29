const express = require('express');
const cors = require('cors'); // Si tu l'utilises déjà pour lier le front et le back
const authRoutes = require('./routers/auth.router');
// Remplace la ligne qui charge ./models par celle-ci :
const { sequelize } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares de base
app.use(cors());
app.use(express.json()); // 🔥 INDISPENSABLE pour lire req.body !

// 2. Liaison des routes
app.use('/api/auth', authRoutes);

// 3. Démarrage du serveur et synchronisation DB
// Assure-toi d'appeler directement sequelize.sync()
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur Sportero actif sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Impossible de connecter la base de données :', err);
  });
