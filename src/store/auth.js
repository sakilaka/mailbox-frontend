// src/store/auth.js
import { reactive } from 'vue';

const authState = reactive({
  isLoggedIn: !!localStorage.getItem('token'),
});

function login(token) {
  localStorage.setItem('token', token);
  authState.isLoggedIn = true;
}

function logout() {
  localStorage.removeItem('token');
  authState.isLoggedIn = false;
}

export default {
  authState,
  login,
  logout,
};
