<template>
  <div class="app-main-wrapper">
    <Register />
  </div>
</template>

<script setup>
import Register from './components/Register/Register.vue';
</script>

<style>
/* 1. Reset total de la page pour le mode Pure Deep Black */
html, body {
  background-color: #000000 !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 100vh !important;
  overflow-x: hidden;
}

/* 2. On casse les styles par défaut appliqués par le sélecteur #app de Vite */
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
</style>