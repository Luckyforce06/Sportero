const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const { connectDB, sequelize } = require('./config/db');

// 2. Imports des Routeurs et Contrôleurs
const authRoutes = require('./routers/auth.router');
const workoutRoutes = require('./routers/workout.router');
const exerciceRoutes = require('./routers/exercice.router');
const friendRouter = require('./routers/friend.router');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Endpoints API
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercices', exerciceRoutes);
app.use('/api/friends', friendRouter);

// 🌐 5. Gestion des WebSockets & Suivi en ligne
const connectedUsers = new Map(); // Map<userId, socket.id>
const socketUsersInfo = new Map(); // Map<socket.id, { userId, pseudo }>

io.on('connection', socket => {
  console.log(`🟢 Un utilisateur s'est connecté : ${socket.id}`);

  // Enregistrement de l'utilisateur avec son ID et optionnellement son pseudo
  socket.on('register_user', userData => {
    // Gère à la fois si on envoie juste un ID ou un objet { userId, pseudo }
    const userId = typeof userData === 'object' ? userData.userId : userData;
    const pseudo = typeof userData === 'object' ? userData.pseudo : 'Utilisateur';

    if (userId) {
      const stringId = String(userId);

      // Si l'utilisateur avait déjà un autre socket ouvert, on nettoie
      for (let [uId, sId] of connectedUsers.entries()) {
        if (sId === socket.id) {
          connectedUsers.delete(uId);
        }
      }

      connectedUsers.set(stringId, socket.id);
      socketUsersInfo.set(socket.id, { userId: stringId, pseudo });

      io.emit('online_users', Array.from(connectedUsers.keys()));
      console.log(`👤 Utilisateur enregistré : ID ${stringId} (${pseudo}) -> Socket ${socket.id}`);
    }
  });

  // Rejoindre une salle de séance spécifique
  socket.on('join_workout_room', workoutId => {
    // S'assure que le préfixe 'workout_' est présent, qu'il soit envoyé ou non par le client
    const roomName = workoutId.toString().startsWith('workout_')
      ? workoutId
      : `workout_${workoutId}`;

    socket.join(roomName);
  });

  // Diffuser l'avancement d'un exercice / série avec le pseudo
  socket.on('update_progress', data => {
    const { workoutId, exerciseIndex, exerciseName, currentSet, status, pseudo } = data;

    // Récupère le pseudo stocké ou celui envoyé par le client, ou un fallback
    const userInfo = socketUsersInfo.get(socket.id);
    const finalPseudo =
      pseudo || (userInfo ? userInfo.pseudo : null) || `User #${socket.id.slice(0, 4)}`;

    io.to(`workout_${workoutId}`).emit('participant_progress', {
      socketId: socket.id,
      pseudo: finalPseudo,
      exerciseIndex,
      exerciseName,
      currentSet,
      status
    });
  });

  // Inviter un ami à une séance live via son ID utilisateur
  socket.on('invite_friend', data => {
    console.log("📥 Demande d'invitation reçue pour l'utilisateur ID :", data.friendUserId);
    const { friendUserId, workoutId, workoutTitle } = data;
    const targetSocketId = connectedUsers.get(String(friendUserId));
    console.log('🔍 Socket trouvé pour cet ami :', targetSocketId);

    if (targetSocketId) {
      io.to(targetSocketId).emit('receive_invitation', {
        fromSocketId: socket.id,
        workoutId,
        workoutTitle
      });
    }
  });

  socket.on('disconnect', () => {
    for (let [userId, sId] of connectedUsers.entries()) {
      if (sId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    socketUsersInfo.delete(socket.id);
    io.emit('online_users', Array.from(connectedUsers.keys()));
    console.log(`🔴 Utilisateur déconnecté : ${socket.id}`);
  });
});

// 6. Initialisation & Démarrage du serveur
const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    console.log('🔄 Modèles Sequelize synchronisés avec PostgreSQL.');

    server.listen(PORT, () => {
      console.log(`🚀 Serveur Sportero actif sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur lors du démarrage du serveur :', err);
  }
};

startServer();
