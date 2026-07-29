<template>
  <div class="auth-container">
    <div class="auth-branding">
      <div class="logo-wrapper">
        <img src="../../../src/assets/logo.png" alt="Sportero Logo" class="logo-icon" />
        <h1 class="logo-text">SPORTERO</h1>
      </div>
      <p class="tagline">
        L'évolution du fitness connecté. Créez des entraînements sur mesure, intégrez vos vidéos
        YouTube favorites et partagez vos séances en groupe et en temps réel.
      </p>
    </div>

    <div class="auth-card-wrapper">
      <div class="auth-card">
        <h2 class="card-title">Connexion</h2>
        <p class="card-subtitle">Connectez-vous pour accéder à votre espace Sportero</p>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="identifier">Pseudo ou Adresse mail</label>
            <input type="text" id="identifier" v-model="formData.identifier" required />
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input type="password" id="password" v-model="formData.password" required />
          </div>

          <div v-if="errorMessage" class="alert-error">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="alert-success">
            {{ successMessage }}
          </div>

          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'Connexion en cours...' : 'Se connecter →' }}
          </button>
        </form>

        <hr class="divider" />

        <p class="switch-auth">Nouveau sur Sportero ? <router-link to="/register">Créez un compte</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  identifier: '',
  password: ''
});

const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
  const response = await axios.post('http://localhost:3000/api/auth/login', {
    identifier: formData.value.identifier,
    password: formData.value.password
  });

  console.log('1. Réponse reçue du serveur :', response.data);

  // Sauvegarde
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));

  console.log('2. Token enregistré dans localStorage :', localStorage.getItem('token'));

  // Tentative de redirection
  console.log('3. Tentative de redirection vers /dashboard...');
  
  // Utilisation de la redirection native par précaution
  window.location.href = '/dashboard';

} catch (error) {
  console.error('Erreur attrapée :', error);
  if (error.response && error.response.data) {
    errorMessage.value = error.response.data.message;
  } else {
    errorMessage.value = 'Impossible de contacter le serveur. Vérifie ta connexion.';
  }
} finally {
  isLoading.value = false;
}
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

.auth-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  gap: 6rem;
  font-family: 'Inter', sans-serif !important;
  background-color: #000000;
}

.auth-branding {
  flex: 1;
  max-width: 500px;
  text-align: left;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 65px;
  height: auto;
}

.logo-text {
  font-size: 3.5rem;
  font-weight: 800 !important;
  color: #ff7a1a !important;
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1;
  font-family: 'Inter', sans-serif !important;
}

.tagline {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #ffffff !important;
  font-weight: 400 !important;
  margin: 0;
  font-family: 'Inter', sans-serif !important;
}

.auth-card-wrapper {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.auth-card {
  background-color: #0f1013 !important;
  border: 1px solid rgba(255, 122, 26, 0.25) !important;
  border-radius: 12px !important;
  padding: 3.5rem 2.5rem 2.5rem 2.5rem !important;
  width: 100%;
  max-width: 450px;
  position: relative;
  box-sizing: border-box;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 15px;
  right: 15px;
  width: 35px;
  height: 35px;
  border-top: 2px solid #ff7a1a !important;
  border-right: 2px solid #ff7a1a !important;
}

.card-title {
  font-size: 1.85rem;
  font-weight: 700 !important;
  margin: 0 0 0.5rem 0;
  color: #ffffff !important;
  font-family: 'Inter', sans-serif !important;
}

.card-subtitle {
  color: #a0a0a0 !important;
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0 0 2.5rem 0;
  font-family: 'Inter', sans-serif !important;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 600 !important;
  color: #ffffff !important;
  text-align: left;
  font-family: 'Inter', sans-serif !important;
}

.form-group input {
  background-color: #d9d9d9 !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 0.85rem 1rem !important;
  font-size: 1rem !important;
  color: #000000 !important;
  font-family: 'Inter', sans-serif !important;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.btn-submit {
  background-color: #ff7a1a !important;
  color: #000000 !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 1rem !important;
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  font-family: 'Inter', sans-serif !important;
  cursor: pointer;
  width: 100%;
  margin-top: 0.5rem;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #e66b15 !important;
}

.divider {
  border: none !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
  margin: 2rem 0 1.5rem 0;
}

.switch-auth {
  text-align: center;
  font-size: 0.95rem;
  color: #ffffff !important;
  margin: 0;
  font-family: 'Inter', sans-serif !important;
}

.switch-auth a {
  color: #ff7a1a !important;
  text-decoration: none;
  font-weight: 600 !important;
}

.switch-auth a:hover {
  text-decoration: underline !important;
}

.alert-error {
  color: #ff3333;
  background-color: rgba(255, 51, 51, 0.1);
  border: 1px solid rgba(255, 51, 51, 0.3);
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: left;
}

.alert-success {
  color: #22c55e;
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: left;
}

.btn-submit:disabled {
  background-color: #ff7a1a80 !important;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .auth-container {
    flex-direction: column;
    gap: 3rem;
    text-align: center;
  }
  .logo-wrapper {
    justify-content: center;
  }
  .auth-branding {
    max-width: 100%;
  }
  .auth-card-wrapper {
    justify-content: center;
  }
}
</style>