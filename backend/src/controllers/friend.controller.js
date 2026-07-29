const { User, Friendship } = require('../models');
const { Op } = require('sequelize');

// Lister les amis acceptés
exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [{ userId }, { friendId: userId }],
        status: 'accepted'
      },
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'pseudo'] },
        { model: User, as: 'Receiver', attributes: ['id', 'pseudo'] }
      ]
    });

    // On retourne l'ami MAIS on inclut l'id de la relation (friendshipId)
    const friends = friendships.map(f => {
      const friendObj = f.userId === userId ? f.Receiver : f.Sender;
      return {
        id: friendObj.id, // L'id de l'ami (pour son profil si besoin)
        friendshipId: f.id, // L'id de la ligne de relation dans la table Friendship
        pseudo: friendObj.pseudo
      };
    });

    res.json(friends);
  } catch (error) {
    console.error('ERREUR DANS getFriends :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Envoyer une demande par pseudo
exports.sendRequest = async (req, res) => {
  try {
    const { pseudo } = req.body;
    const userId = req.user.id;

    const targetUser = await User.findOne({ where: { pseudo } });
    if (!targetUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    if (targetUser.id === userId) {
      return res.status(400).json({ message: "Tu ne peux pas t'ajouter toi-même." });
    }

    const existing = await Friendship.findOne({
      where: {
        [Op.or]: [
          { userId, friendId: targetUser.id },
          { userId: targetUser.id, friendId: userId }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Une relation ou une demande existe déjà.' });
    }

    const friendship = await Friendship.create({
      userId,
      friendId: targetUser.id,
      status: 'pending'
    });

    res.status(201).json({ message: 'Demande envoyée avec succès', friendship });
  } catch (error) {
    console.error('ERREUR CRITIQUE DANS sendRequest :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les demandes en attente
exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await Friendship.findAll({
      where: { friendId: userId, status: 'pending' },
      include: [{ model: User, as: 'Sender', attributes: ['id', 'pseudo'] }]
    });

    const formatted = requests.map(r => ({
      id: r.id,
      senderPseudo: r.Sender.pseudo
    }));

    res.json(formatted);
  } catch (error) {
    console.error('ERREUR DANS getPendingRequests :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Accepter une demande
exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const friendship = await Friendship.findByPk(id);

    if (!friendship) return res.status(404).json({ message: 'Demande introuvable.' });

    friendship.status = 'accepted';
    await friendship.save();

    res.json({ message: 'Demande acceptée !' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer / Refuser un ami
exports.removeFriend = async (req, res) => {
  try {
    const { id } = req.params;
    await Friendship.destroy({ where: { id } });
    res.json({ message: 'Ami supprimé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
