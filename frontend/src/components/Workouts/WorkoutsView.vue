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
        <router-link to="/dashboard" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Tableau de bord</span>
        </router-link>
        <router-link to="/workouts" class="nav-item active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <span>Mes Séances</span>
        </router-link>
        <a href="#" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          <span>Vidéos & Tutos</span>
        </a>

        <div class="menu-label spacing">COMMUNAUTÉ</div>
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

        <div class="header-main-top">
          <div class="pill-category">MES SÉANCES</div>
          <h1>Liste des entraînements</h1>
        </div>

        <div class="topbar-actions">
          <button @click="openModal" class="btn-primary-glow">
            + Ajouter une séance
          </button>
          <button @click="handleLogout" class="icon-btn mobile-only" title="Déconnexion">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      <!-- PANNEAU DASHBOARD SCROLLABLE -->
      <main class="dashboard-body">
        <div class="workouts-grid">
          <div 
            v-for="w in allWorkouts" 
            :key="w.id"
            class="workout-card"
          >
            <div class="workout-card-top">
              <span class="pill-category-small">{{ w.category || 'ENTRAÎNEMENT' }}</span>
              <span class="badge-intensity-small" :class="w.intensity?.toLowerCase()">{{ w.intensity || 'Moyen' }}</span>
            </div>
            
            <h3>{{ w.title }}</h3>
            <p class="workout-count-info">{{ (w.Exercises || w.exercises || []).length }} exercice(s) configuré(s)</p>

            <button @click="openDetailModal(w)" class="btn-secondary-flat full-width-btn">
              Voir la séance
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- POPUP MODAL : CRÉER UNE SÉANCE AVEC CONFIGURATION DES EXERCICES -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card large-modal">
        <div class="modal-header">
          <h3>Créer une nouvelle séance</h3>
          <button @click="closeModal" class="btn-close-modal">✕</button>
        </div>

        <form @submit.prevent="createWorkout" class="workout-form">
          <div class="form-row">
            <div class="form-group flex-2">
              <label>Titre de la séance</label>
              <input type="text" v-model="newWorkout.title" placeholder="ex: Full Body Intense" required />
            </div>

            <div class="form-group flex-1">
              <label>Catégorie</label>
              <input type="text" v-model="newWorkout.category" placeholder="ex: Musculation" required />
            </div>

            <div class="form-group flex-1">
              <label>Intensité</label>
              <select v-model="newWorkout.intensity">
                <option value="Faible">Faible</option>
                <option value="Moyen">Moyen</option>
                <option value="Élevé">Élevé</option>
              </select>
            </div>
          </div>

          <div class="exercises-config-section">
            <div class="section-sub-header">
              <h4>Configuration des exercices</h4>
              <button type="button" @click="addExerciseRow" class="btn-small-add">+ Ajouter un exercice</button>
            </div>

            <div class="exercises-rows-container">
              <div v-for="(ex, index) in newWorkout.exercises" :key="index" class="exercise-row-item">
                <div class="form-group flex-2">
                  <label v-if="index === 0">Nom / Description</label>
                  <input type="text" v-model="ex.name" placeholder="Nom de l'exercice" required />
                </div>
                <div class="form-group flex-1">
                  <label v-if="index === 0">Séries</label>
                  <input type="number" v-model.number="ex.sets" min="1" placeholder="Séries" required />
                </div>
                <div class="form-group flex-1">
                  <label v-if="index === 0">Reps</label>
                  <input type="text" v-model="ex.reps" placeholder="Reps" required />
                </div>
                <div class="form-group flex-1">
                  <label v-if="index === 0">Repos (s)</label>
                  <input type="number" v-model.number="ex.rest" min="0" placeholder="Secs" required />
                </div>
                <button type="button" @click="removeExerciseRow(index)" class="btn-delete-row" title="Supprimer">✕</button>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary-flat">Annuler</button>
            <button type="submit" class="btn-primary-glow">Créer la séance 🚀</button>
          </div>
        </form>
      </div>
    </div>

    <!-- POPUP MODAL : VOIR LA SÉANCE & DETAILS -->
    <div v-if="isDetailModalOpen" class="modal-overlay" @click.self="closeDetailModal">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="pill-category-small">{{ selectedWorkout?.category }}</span>
            <h3>{{ selectedWorkout?.title }}</h3>
          </div>
          <button @click="closeDetailModal" class="btn-close-modal">✕</button>
        </div>

        <div class="modal-body-details">
          <div class="detail-intensity-box">
            <span>Intensité : <strong>{{ selectedWorkout?.intensity || 'Moyen' }}</strong></span>
          </div>

          <div class="tooltip-title">Liste des exercices et description :</div>
          <ul class="tooltip-exercises-list detail-list">
            <li v-for="(ex, idx) in (selectedWorkout?.Exercises || selectedWorkout?.exercises || [])" :key="idx">
              <strong>{{ ex.name }}</strong>
              <div class="ex-sub-details">
                <span>{{ ex.WorkoutExercise?.sets || ex.sets || 4 }} séries</span> • 
                <span>{{ ex.WorkoutExercise?.reps || ex.reps || '10' }} reps</span> • 
                <span>{{ ex.WorkoutExercise?.restSec || ex.rest || 60 }}s repos</span>
              </div>
            </li>
            <li v-if="!(selectedWorkout?.Exercises || selectedWorkout?.exercises || []).length" class="empty-tip">
              Aucun exercice configuré pour cette séance.
            </li>
          </ul>
        </div>

        <div class="modal-actions">
          <button type="button" @click="closeDetailModal" class="btn-secondary-flat">Fermer</button>
          <button type="button" @click="startWorkoutSession(selectedWorkout.id)" class="btn-primary-glow">Lancer la séance 🏆</button>
        </div>
      </div>
    </div>

    <!-- 3. NAVIGATION MOBILE (BOTTOM BAR) -->
    <nav class="bottom-bar mobile-only">
      <router-link to="/dashboard" class="bottom-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span>Accueil</span>
      </router-link>
      <router-link to="/workouts" class="bottom-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/></svg>
        <span>Séances</span>
      </router-link>
      <a href="#" class="bottom-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        <span>Vidéos</span>
      </a>
      <a href="#" class="bottom-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        <span>Groupe</span>
      </a>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref(null);
const allWorkouts = ref([]);
const isModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedWorkout = ref(null);

const newWorkout = ref({
  title: '',
  category: '',
  intensity: 'Moyen',
  exercises: [
    { name: '', sets: 4, reps: '10', rest: 60 }
  ]
});

const fetchWorkouts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/workouts');
    if (response.ok) {
      allWorkouts.value = await response.json();
    }
  } catch (e) {
    console.error("Erreur de chargement des séances", e);
  }
};

onMounted(async () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      console.error('Erreur profil');
    }
  }
  await fetchWorkouts();
});

const openModal = () => {
  newWorkout.value = {
    title: '',
    category: '',
    intensity: 'Moyen',
    exercises: [
      { name: '', sets: 4, reps: '10', rest: 60 }
    ]
  };
  isModalOpen.value = true;
};
const closeModal = () => { isModalOpen.value = false; };

const openDetailModal = (workout) => {
  selectedWorkout.value = workout;
  isDetailModalOpen.value = true;
};
const closeDetailModal = () => { isDetailModalOpen.value = false; };

const addExerciseRow = () => {
  newWorkout.value.exercises.push({ name: '', sets: 4, reps: '10', rest: 60 });
};

const removeExerciseRow = (index) => {
  if (newWorkout.value.exercises.length > 1) {
    newWorkout.value.exercises.splice(index, 1);
  }
};

const createWorkout = async () => {
  try {
    // S'assurer que le payload envoie bien "exercises" ou "Exercises" selon le backend
    const payload = {
      title: newWorkout.value.title,
      category: newWorkout.value.category,
      intensity: newWorkout.value.intensity,
      exercises: newWorkout.value.exercises.map(ex => ({
        name: ex.name,
        sets: Number(ex.sets),
        reps: String(ex.reps),
        restSec: Number(ex.rest)
      }))
    };

    const response = await fetch('http://localhost:3000/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      closeModal();
      await fetchWorkouts();
    }
  } catch (e) {
    console.error("Erreur lors de la création de la séance", e);
  }
};

const startWorkoutSession = (id) => {
  router.push(`/workouts/${id}`);
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

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

/* SIDEBAR */
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
  display: flex; align-items: center; gap: 0.85rem; padding: 0.75rem 0.9rem;
  color: #9ca3af; text-decoration: none; font-size: 0.9rem; font-weight: 600; border-radius: 8px; transition: all 0.2s;
}
.nav-icon { width: 18px; height: 18px; }
.nav-item:hover { color: #ffffff; background-color: rgba(255, 255, 255, 0.04); }
.nav-item.active { color: #ff7a1a; background-color: rgba(255, 122, 26, 0.1); }
.nav-badge { margin-left: auto; font-size: 0.65rem; font-weight: 800; background-color: #ff7a1a; color: #000; padding: 0.15rem 0.4rem; border-radius: 4px; }

.sidebar-footer {
  padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex; align-items: center; justify-content: space-between;
}
.user-card-mini { display: flex; align-items: center; gap: 0.75rem; }
.avatar {
  width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #ff7a1a, #ff9e59);
  color: #000; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center;
}
.user-info { display: flex; flex-direction: column; }
.user-name { font-size: 0.85rem; font-weight: 700; color: #fff; }
.user-status { font-size: 0.7rem; color: #9ca3af; display: flex; align-items: center; gap: 0.3rem; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background-color: #10b981; }

.btn-icon-logout {
  background: transparent; border: none; color: #6b7280; cursor: pointer;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: all 0.2s;
}
.btn-icon-logout svg { width: 18px; height: 18px; }
.btn-icon-logout:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

/* MAIN WRAPPER */
.main-wrapper { flex: 1; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }

.topbar {
  height: 75px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex; align-items: center; justify-content: space-between; padding: 0 2rem;
  background-color: rgba(15, 17, 23, 0.5); backdrop-filter: blur(10px); flex-shrink: 0;
}
.header-main-top { display: flex; flex-direction: column; gap: 0.2rem; }
.pill-category { font-size: 0.6rem; font-weight: 800; color: #ff7a1a; letter-spacing: 1px; text-transform: uppercase; }
.topbar h1 { font-size: 1.2rem; font-weight: 800; margin: 0; color: #fff; }

.topbar-actions { display: flex; align-items: center; gap: 1rem; }

.btn-primary-glow {
  background: #ff7a1a; color: #000; border: none; padding: 0.7rem 1.2rem; border-radius: 12px;
  font-weight: 800; font-size: 0.82rem; cursor: pointer; box-shadow: 0 0 20px rgba(255, 122, 26, 0.3);
  transition: all 0.2s; text-align: center;
}
.btn-primary-glow:hover { transform: translateY(-2px); box-shadow: 0 0 25px rgba(255, 122, 26, 0.5); }

/* DASHBOARD BODY & GRID */
.dashboard-body { flex: 1; padding: 2rem; overflow-y: auto; }

.workouts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.workout-card {
  background: #0f1117;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.workout-card:hover {
  border-color: rgba(255, 122, 26, 0.3);
  transform: translateY(-2px);
}

.workout-card-top { display: flex; justify-content: space-between; align-items: center; }
.pill-category-small { font-size: 0.6rem; font-weight: 800; color: #ff7a1a; letter-spacing: 1px; text-transform: uppercase; }
.badge-intensity-small { font-size: 0.65rem; font-weight: 700; color: #9ca3af; background: #141722; padding: 0.15rem 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); }

.workout-card h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff; }
.workout-count-info { font-size: 0.78rem; color: #6b7280; margin: 0; }

.full-width-btn { width: 100%; margin-top: 0.5rem; }

/* MODAL POPUP */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(9, 10, 15, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 450px;
  background: #0f1117;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-card.large-modal { width: 650px; }

.modal-header { display: flex; justify-content: space-between; align-items: flex-start; }
.modal-header h3 { margin: 0; font-size: 1.2rem; font-weight: 800; color: #fff; }
.btn-close-modal { background: none; border: none; color: #6b7280; font-size: 1.1rem; cursor: pointer; }
.btn-close-modal:hover { color: #fff; }

.workout-form { display: flex; flex-direction: column; gap: 1rem; }
.form-row { display: flex; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }

.form-group label { font-size: 0.75rem; font-weight: 700; color: #9ca3af; }
.form-group input, .form-group select {
  background: #141722; border: 1px solid rgba(255,255,255,0.08); padding: 0.65rem 0.8rem;
  border-radius: 10px; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem; outline: none; transition: all 0.2s;
}
.form-group input:focus, .form-group select:focus { border-color: #ff7a1a; }

.exercises-config-section {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-sub-header { display: flex; justify-content: space-between; align-items: center; }
.section-sub-header h4 { margin: 0; font-size: 0.85rem; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; }

.btn-small-add {
  background: rgba(255, 122, 26, 0.1); color: #ff7a1a; border: 1px dashed rgba(255, 122, 26, 0.4);
  padding: 0.3rem 0.7rem; border-radius: 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.btn-small-add:hover { background: rgba(255, 122, 26, 0.2); }

.exercises-rows-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.2rem;
}

.exercise-row-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  background: #141722;
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.04);
}

.btn-delete-row {
  background: transparent; border: none; color: #6b7280; cursor: pointer;
  height: 35px; width: 30px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; border-radius: 6px;
}
.btn-delete-row:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.modal-actions { display: flex; gap: 1rem; margin-top: 0.5rem; }
.modal-actions button { flex: 1; }

.btn-secondary-flat {
  background: transparent; color: #9ca3af; border: 1px solid rgba(255,255,255,0.08); padding: 0.7rem; border-radius: 12px;
  font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; text-align: center;
}
.btn-secondary-flat:hover { color: #fff; border-color: rgba(255,255,255,0.2); }

/* DETAILS MODAL */
.modal-body-details { display: flex; flex-direction: column; gap: 1rem; }
.detail-intensity-box { font-size: 0.82rem; color: #9ca3af; background: #141722; padding: 0.6rem 0.9rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); }
.detail-intensity-box strong { color: #fff; }

.tooltip-title {
  font-size: 0.72rem;
  font-weight: 800;
  color: #ff7a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-list {
  margin: 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #9ca3af;
  max-height: 200px;
  overflow-y: auto;
}

.detail-list strong { color: #fff; font-size: 0.9rem; display: block; }
.ex-sub-details { font-size: 0.75rem; color: #6b7280; margin-top: 0.1rem; }
.empty-tip { list-style: none; color: #6b7280; font-style: italic; margin-left: -1.2rem; }

/* MOBILE NAVIGATION */
@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }

  .app-container { flex-direction: column; }
  .main-wrapper { height: calc(100vh - 60px); }
  .topbar { padding: 0 1.25rem; }
  .dashboard-body { padding: 1.25rem; }

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