<template>
  <div class="app-container">
    <!-- 1. SIDEBAR (DESKTOP) -->
    <aside class="sidebar desktop-only">
      <div class="sidebar-header">
        <div class="brand">
          <img src="../../assets/logo.png" alt="Sportero" class="brand-logo" />
          <span class="brand-name">SPORTERO</span>
        </div>
      </div>

      <nav class="sidebar-menu">
        <div class="menu-label">MENU PRINCIPAL</div>
        <router-link to="/dashboard" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Tableau de bord</span>
        </router-link>
        <router-link to="/workouts" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <span>Mes Séances</span>
        </router-link>
        <a href="#" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          <span>Vidéos & Tutos</span>
        </a>

        <div class="menu-label spacing">COMMUNAUTÉ</div>
        <router-link to="/friends" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Amis</span>
        </router-link>

        <a href="#" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Séances Groupe</span>
          <span class="nav-badge">LIVE</span>
        </a>
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

    <!-- 2. ZONE CONTENU PRINCIPAL -->
    <div class="main-wrapper">
      <!-- TOPBAR HEADER -->
      <header class="topbar">
        <div class="mobile-logo mobile-only">
          <img src="../../assets/logo.png" alt="Sportero" class="brand-logo-mobile" />
          <span class="brand-name">SPORTERO</span>
        </div>

        <div class="search-bar desktop-only">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Rechercher une séance, un mouvement..." />
        </div>

        <div class="topbar-actions">
          <button class="icon-btn" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notification-indicator"></span>
          </button>
          
          <button @click="handleLogout" class="icon-btn mobile-only" title="Déconnexion">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      <!-- PANNEAU DASHBOARD SCROLLABLE -->
      <main class="dashboard-body">
        <!-- HEADER WELCOME -->
        <div class="welcome-banner">
          <div>
            <h1>Bon retour, <span class="highlight">{{ user?.pseudo || 'Athlète' }}</span> 👋</h1>
            <p>Voici l'état récapitulatif de tes performances et tes entraînements prévus.</p>
          </div>
          <button class="btn-primary-glow">+ Nouvelle séance</button>
        </div>

        <!-- RANGÉE DES KPI (METRICS) -->
        <div class="metrics-row">
          <div class="metric-card">
            <div class="metric-icon orange">⚡</div>
            <div class="metric-content">
              <span class="metric-value">12</span>
              <span class="metric-label">Séances réalisées</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon green">🎯</div>
            <div class="metric-content">
              <span class="metric-value">85%</span>
              <span class="metric-label">Objectif mensuel</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon blue">🔥</div>
            <div class="metric-content">
              <span class="metric-value">4 250</span>
              <span class="metric-label">Kcal brûlées</span>
            </div>
          </div>
        </div>

        <!-- GRILLE DES CARTES PRINCIPALES -->
        <div class="cards-grid">
          <!-- Carte 1: Séance recommandée -->
          <div class="pro-card main-focus-card">
            <div class="card-top">
              <span class="tag-orange">PROGRAMME DU JOUR</span>
              <span class="duration">⏱ ~60 min</span>
            </div>
            <div class="card-middle">
              <h2>Push - Pectoraux & Triceps</h2>
              <p>5 exercices ciblés • Développé couché, Dips, Écartés haltères</p>
            </div>
            <div class="card-bottom">
              <button class="btn-start">Démarrer l'entraînement ▶</button>
            </div>
          </div>

          <!-- Carte 2: Groupe / Sync -->
          <div class="pro-card sync-card">
            <div class="card-top">
              <span class="tag-live">EN DIRECT</span>
            </div>
            <div class="card-middle">
              <h2>Session Groupe Sync</h2>
              <p>Rejoins tes partenaires d'entraînement en temps réel avec suivi synchrone.</p>
            </div>
            <div class="card-bottom">
              <button class="btn-outline">Créer un salon +</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 3. NAVIGATION MOBILE (BOTTOM BAR) -->
    <nav class="bottom-bar mobile-only">
      <router-link to="/dashboard" class="bottom-item" active-class="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span>Accueil</span>
      </router-link>
      <router-link to="/workouts" class="bottom-item" active-class="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/></svg>
        <span>Séances</span>
      </router-link>
      <!-- 👈 Ajout de l'onglet Amis en version mobile -->
      <router-link to="/friends" class="bottom-item" active-class="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        <span>Amis</span>
      </router-link>
      <router-link to="/workouts" class="bottom-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        <span>Groupe</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref(null);

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      console.error('Erreur profil');
    }
  }
});

const userInitials = computed(() => {
  const name = user.value?.pseudo || 'A';
  return name.substring(0, 2).toUpperCase();
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* GLOBAL FULLSCREEN RESET */
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

/* =================================== */
/* SIDEBAR PRO                         */
/* =================================== */
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

.sidebar-header {
  margin-bottom: 2.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  width: 32px;
  height: auto;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ff7a1a;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.menu-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.menu-label.spacing {
  margin-top: 1.8rem;
}

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

.nav-icon {
  width: 18px;
  height: 18px;
}

.nav-item:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.04);
}

.nav-item.active {
  color: #ff7a1a;
  background-color: rgba(255, 122, 26, 0.1);
}

.nav-badge {
  margin-left: auto;
  font-size: 0.65rem;
  font-weight: 800;
  background-color: #ff7a1a;
  color: #000;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-card-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7a1a, #ff9e59);
  color: #000;
  font-weight: 800;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.user-status {
  font-size: 0.7rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10b981;
}

.btn-icon-logout {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-icon-logout svg { width: 18px; height: 18px; }
.btn-icon-logout:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

/* =================================== */
/* MAIN WRAPPER & TOPBAR               */
/* =================================== */
.main-wrapper {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.topbar {
  height: 65px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background-color: rgba(15, 17, 23, 0.5);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: #141721;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.5rem 0.85rem;
  width: 320px;
}

.search-icon { width: 16px; height: 16px; color: #6b7280; }

.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 0.85rem;
  width: 100%;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: #141721;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.icon-btn svg { width: 18px; height: 18px; }

.notification-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 7px;
  height: 7px;
  background-color: #ff7a1a;
  border-radius: 50%;
}

/* =================================== */
/* DASHBOARD BODY (CONTENT)            */
/* =================================== */
.dashboard-body {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.welcome-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-banner h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.3rem 0;
}

.welcome-banner p {
  color: #9ca3af;
  margin: 0;
  font-size: 0.9rem;
}

.highlight { color: #ff7a1a; }

.btn-primary-glow {
  background-color: #ff7a1a;
  color: #000;
  border: none;
  font-weight: 700;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 122, 26, 0.25);
  transition: transform 0.2s;
}

.btn-primary-glow:hover { transform: translateY(-1px); }

/* METRICS ROW */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.metric-card {
  background-color: #0f1117;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.metric-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.metric-icon.orange { background: rgba(255, 122, 26, 0.1); }
.metric-icon.green { background: rgba(16, 185, 129, 0.1); }
.metric-icon.blue { background: rgba(59, 130, 246, 0.1); }

.metric-content { display: flex; flex-direction: column; }
.metric-value { font-size: 1.4rem; font-weight: 800; }
.metric-label { font-size: 0.8rem; color: #9ca3af; }

/* CARDS GRID */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.pro-card {
  background-color: #0f1117;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main-focus-card {
  border-color: rgba(255, 122, 26, 0.3);
  background: linear-gradient(180deg, rgba(255, 122, 26, 0.03) 0%, rgba(15, 17, 23, 1) 100%);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tag-orange {
  font-size: 0.7rem;
  font-weight: 800;
  color: #ff7a1a;
  letter-spacing: 0.5px;
}

.tag-live {
  font-size: 0.7rem;
  font-weight: 800;
  color: #10b981;
}

.duration { font-size: 0.8rem; color: #9ca3af; }

.card-middle h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.card-middle p {
  font-size: 0.85rem;
  color: #9ca3af;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.btn-start {
  width: 100%;
  background-color: #ff7a1a;
  color: #000;
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.btn-outline {
  width: 100%;
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.85rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* =================================== */
/* RESPONSIVE MOBILE                   */
/* =================================== */
@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }

  .app-container { flex-direction: column; }
  .main-wrapper { height: calc(100vh - 60px); }

  .topbar { padding: 0 1.25rem; }
  .brand-logo-mobile { width: 28px; }

  .dashboard-body { padding: 1.25rem; gap: 1.5rem; }
  .welcome-banner { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .welcome-banner h1 { font-size: 1.4rem; }

  /* BOTTOM BAR MOBILE */
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #0f1117;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 1000;
  }

  .bottom-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    color: #6b7280;
    text-decoration: none;
    font-size: 0.7rem;
    font-weight: 600;
  }

  .bottom-item svg { width: 18px; height: 18px; }
  .bottom-item.active { color: #ff7a1a; }
}
</style>