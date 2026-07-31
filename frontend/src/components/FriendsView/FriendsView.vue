<template>
  <div class="app-container">
    <!-- SIDEBAR (DESKTOP) -->
    <aside class="sidebar desktop-only">
      <div class="sidebar-header">
        <div class="brand">
          <img src="../assets/logo.png" alt="Sportero" class="brand-logo" />
          <span class="brand-name">SPORTERO</span>
        </div>
      </div>

      <nav class="sidebar-menu">
        <div class="menu-label">MENU PRINCIPAL</div>
        <router-link to="/dashboard" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Tableau de bord</span>
        </router-link>
        <router-link to="/workouts" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <span>Mes Séances</span>
        </router-link>
        <a href="#" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          <span>Vidéos & Tutos</span>
        </a>

        <div class="menu-label spacing">COMMUNAUTÉ</div>
        <router-link to="/friends" class="nav-item active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Amis</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-card-mini">
          <div class="avatar">{{ userInitials }}</div>
          <div class="user-info">
            <span class="user-name">{{ user?.pseudo || 'Athlète' }}</span>
            <span class="user-status"><span class="status-dot"></span> En ligne</span>
          </div>
        </div>
        <button @click="handleLogout" class="btn-icon-logout" title="Déconnexion">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </aside>

    <!-- ZONE CONTENU PRINCIPAL -->
    <div class="main-wrapper">
      <header class="topbar">
        <div class="mobile-logo mobile-only">
          <img src="../assets/logo.png" alt="Sportero" class="brand-logo-mobile" />
          <span class="brand-name">SPORTERO</span>
        </div>
        <div class="topbar-title">👥 Gestion des Amis</div>
      </header>

      <main class="dashboard-body">
        <!-- Section Recherche d'amis -->
        <div class="pro-card">
          <h2>Ajouter un athlète</h2>
          <p>Trouve tes partenaires d'entraînement par leur pseudo pour suivre leurs progrès.</p>
          <div class="search-add-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Entrer le pseudo de ton ami..." 
              @keyup.enter="searchUser"
            />
            <button class="btn-primary-glow" @click="searchUser">Rechercher</button>
          </div>
        </div>

        <!-- Section Demandes en attente -->
        <div class="pro-card" v-if="pendingRequests.length > 0">
          <h2>Invitations reçues</h2>
          <div class="friends-list">
            <div v-for="req in pendingRequests" :key="req.id" class="friend-item">
              <div class="friend-info">
                <div class="avatar-small">{{ req.senderPseudo.substring(0, 2).toUpperCase() }}</div>
                <span>{{ req.senderPseudo }}</span>
              </div>
              <div class="action-buttons">
                <button class="btn-accept" @click="acceptRequest(req.id)">Accepter</button>
                <button class="btn-decline" @click="declineRequest(req.id)">Refuser</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Liste d'amis -->
        <div class="pro-card">
          <h2>Mes Amis ({{ friends.length }})</h2>
          <div v-if="friends.length === 0" class="empty-state">
            <p>Tu n'as pas encore d'amis ajoutés. Utilise la barre de recherche ci-dessus !</p>
          </div>
          <div v-else class="friends-list">
            <div v-for="friend in friends" :key="friend.id" class="friend-item">
              <div class="friend-info">
                <div class="avatar-small">{{ friend.pseudo.substring(0, 2).toUpperCase() }}</div>
                <div>
                  <span class="friend-name">{{ friend.pseudo }}</span>
                  <!-- Indicateur de statut en direct -->
                  <span class="friend-status-text" :class="{ 'is-online': isFriendOnline(friend.id) }">
                    <span class="mini-dot" :class="{ online: isFriendOnline(friend.id) }"></span>
                    {{ isFriendOnline(friend.id) ? 'En ligne' : 'Hors ligne' }}
                  </span>
                </div>
              </div>
              <button class="btn-outline-danger" @click="removeFriend(friend.friendshipId)">Retirer</button>            
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- NAVIGATION MOBILE -->
    <nav class="bottom-bar mobile-only">
      <router-link to="/dashboard" class="bottom-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span>Accueil</span>
      </router-link>
      <router-link to="/workouts" class="bottom-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/></svg>
        <span>Séances</span>
      </router-link>
      <router-link to="/friends" class="bottom-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        <span>Amis</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import friendService from '../../services/friendService.ts';
import { socket } from '../../services/socker'; // Assure-toi que le chemin vers ton instance socket correspond

const router = useRouter();
const user = ref(null);
const searchQuery = ref('');
const friends = ref([]);
const pendingRequests = ref([]);
const onlineUserIds = ref([]);

// Charger les données (amis et demandes)
const loadFriendData = async () => {
  try {
    const [friendsData, requestsData] = await Promise.all([
      friendService.getFriends(),
      friendService.getPendingRequests()
    ]);
    friends.value = friendsData;
    pendingRequests.value = requestsData;
    
    // 🔍 Regarde dans ta console du navigateur (F12) ce que contiennent tes amis et leurs IDs !
    console.log("Liste des amis reçue :", friendsData);
    console.log("IDs actuellement en ligne sur le socket :", onlineUserIds.value);
  } catch (error) {
    console.error("Erreur lors du chargement des données d'amis :", error);
  }
};

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      
      // Connexion explicite et enregistrement de l'utilisateur
      if (user.value && user.value.id) {
        if (!socket.connected) {
          socket.connect();
        }
        
        // On s'assure d'émettre l'événement dès que le socket est connecté
        socket.on('connect', () => {
          console.log("Socket connectée, envoi de l'ID :", user.value.id);
          socket.emit('register_user', String(user.value.id));
        });

        // Si le socket est déjà connecté au moment du montage
        if (socket.connected) {
          socket.emit('register_user', String(user.value.id));
        }
      }
    } catch (e) {
      console.error('Erreur profil ou socket', e);
    }
  }

  // Écoute de la liste des utilisateurs connectés diffusée par le backend
  socket.on('online_users', (userIds) => {
    console.log("Liste des utilisateurs en ligne reçue du serveur :", userIds);
    onlineUserIds.value = userIds;
  });

  loadFriendData();
});

// Vérifie si un ami est dans la liste des IDs connectés
const isFriendOnline = (friendId) => {
  if (!friendId) return false;
  return onlineUserIds.value.map(id => String(id)).includes(String(friendId));
};

const userInitials = computed(() => {
  const name = user.value?.pseudo || 'A';
  return name.substring(0, 2).toUpperCase();
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

const searchUser = async () => {
  if (!searchQuery.value.trim()) return;
  try {
    await friendService.sendFriendRequest(searchQuery.value);
    alert("Demande envoyée avec succès !");
    searchQuery.value = '';
    loadFriendData();
  } catch (err) {
    console.error("Erreur complète :", err);
    alert(err.response?.data?.message || "Erreur lors de l'envoi de la demande.");
  }
};

const acceptRequest = async (id) => {
  try {
    await friendService.acceptRequest(id);
    loadFriendData(); 
  } catch (err) {
    console.error("Erreur lors de l'acceptation :", err);
  }
};

const declineRequest = async (id) => {
  try {
    await friendService.removeFriend(id);
    loadFriendData(); 
  } catch (err) {
    console.error("Erreur lors du refus de l'invitation :", err);
    alert("Impossible de refuser cette invitation.");
  }
};

const removeFriend = async (id) => {
  try {
    await friendService.removeFriend(id);
    loadFriendData(); 
  } catch (err) {
    console.error("Erreur lors de la suppression de l'ami :", err);
    alert("Impossible de supprimer cet ami.");
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* Styles généraux */
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #090a0f;
  color: #f3f4f6;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}

.mobile-only { display: none !important; }

.sidebar {
  width: 260px;
  height: 100vh;
  background-color: #0f1117;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  box-sizing: border-box;
  flex-shrink: 0;
}

.sidebar-header { margin-bottom: 2.5rem; }
.brand { display: flex; align-items: center; gap: 0.75rem; }
.brand-logo { width: 32px; height: auto; }
.brand-name { font-size: 1.25rem; font-weight: 800; color: #ff7a1a; letter-spacing: 0.5px; }

.sidebar-menu { flex: 1; display: flex; flex-direction: column; gap: 0.35rem; }
.menu-label { font-size: 0.68rem; font-weight: 700; color: #6b7280; letter-spacing: 1px; margin-bottom: 0.5rem; }
.menu-label.spacing { margin-top: 1.8rem; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.9rem;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-icon { width: 18px; height: 18px; }
.nav-item:hover { color: #ffffff; background-color: rgba(255, 255, 255, 0.04); }
.nav-item.active { color: #ff7a1a; background-color: rgba(255, 122, 26, 0.1); }

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-card-mini { display: flex; align-items: center; gap: 0.75rem; }
.avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #ff7a1a, #ff9e59);
  color: #000; font-weight: 800; font-size: 0.85rem;
  display: flex; align-items: center; justify-content: center;
}
.user-info { display: flex; flex-direction: column; }
.user-name { font-size: 0.85rem; font-weight: 700; color: #fff; }
.user-status { font-size: 0.7rem; color: #9ca3af; display: flex; align-items: center; gap: 0.3rem; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background-color: #10b981; }

.btn-icon-logout {
  background: transparent; border: none; color: #6b7280; cursor: pointer;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px;
}
.btn-icon-logout svg { width: 18px; height: 18px; }
.btn-icon-logout:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.main-wrapper { flex: 1; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
.topbar {
  height: 65px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex; align-items: center; padding: 0 2rem;
  background-color: rgba(15, 17, 23, 0.5); backdrop-filter: blur(10px); flex-shrink: 0;
  font-weight: 700; font-size: 1.1rem;
}

.dashboard-body { flex: 1; padding: 2rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; }

.pro-card {
  background-color: #0f1117;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pro-card h2 { font-size: 1.1rem; font-weight: 700; margin: 0; }
.pro-card p { font-size: 0.85rem; color: #9ca3af; margin: 0; }

.search-add-box { display: flex; gap: 1rem; margin-top: 0.5rem; }
.search-add-box input {
  flex: 1; background-color: #141721; border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px; padding: 0.75rem 1rem; color: #fff; outline: none; font-size: 0.9rem;
}

.btn-primary-glow {
  background-color: #ff7a1a; color: #000; border: none; font-weight: 700;
  padding: 0.75rem 1.25rem; border-radius: 8px; cursor: pointer;
}

.friends-list { display: flex; flex-direction: column; gap: 0.75rem; }
.friend-item {
  display: flex; justify-content: space-between; align-items: center;
  background: #141721; padding: 0.75rem 1rem; border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.friend-info { display: flex; align-items: center; gap: 0.75rem; }
.avatar-small {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255, 122, 26, 0.15); color: #ff7a1a;
  font-weight: 800; font-size: 0.75rem; display: flex; align-items: center; justify-content: center;
}
.friend-name { font-weight: 600; font-size: 0.9rem; display: block; }

/* Styles pour le statut dynamique */
.friend-status-text { font-size: 0.75rem; color: #6b7280; display: flex; align-items: center; gap: 0.35rem; }
.friend-status-text.is-online { color: #10b981; }
.mini-dot { width: 6px; height: 6px; border-radius: 50%; background-color: #6b7280; display: inline-block; }
.mini-dot.online { background-color: #10b981; box-shadow: 0 0 6px #10b981; }

.action-buttons { display: flex; gap: 0.5rem; }
.btn-accept { background: #10b981; color: #000; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.8rem; }
.btn-decline { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.8rem; }
.btn-outline-danger { background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.8rem; }

.empty-state { color: #6b7280; font-size: 0.9rem; font-style: italic; }

@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }
  .app-container { flex-direction: column; }
  .main-wrapper { height: calc(100vh - 60px); }
  .dashboard-body { padding: 1rem; }
  
  .bottom-bar {
    position: fixed; bottom: 0; left: 0; right: 0; height: 60px;
    background-color: #0f1117; border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex; justify-content: space-around; align-items: center; z-index: 1000;
  }
  .bottom-item {
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
    color: #6b7280; text-decoration: none; font-size: 0.7rem; font-weight: 600;
  }
  .bottom-item svg { width: 18px; height: 18px; }
  .bottom-item.active { color: #ff7a1a; }
}
</style>