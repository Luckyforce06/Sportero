** Sportero 🏋️‍♂️🔥

> **Sportero** est une application web moderne de fitness et d'entraînement sur-mesure. Conçue pour centraliser la gestion de vos séances personnelles et dynamiser la motivation grâce à un mode collaboratif en temps réel.

---

## 🚀 Fonctionnalités Clés

* **Tableau de Bord Intuitif :** Espace d'accueil personnalisé affichant le profil de l'athlète et un accès direct aux fonctionnalités principales.
* **Personnalisation des Séances :** Création, configuration et modification d'exercices, de séries et de temps de repos adaptés à vos objectifs.
* **Mode Salon Collaboratif (Live) :** Partagez et suivez des sessions de sport en direct avec vos amis, où que vous soyez.
* **Espace Communauté :** Gestion des contacts, ajout d'amis et interactions pour rester motivé ensemble.
* **Design Multiplateforme :** Interface responsive optimisée pour une navigation fluide sur ordinateur (sidebar fixe) et sur mobile (barre de navigation tactile).

---

## 🛠️ Stack Technique

* **Front-end :** Vue.js 3 (Composition API), Vue Router
* **Style & UI :** CSS Grid, Flexbox, Design system sur-mesure (mode sombre, teintes orange et gris foncé)
* **Stockage & Session :** Gestion locale (`localStorage`) et authentification sécurisée

---

## 📂 Structure du Projet

```text
sportero/
├── src/
│   ├── assets/       # Logos et ressources graphiques
│   ├── components/   # Composants réutilisables
│   ├── router/       # Configuration des routes (Vue Router)
│   ├── views/        # Vues principales (Dashboard, Séances, Amis)
│   ├── App.vue       # Composant racine
│   └── main.js       # Point d'entrée de l'application
├── public/           # Fichiers statiques
└── package.json      # Dépendances et scripts du projet
```

** Sportero 🏋️‍♂️🔥

> Sportero est une application web moderne de fitness et d'entraînement sur-mesure, conçue pour centraliser vos séances personnelles et dynamiser votre motivation grâce à un mode collaboratif en temps réel.

## 🚀 Fonctionnalités Clés

* **Tableau de Bord Intuitif :** Espace d'accueil personnalisé affichant le profil de l'athlète et un accès direct aux fonctionnalités principales.
* **Personnalisation des Séances :** Création, configuration et modification d'exercices, de séries et de temps de repos adaptés à vos objectifs.
* **Mode Salon Collaboratif :** Partagez et suivez des sessions de sport en direct avec vos proches pour vous entraîner ensemble à distance.
* **Espace Communauté :** Gestion des contacts et des amis pour rester motivé en groupe.
* **Design Multiplateforme :** Interface responsive optimisée pour une navigation fluide sur ordinateur et sur mobile.

## 🛠️ Stack Technique

* **Front-end :** Vue.js 3 (Composition API), Vue Router
* **Style & UI :** CSS Grid, Flexbox, Design system sur-mesure (mode sombre, teintes orange et gris foncé)
* **Stockage & Session :** Gestion locale (localStorage) et authentification sécurisée

## 📂 Structure du Projet

sportero/
├── src/
│   ├── assets/       # Ressources graphiques et logos
│   ├── components/   # Composants réutilisables
│   ├── router/       # Configuration des routes (Vue Router)
│   ├── views/        # Vues principales (Dashboard, Séances, Amis)
│   ├── App.vue       # Composant racine
│   └── main.js       # Point d'entrée de l'application
├── public/           # Fichiers statiques
└── package.json      # Dépendances et scripts du projet

## ⚙️ Installation & Lancement

1. Cloner le dépôt :
   git clone https://github.com/votre-nom-utilisateur/sportero.git
   cd sportero

2. Installer les dépendances :
   npm install

3. Lancer le serveur de développement :
   npm run dev

4. Ouvrir l'application :
   Accédez à l'adresse indiquée dans votre terminal (généralement http://localhost:5173).

## 💡 Défis Techniques & Choix d'Architecture

* **Responsive Design :** Application rigoureuse de box-sizing: border-box et de grilles CSS flexibles pour éviter les dépassements de composants sur mobile.
* **État Utilisateur :** Synchronisation sécurisée et dynamique des données de l'athlète depuis le stockage local via des propriétés calculées (computed) protégées par des blocs de contrôle.
* **Synchronisation Multi-Utilisateurs :** Mise en place d'une architecture de salons connectés pour permettre le partage d'exercices et le suivi de sessions en direct.
