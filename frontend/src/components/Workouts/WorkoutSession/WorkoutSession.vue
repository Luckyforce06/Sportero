<template>
  <div class="session-fullscreen">
    <!-- TOPBAR FULLSCREEN -->
    <header class="session-topbar">
      <div class="topbar-left">
        <div class="live-badge-wrapper">
          <span class="live-pulse-dot"></span>
          <span class="live-badge">LIVE SESSION</span>
        </div>
        <div class="workout-info-top">
          <h1>{{ workout?.title || 'Entraînement en cours' }}</h1>
          <div class="global-progress-wrapper">
            <span class="global-timer">⏱️ {{ formatTime(totalElapsedTime) }}</span>
            <div class="mini-progress-bar">
              <div class="mini-progress-fill" :style="{ width: globalProgressPercentage + '%' }"></div>
            </div>
            <span class="global-progress-text">{{ completedSetsCount }} / {{ totalSetsCount }} séries ({{ globalProgressPercentage }}%)</span>
          </div>
        </div>
      </div>

      <!-- ENCARTS VISUELS DES PARTICIPANTS LIVE -->
      <div class="live-participants-bar" v-if="Object.keys(activeParticipants).length > 0">
        <span class="live-participants-title">👥 EN DIRECT</span>
        <div class="participants-scroll-container">
          <div 
            v-for="(data, socketId) in activeParticipants" 
            :key="socketId" 
            class="participant-chip"
          >
            <span class="p-dot"></span>
            <div class="participant-info-col">
              <span class="p-id">{{ data.pseudo }}</span>
              <span class="p-live-exercise">
                🔥 {{ data.exerciseName || ('Exo ' + (data.exerciseIndex + 1)) }} (S. {{ data.currentSet }})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="topbar-right">
        <button @click="isInviteModalOpen = true" class="btn-action btn-invite">
          <span>👥</span> Inviter
        </button>
        <button @click="quitSession" class="btn-action btn-quit">Abandonner</button>
        <button @click="finishSession" class="btn-action btn-finish">Terminer 🏁</button>
      </div>
    </header>

    <!-- CORPS PLEIN ÉCRAN RESPONSIVE -->
    <main class="session-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement de ta séance de champion...</p>
      </div>

      <div v-else-if="currentExercise" class="session-grid">
        
        <!-- COLONNE GAUCHE : NAVIGATION / LISTE DES EXERCICES -->
        <aside class="exercises-sidebar">
          <h3>Feuille de route</h3>
          <div class="sidebar-list">
            <div 
              v-for="(ex, idx) in exercises" 
              :key="idx"
              @click="currentExerciseIndex = idx"
              class="sidebar-item"
              :class="{ 
                active: currentExerciseIndex === idx, 
                completed: isExerciseCompleted(idx) 
              }"
            >
              <div class="sb-indicator-bar"></div>
              <span class="sb-number">#{{ idx + 1 }}</span>
              <div class="sb-details">
                <span class="sb-name">{{ ex.name }}</span>
                <span class="sb-status">{{ getExerciseProgressText(idx) }}</span>
              </div>
              <span class="sb-check-icon" v-if="isExerciseCompleted(idx)">✓</span>
            </div>
          </div>
        </aside>

        <!-- COLONNE DROITE : FOCUS EXERCICE ACTIF & SÉRIES -->
        <section class="active-exercise-panel">
          <div class="panel-header">
            <div>
              <span class="step-indicator">EXERCICE {{ currentExerciseIndex + 1 }} SUR {{ exercises.length }}</span>
              <h2>{{ currentExercise.name }}</h2>
            </div>
            <div class="panel-header-right">
              <div class="exercise-progress-badge">
                <div class="badge-text-row">
                  <span>Progression</span>
                  <strong>{{ currentExerciseCompletedSetsCount }} / {{ currentExerciseTotalSets }}</strong>
                </div>
                <div class="ex-progress-track">
                  <div class="ex-progress-fill" :style="{ width: currentExerciseProgressPercentage + '%' }"></div>
                </div>
              </div>
              <span class="category-pill">{{ currentExercise.category || workout?.category || 'Musculation' }}</span>
            </div>
          </div>

          <!-- TABLEAU DES SÉRIES -->
          <div class="sets-container">
            <div class="sets-header-row">
              <span>SÉRIE</span>
              <span>OBJECTIF & RÉCUPÉRATION</span>
              <span>STATUT / ACTION</span>
            </div>

            <div 
              v-for="setIndex in getTargetSets(currentExercise)" 
              :key="setIndex"
              class="set-line"
              :class="{ 'is-done': isSetCompleted(currentExerciseIndex, setIndex) }"
            >
              <div class="set-idx-wrapper">
                <span class="set-idx">S{{ setIndex }}</span>
              </div>
              <div class="set-desc">
                <span class="reps-pill">💪 {{ getTargetReps(currentExercise) }} reps</span>
                <span class="rest-pill">⏳ {{ getTargetRest(currentExercise) }}s repos</span>
              </div>
              <button 
                @click="validateSetAndRest(currentExerciseIndex, setIndex, getTargetRest(currentExercise))"
                class="btn-validate-set"
                :class="{ 'done': isSetCompleted(currentExerciseIndex, setIndex) }"
              >
                <span class="btn-icon">{{ isSetCompleted(currentExerciseIndex, setIndex) ? '🔥' : '⚡' }}</span>
                {{ isSetCompleted(currentExerciseIndex, setIndex) ? 'Validé' : 'Valider la série' }}
              </button>
            </div>
          </div>

          <!-- FOOTER NAVIGATION EXERCICES -->
          <div class="panel-footer-nav">
            <button @click="prevExercise" :disabled="currentExerciseIndex === 0" class="btn-nav">
              ← Exercice précédent
            </button>
            <button @click="nextExercise" :disabled="currentExerciseIndex === exercises.length - 1" class="btn-nav primary">
              Exercice suivant →
            </button>
          </div>
        </section>

      </div>
    </main>

    <!-- MODALE DE SÉLECTION DES AMIS -->
    <transition name="fade">
      <div v-if="isInviteModalOpen" class="modal-overlay" @click.self="isInviteModalOpen = false">
        <div class="modal-card">
          <div class="modal-header">
            <h3>👥 Inviter un partenaire</h3>
            <button @click="isInviteModalOpen = false" class="close-modal-btn">✕</button>
          </div>
          
          <div class="modal-body">
            <div v-if="friends.length === 0" class="empty-friends">
              Aucun ami enregistré pour le moment.
            </div>
            <div v-else class="friends-invite-list">
              <div v-for="friend in friends" :key="friend.id" class="friend-invite-row">
                <div class="friend-info-left">
                  <div class="avatar-circle">{{ friend.pseudo.substring(0, 2).toUpperCase() }}</div>
                  <div>
                    <span class="friend-pseudo">{{ friend.pseudo }}</span>
                    <span class="friend-status" :class="{ online: isFriendOnline(friend.id) }">
                      {{ isFriendOnline(friend.id) ? '🟢 En ligne' : '⚪ Hors ligne' }}
                    </span>
                  </div>
                </div>
                <button 
                  class="btn-send-invite" 
                  :disabled="!isFriendOnline(friend.id)"
                  @click="sendInviteToFriend(friend)"
                >
                  {{ isFriendOnline(friend.id) ? 'Inviter 🚀' : 'Indisponible' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- OVERLAY DE DÉCOMPTE PRÉ-REPOS -->
    <transition name="fade">
      <div v-if="isCountingDown" class="countdown-overlay">
        <div class="countdown-card">
          <span class="countdown-subtitle">PRÉPARE-TOI • PROCHAINE ÉTAPE</span>
          <div class="countdown-number">{{ countdownValue }}</div>
          <p class="countdown-info">Le repos se lance dans un instant...</p>
          <button @click="cancelCountdown" class="btn-cancel-cd">Annuler le décompte</button>
        </div>
      </div>
    </transition>

    <!-- BANDEAU DE REPOS PLEIN ÉCRAN FIXE EN BAS -->
    <transition name="slide-up">
      <div v-if="isResting" class="rest-banner-fullscreen">
        <div class="rest-info">
          <div class="rest-icon-pulse">⏳</div>
          <div>
            <span class="rest-title">RÉCUPÉRATION EN COURS</span>
            <div class="rest-countdown">{{ restTimeLeft }}s</div>
          </div>
        </div>
        <div class="rest-progress-bar-bg">
          <div class="rest-progress-bar-fill"></div>
        </div>
        <div class="rest-controls">
          <button @click="addRestTime(-15)" class="btn-time">-15s</button>
          <button @click="addRestTime(15)" class="btn-time">+15s</button>
          <button @click="stopRest" class="btn-skip">Passer le repos ⚡</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { socket } from '../../../services/socker';
import friendService from '../../../services/friendService.ts';

const route = useRoute();
const router = useRouter();

const workout = ref(null);
const exercises = ref([]);
const currentExerciseIndex = ref(0);
const loading = ref(true);

const completedSets = ref({});
const totalElapsedTime = ref(0);
let globalTimerInterval = null;

const isResting = ref(false);
const restTimeLeft = ref(0);
let restTimerInterval = null;

const isInviteModalOpen = ref(false);
const friends = ref([]);
const onlineUserIds = ref([]);
const activeParticipants = ref({});

const isAutoPilotActive = ref(false);
const isCountingDown = ref(false);
const countdownValue = ref(3);
let countdownInterval = null;

// Récupération sécurisée du pseudo de l'utilisateur connecté
const getMyPseudo = () => {
  // Si vos informations utilisateur sont stockées dans un objet JSON "user" ou "currentUser" :
  const userJson = localStorage.getItem('user') || localStorage.getItem('currentUser');
  if (userJson) {
    try {
      const parsed = JSON.parse(userJson);
      if (parsed.pseudo || parsed.username || parsed.name) {
        return parsed.pseudo || parsed.username || parsed.name;
      }
    } catch (e) {
      // Ignore si ce n'est pas du JSON
    }
  }

  // Sinon, vérifie les clés directes du localStorage
  return localStorage.getItem('pseudo') || 
         localStorage.getItem('username') || 
         localStorage.getItem('userPseudo') || 
         'Membre';
};

const currentExercise = computed(() => {
  return exercises.value[currentExerciseIndex.value] || null;
});

const loadFriends = async () => {
  try {
    friends.value = await friendService.getFriends();
  } catch (e) {
    console.error("Erreur chargement amis", e);
  }
};

const isFriendOnline = (friendId) => {
  return onlineUserIds.value.map(id => String(id)).includes(String(friendId));
};

const sendInviteToFriend = (friend) => {
  socket.emit('invite_friend', {
    friendUserId: friend.id,
    workoutId: route.params.id,
    workoutTitle: workout.value?.title
  });
  alert(`Invitation envoyée à ${friend.pseudo} ! 🚀`);
  isInviteModalOpen.value = false;
};

const totalSetsCount = computed(() => {
  let count = 0;
  exercises.value.forEach(ex => {
    count += Number(ex.WorkoutExercice?.sets || ex.sets || 4);
  });
  return count;
});

const completedSetsCount = computed(() => {
  return Object.values(completedSets.value).filter(Boolean).length;
});

const globalProgressPercentage = computed(() => {
  if (totalSetsCount.value === 0) return 0;
  return Math.round((completedSetsCount.value / totalSetsCount.value) * 100);
});

const currentExerciseTotalSets = computed(() => {
  if (!currentExercise.value) return 0;
  return Number(currentExercise.value.WorkoutExercice?.sets || currentExercise.value.sets || 4);
});

const currentExerciseCompletedSetsCount = computed(() => {
  if (!currentExercise.value) return 0;
  let count = 0;
  const total = currentExerciseTotalSets.value;
  for (let i = 1; i <= total; i++) {
    if (completedSets.value[`${currentExerciseIndex.value}-${i}`]) {
      count++;
    }
  }
  return count;
});

const currentExerciseProgressPercentage = computed(() => {
  if (currentExerciseTotalSets.value === 0) return 0;
  return Math.round((currentExerciseCompletedSetsCount.value / currentExerciseTotalSets.value) * 100);
});

const fetchWorkoutDetails = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token'); 

    const response = await fetch(`http://localhost:3000/api/workouts/${route.params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });

    if (response.ok) {
      const data = await response.json();
      workout.value = data;
      exercises.value = data.Exercises || data.exercises || [];
      emitCurrentProgress(0, 1, 'active');
    }
  } catch (e) {
    console.error("Erreur chargement session", e);
  } finally {
    loading.value = false;
  }
};

// Fonction centralisée d'émission et de mise à jour locale instantanée
const emitCurrentProgress = (exIdx, setIdx, status = 'active') => {
  const ex = exercises.value[exIdx];
  const userPseudo = getMyPseudo();
  
  const progressData = {
    workoutId: route.params.id,
    exerciseIndex: exIdx,
    exerciseName: ex ? ex.name : '',
    currentSet: setIdx,
    status: status,
    pseudo: userPseudo
  };

  // 1. Mise à jour instantanée pour soi-même (évite le délai ou l'absence d'affichage)
  if (socket.id) {
    if (status === 'unvalidated' || status === 'reset') {
      delete activeParticipants.value[socket.id];
    } else {
      activeParticipants.value[socket.id] = {
        exerciseIndex: exIdx,
        exerciseName: ex ? ex.name : '',
        currentSet: setIdx,
        status: status,
        pseudo: userPseudo
      };
    }
  }

  // 2. Envoi au serveur pour synchroniser les autres participants de la room
  socket.emit('update_progress', progressData);
};

onMounted(() => {
  fetchWorkoutDetails();
  loadFriends();
  
  socket.connect();

  socket.emit('register_user', {
    pseudo: getMyPseudo()
  });
  
  if (route.params.id) {
    socket.emit('join_workout_room', route.params.id);
  }

  // Écoute des progressions des autres utilisateurs connectés à la room
  socket.on('participant_progress', (data) => {
    if (data.socketId !== socket.id) {
      if (data.status === 'unvalidated' || data.status === 'reset') {
        delete activeParticipants.value[data.socketId];
      } else {
        activeParticipants.value[data.socketId] = {
          exerciseIndex: data.exerciseIndex,
          exerciseName: data.exerciseName,
          currentSet: data.currentSet,
          status: data.status,
          pseudo: data.pseudo
        };
      }
    }
  });

  socket.on('online_users', (userIds) => {
    onlineUserIds.value = userIds;
  });

  globalTimerInterval = setInterval(() => {
    totalElapsedTime.value++;
  }, 1000);
});

watch(currentExerciseIndex, (newIdx) => {
  emitCurrentProgress(newIdx, 1, 'active');
});

watch(() => route.params.id, (newWorkoutId) => {
  if (newWorkoutId) {
    socket.emit('join_workout_room', newWorkoutId);
    completedSets.value = {};
    activeParticipants.value = {};
    currentExerciseIndex.value = 0;
    totalElapsedTime.value = 0;
    fetchWorkoutDetails();
  }
});

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getTargetSets = (ex) => {
  const count = ex.WorkoutExercice?.sets || ex.sets || 4;
  return Array.from({ length: Number(count) }, (_, i) => i + 1);
};

const getTargetReps = (ex) => {
  return ex.WorkoutExercice?.reps || ex.reps || '10';
};

const getTargetRest = (ex) => {
  return Number(ex.WorkoutExercice?.restSec || ex.restSec || 60);
};

const isSetCompleted = (exIdx, setIdx) => {
  return !!completedSets.value[`${exIdx}-${setIdx}`];
};

const isExerciseCompleted = (exIdx) => {
  const ex = exercises.value[exIdx];
  if (!ex) return false;
  const setsCount = Number(ex.WorkoutExercice?.sets || ex.sets || 4);
  for (let i = 1; i <= setsCount; i++) {
    if (!completedSets.value[`${exIdx}-${i}`]) return false;
  }
  return true;
};

const getExerciseProgressText = (exIdx) => {
  const ex = exercises.value[exIdx];
  if (!ex) return '';
  const setsCount = Number(ex.WorkoutExercice?.sets || ex.sets || 4);
  let doneCount = 0;
  for (let i = 1; i <= setsCount; i++) {
    if (completedSets.value[`${exIdx}-${i}`]) doneCount++;
  }
  return `${doneCount}/${setsCount} séries`;
};

const validateSetAndRest = (exIdx, setIdx, restSec) => {
  const key = `${exIdx}-${setIdx}`;
  const currentlyDone = completedSets.value[key];

  if (currentlyDone) {
    // Dévalidation de la série : on met à jour l'état et on prévient le live
    completedSets.value[key] = false;
    emitCurrentProgress(exIdx, setIdx, 'unvalidated');
    return;
  }

  // Validation de la série
  completedSets.value[key] = true;
  emitCurrentProgress(exIdx, setIdx, 'completed');

  if (isAutoPilotActive.value) {
    startCountdownBeforeRest(restSec, exIdx, setIdx);
  } else {
    startRestTimer(restSec);
    checkAutoAdvanceExercise(exIdx, setIdx);
  }
};

const startCountdownBeforeRest = (restSec, exIdx, setIdx) => {
  if (countdownInterval) clearInterval(countdownInterval);
  if (restTimerInterval) clearInterval(restTimerInterval);
  isResting.value = false;

  countdownValue.value = 3;
  isCountingDown.value = true;

  countdownInterval = setInterval(() => {
    if (countdownValue.value > 1) {
      countdownValue.value--;
    } else {
      clearInterval(countdownInterval);
      isCountingDown.value = false;
      startRestTimer(restSec);
      checkAutoAdvanceExercise(exIdx, setIdx);
    }
  }, 1000);
};

const cancelCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval);
  isCountingDown.value = false;
};

const checkAutoAdvanceExercise = (exIdx, setIdx) => {
  const totalSets = getTargetSets(exercises.value[exIdx]).length;
  if (setIdx === totalSets && exIdx < exercises.value.length - 1) {
    const unwatchRest = setInterval(() => {
      if (!isResting.value) {
        clearInterval(unwatchRest);
        if (currentExerciseIndex.value === exIdx) {
          currentExerciseIndex.value++;
        }
      }
    }, 500);
  }
};

const startRestTimer = (seconds) => {
  if (restTimerInterval) clearInterval(restTimerInterval);
  restTimeLeft.value = seconds;
  isResting.value = true;

  restTimerInterval = setInterval(() => {
    if (restTimeLeft.value > 0) {
    restTimeLeft.value--;
    } else {
      stopRest();
    }
  }, 1000);
};

const stopRest = () => {
  if (restTimerInterval) clearInterval(restTimerInterval);
  isResting.value = false;
};

const addRestTime = (sec) => {
  restTimeLeft.value = Math.max(0, restTimeLeft.value + sec);
};

const nextExercise = () => {
  stopRest();
  cancelCountdown();
  if (currentExerciseIndex.value < exercises.value.length - 1) {
    currentExerciseIndex.value++;
  }
};

const prevExercise = () => {
  stopRest();
  cancelCountdown();
  if (currentExerciseIndex.value > 0) {
    currentExerciseIndex.value--;
  }
};

const quitSession = () => {
  if (confirm("Voulez-vous abandonner l'entraînement en cours ?")) {
    clearAllTimers();
    router.push('/workouts');
  }
};

const finishSession = () => {
  clearAllTimers();
  alert("Séance enregistrée avec succès ! 🔥💪");
  router.push('/workouts');
};

const clearAllTimers = () => {
  if (globalTimerInterval) clearInterval(globalTimerInterval);
  if (restTimerInterval) clearInterval(restTimerInterval);
  if (countdownInterval) clearInterval(countdownInterval);
};

onUnmounted(() => {
  clearAllTimers();
  socket.off('participant_progress');
  socket.off('online_users');
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');

.session-fullscreen {
  position: fixed;
  inset: 0;
  background-color: #07090e;
  color: #f3f4f6;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow: hidden;
  user-select: none;
}

/* TOPBAR */
.session-topbar {
  height: 80px;
  background-color: rgba(13, 16, 23, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  flex-shrink: 0;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.live-badge-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
}

.live-pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  box-shadow: 0 0 10px #ef4444;
  animation: pulse-dot 1.5s infinite;
}

.live-badge {
  color: #ef4444;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 1px;
}

.workout-info-top {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.workout-info-top h1 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
}

.global-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.global-timer {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 700;
}

.mini-progress-bar {
  width: 100px;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff7a1a, #10b981);
  border-radius: 3px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.global-progress-text {
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: 700;
}

/* PARTICIPANTS BAR */
.live-participants-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.35rem 0.75rem;
  border-radius: 14px;
  max-width: 450px;
}

.live-participants-title {
  font-size: 0.65rem;
  font-weight: 800;
  color: #9ca3af;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.participants-scroll-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.1rem;
}

.participant-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #121622;
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 0.3rem 0.75rem;
  border-radius: 10px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.participant-chip .p-dot {
  width: 6px;
  height: 6px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

.participant-info-col {
  display: flex;
  flex-direction: column;
}

.p-id {
  font-weight: 800;
  color: #fff;
  font-size: 0.7rem;
}

.p-live-exercise {
  color: #10b981;
  font-weight: 700;
  font-size: 0.65rem;
}

/* TOPBAR ACTIONS */
.topbar-right {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-action {
  padding: 0.6rem 1.1rem;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-invite {
  background: rgba(255, 122, 26, 0.1);
  border: 1px solid rgba(255, 122, 26, 0.3);
  color: #ff7a1a;
}
.btn-invite:hover {
  background: rgba(255, 122, 26, 0.2);
}

.btn-quit {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #ef4444;
}
.btn-quit:hover {
  background: rgba(239, 68, 68, 0.1);
}

.btn-finish {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);
}
.btn-finish:hover {
  transform: translateY(-1px);
}

/* MAIN CONTENT */
.session-content {
  flex: 1;
  width: 100%;
  padding: 1.5rem;
  overflow-y: auto;
  box-sizing: border-box;
}

.session-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1.5rem;
  max-width: 1500px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* SIDEBAR EXERCICES */
.exercises-sidebar {
  background: #0d1017;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.exercises-sidebar h3 {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 800;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  padding-left: 0.5rem;
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.sidebar-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem;
  background: #131722;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidebar-item:hover {
  border-color: rgba(255, 122, 26, 0.3);
  background: #171c2b;
}

.sidebar-item.active {
  border-color: #ff7a1a;
  background: rgba(255, 122, 26, 0.06);
  box-shadow: 0 4px 20px rgba(255, 122, 26, 0.1);
}

.sidebar-item.completed {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.03);
}

.sb-indicator-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: transparent;
  transition: background 0.2s;
}
.sidebar-item.active .sb-indicator-bar {
  background: #ff7a1a;
}
.sidebar-item.completed .sb-indicator-bar {
  background: #10b981;
}

.sb-number {
  font-size: 0.8rem;
  font-weight: 800;
  color: #9ca3af;
}

.sb-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
}

.sb-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
}

.sb-status {
  font-size: 0.7rem;
  color: #9ca3af;
  font-weight: 600;
}

.sb-check-icon {
  color: #10b981;
  font-weight: 900;
  font-size: 0.9rem;
}

/* PANNEAU ACTIF EXERCICE */
.active-exercise-panel {
  background: #0d1017;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 1.5rem;
  margin-bottom: 1.75rem;
}

.step-indicator {
  font-size: 0.7rem;
  font-weight: 800;
  color: #ff7a1a;
  letter-spacing: 1.5px;
}

.panel-header h2 {
  margin: 0.4rem 0 0 0;
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.5px;
}

.panel-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.85rem;
}

.exercise-progress-badge {
  background: #131722;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 140px;
}

.badge-text-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.exercise-progress-badge strong {
  color: #fff;
  font-weight: 800;
}

.ex-progress-track {
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.ex-progress-fill {
  height: 100%;
  background: #ff7a1a;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.category-pill {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #9ca3af;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* SÉRIES TABLE */
.sets-container {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1.5rem;
}

.sets-header-row {
  display: grid;
  grid-template-columns: 90px 1fr 180px;
  font-size: 0.7rem;
  font-weight: 800;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 1.25rem;
}

.set-line {
  display: grid;
  grid-template-columns: 90px 1fr 180px;
  align-items: center;
  background: #131722;
  padding: 1.15rem 1.25rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.2s ease;
}

.set-line:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

.set-line.is-done {
  background: rgba(16, 185, 129, 0.04);
  border-color: rgba(16, 185, 129, 0.25);
}

.set-idx {
  font-weight: 900;
  color: #fff;
  font-size: 1.05rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
}

.set-desc {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-size: 0.9rem;
}

.reps-pill, .rest-pill {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-weight: 700;
  color: #d1d5db;
  font-size: 0.8rem;
}

.btn-validate-set {
  background: #1a2030;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-validate-set:hover {
  background: #22293d;
  color: #fff;
}

.btn-validate-set.done {
  background: #10b981;
  border-color: #10b981;
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

/* FOOTER NAV */
.panel-footer-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn-nav {
  background: #131722;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 0.9rem 1.75rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-nav:hover:not(:disabled) {
  background: #1b2133;
}

.btn-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-nav.primary {
  background: rgba(255, 122, 26, 0.15);
  border-color: rgba(255, 122, 26, 0.3);
  color: #ff7a1a;
}
.btn-nav.primary:hover:not(:disabled) {
  background: rgba(255, 122, 26, 0.25);
}

/* MODALES & OVERLAYS */
.modal-overlay, .countdown-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 6, 10, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30000;
}

.modal-card {
  background: #0d1017;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  width: 90%;
  max-width: 460px;
  padding: 1.75rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 900;
  color: #fff;
}

.close-modal-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.2rem;
  cursor: pointer;
}

.friends-invite-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 320px;
  overflow-y: auto;
}

.friend-invite-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #131722;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.friend-info-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.avatar-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 122, 26, 0.15);
  color: #ff7a1a;
  font-weight: 900;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.friend-pseudo {
  font-weight: 800;
  font-size: 0.95rem;
  color: #fff;
  display: block;
}

.friend-status {
  font-size: 0.75rem;
  color: #6b7280;
}
.friend-status.online {
  color: #10b981;
}

.btn-send-invite {
  background-color: #ff7a1a;
  color: #000;
  border: none;
  font-weight: 800;
  padding: 0.55rem 1rem;
  border-radius: 9px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: opacity 0.2s;
}
.btn-send-invite:disabled {
  background-color: #1a1e2b;
  color: #6b7280;
  cursor: not-allowed;
}

.empty-friends {
  color: #6b7280;
  text-align: center;
  font-size: 0.9rem;
  padding: 2rem 0;
}

/* COUNTDOWN OVERLAY */
.countdown-card {
  background: #0d1017;
  border: 2px solid #ff7a1a;
  border-radius: 28px;
  padding: 3.5rem 4.5rem;
  text-align: center;
  box-shadow: 0 0 60px rgba(255, 122, 26, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.countdown-subtitle {
  font-size: 0.75rem;
  font-weight: 900;
  color: #ff7a1a;
  letter-spacing: 2px;
}

.countdown-number {
  font-size: 6.5rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.countdown-info {
  font-size: 0.95rem;
  color: #9ca3af;
  margin: 0 0 1rem 0;
}

.btn-cancel-cd {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
}

/* REST BANNER FULLSCREEN */
.rest-banner-fullscreen {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #0d1017;
  border-top: 2px solid #ff7a1a;
  padding: 1.75rem 3.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.95);
  z-index: 10000;
}

.rest-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.rest-icon-pulse {
  font-size: 2.5rem;
  animation: pulse-dot 1s infinite alternate;
}

.rest-title {
  font-size: 0.7rem;
  font-weight: 900;
  color: #ff7a1a;
  letter-spacing: 1.5px;
}

.rest-countdown {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
}

.rest-controls {
  display: flex;
  gap: 1rem;
}

.btn-time, .btn-skip {
  background: #131722;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 0.85rem 1.4rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-time:hover, .btn-skip:hover {
  background: #1b2133;
}

.btn-skip {
  background: rgba(255, 122, 26, 0.15);
  border-color: rgba(255, 122, 26, 0.4);
  color: #ff7a1a;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 60vh;
  color: #6b7280;
  font-weight: 700;
  font-size: 1.1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: #ff7a1a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse-dot {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}

/* RESPONSIVE DESIGN */
@media (max-width: 900px) {
  .session-grid {
    grid-template-columns: 1fr;
  }
  .exercises-sidebar {
    display: none;
  }
  .rest-banner-fullscreen {
    padding: 1.25rem 1.5rem;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  .rest-controls {
    justify-content: space-between;
  }
  .panel-header h2 {
    font-size: 1.6rem;
  }
  .sets-header-row, .set-line {
    grid-template-columns: 70px 1fr 130px;
    padding: 0.75rem;
  }
}
</style>