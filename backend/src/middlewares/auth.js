const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Token d'authentification manquant." });
  }

  // On utilise la même clé secrète que dans ton contrôleur de login
  const secretKey = process.env.JWT_SECRET || 'sportero_super_secret_key_ultra_safe';

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
