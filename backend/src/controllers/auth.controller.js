const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  try {
    const { pseudo, email, password } = req.body;

    if (!pseudo || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { pseudo }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: "Le pseudo ou l'adresse email est déjà utilisé." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      pseudo,
      email,
      password: hashedPassword
    });

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

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { pseudo: identifier }]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const secretKey = process.env.JWT_SECRET || 'sportero_super_secret_key_ultra_safe';

    const token = jwt.sign({ id: user.id, pseudo: user.pseudo }, secretKey, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id,
        pseudo: user.pseudo,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(500).json({ message: 'Une erreur interne est survenue.' });
  }
};
