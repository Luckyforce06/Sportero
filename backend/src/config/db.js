const { Sequelize } = require('sequelize');

// On utilise l'URL fournie par Docker, et on force la chaîne exacte si elle est absente.
// Attention : à l'intérieur du réseau Docker, le port reste 5432 pour communiquer entre conteneurs !
const dbUrl =
  process.env.DATABASE_URL ||
  'postgresql://sportero_user:sportero_password@db:5432/sportero_database';

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: console.log, // On active les logs SQL pour voir passer le "CREATE TABLE" dans le terminal
  define: {
    timestamps: true
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('🐘 Connexion à PostgreSQL réussie avec Sequelize !');

    await sequelize.sync({ alter: true });
    console.log('🧹 Base de données vidée et synchronisée avec succès !');
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données :', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
