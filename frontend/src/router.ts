import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login/Login.vue';
import Register from './components/Register/Register.vue';
import Dashboard from './components/Dashboard/Dashboard.vue';
import WorkoutsView from './components/Workouts/WorkoutsView.vue';
import FriendsView from './components/FriendsView/FriendsView.vue';
import WorkoutSession from './components/Workouts/WorkoutSession/WorkoutSession.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/workouts',
    name: 'Workouts',
    component: WorkoutsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/workouts/:id',
    name: 'WorkoutSession',
    component: WorkoutSession,
    meta: { requiresAuth: true }
  },
  {
    path: '/friends',
    name: 'Friends',
    component: FriendsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' };
  }

  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    return { name: 'Dashboard' };
  }
  return true;
});

export default router;
