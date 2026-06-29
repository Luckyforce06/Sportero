const bcrypt = require('bcrypt');
const User = require('../models/User'); // Ajuste le chemin selon ton architecture de modèles
const { Op } = require('sequelize'); // 🔥 Assure-toi que cette ligne est présente au début du fichier !

exports.register = async (req, res) => {
  try {
    const { pseudo, email, password } = req.body;

    // 1. Validation de base
    if (!pseudo || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // 2. Vérifier si l'utilisateur existe déjà (Email ou Pseudo)
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { pseudo }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: "Le pseudo ou l'adresse email est déjà utilisé." });
    }

    // 3. Hachage du mot de passe (Salt round = 10 pour un excellent ratio sécurité/perf)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Création de l'utilisateur en base de données
    const newUser = await User.create({
      pseudo,
      email,
      password: hashedPassword // On enregistre le mot de passe crypté !
    });

    // 5. Réponse de succès (on ne renvoie JAMAIS le mot de passe, même haché)
    return res.status(201).json({
      message: 'Utilisateur créé avec succès !',
      user: {
        id: newUser.id,
        pseudo: newUser.pseudo,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return res.status(500).json({ message: 'Une erreur interne est survenue.' });
  }
};
