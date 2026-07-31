import { io } from 'socket.io-client';

// Remplace par l'URL de ton backend si besoin (ex: http://localhost:3000)
const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  autoConnect: false // On se connectera manuellement quand l'utilisateur lance ou rejoint une séance live
});
