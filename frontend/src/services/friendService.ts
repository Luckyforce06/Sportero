import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export default {
  async getFriends() {
    const response = await axios.get(`${API_URL}/friends`, getAuthHeader());
    return response.data;
  },

  async getPendingRequests() {
    const response = await axios.get(`${API_URL}/friends/requests`, getAuthHeader());
    return response.data;
  },

  async sendFriendRequest(pseudo: string) {
    const response = await axios.post(`${API_URL}/friends/add`, { pseudo }, getAuthHeader());
    return response.data;
  },

  async acceptRequest(requestId: number) {
    const response = await axios.post(
      `${API_URL}/friends/accept/${requestId}`,
      {},
      getAuthHeader()
    );
    return response.data;
  },

  async declineRequest(requestId: number) {
    const response = await axios.delete(`${API_URL}/friends/${requestId}`, getAuthHeader());
    return response.data;
  },

  async removeFriend(friendId: number) {
    const response = await axios.delete(`${API_URL}/friends/${friendId}`, getAuthHeader());
    return response.data;
  }
};
