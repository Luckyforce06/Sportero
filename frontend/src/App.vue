<template>
  <router-view />

  <!-- MODALE D'INVITATION VISIBLE PARTOUT -->
  <div v-if="incomingInvitation" class="invite-modal-overlay">
    <div class="invite-modal-card">
      <h3>🚀 Invitation à une séance</h3>
      <p>Un ami t'invite à rejoindre la séance : <strong>"{{ incomingInvitation.workoutTitle }}"</strong></p>
      <div class="invite-modal-actions">
        <button @click="declineInvitation" class="btn-decline">Refuser</button>
        <button @click="acceptInvitation" class="btn-accept">Rejoindre ✓</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { socket } from '../src/services/socker.js';

const router = useRouter();
const incomingInvitation = ref(null);

onMounted(() => {
  // 1. Gestion de la connexion et de l'enregistrement global de l'utilisateur
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && user.id) {
        if (!socket.connected) {
          socket.connect();
        }

        const register = () => {
          socket.emit('register_user', String(user.id));
          console.log("👤 Enregistrement socket global pour l'utilisateur ID :", user.id);
        };

        socket.on('connect', register);

        if (socket.connected) {
          register();
        }
      }
    } catch (e) {
      console.error('Erreur lors de l\'initialisation du socket global', e);
    }
  }

  // 2. Écoute globale et permanente des invitations
  // On s'assure de nettoyer d'abord l'écouteur pour éviter les doublons
  socket.off('receive_invitation');
  socket.on('receive_invitation', (data) => {
    console.log("📥 Invitation reçue par le client :", data);
    incomingInvitation.value = data; // Stocke les data pour afficher la modale
  });
});

// Fonctions pour la modale
const acceptInvitation = () => {
  if (incomingInvitation.value) {
    const workoutId = incomingInvitation.value.workoutId;
    
    // 1. Rejoindre la room WebSocket
    socket.emit('join_workout_room', workoutId);
    
    // 2. Fermer la modale
    incomingInvitation.value = null;
    
    // 3. Rediriger vers la vraie route définie dans ton router.ts
    window.location.href = `/workouts/${workoutId}`;
  }
};

const declineInvitation = () => {
  incomingInvitation.value = null;
};
</script>

<style>
/* Styles globaux existants */
html, body {
  background-color: #000000 !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 100vh !important;
  overflow-x: hidden;
}

#app {
  max-width: 100% !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.app-main-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000;
}

/* Style rapide pour la modale d'invitation */
.invite-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.invite-modal-card {
  background: #1a1a1a;
  border: 1px solid #333;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  color: #fff;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.invite-modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.btn-decline {
  background: #333;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-accept {
  background: #22c55e;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
</style>