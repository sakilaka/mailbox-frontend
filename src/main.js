import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.min.css';
import axios from 'axios';
import { apiUrl } from './globalVariable';

const token = localStorage.getItem('token');

if (token) {
  axios.post(`${apiUrl}verify-token`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => {
      if (!response.data.valid) {
        localStorage.removeItem('token');
        router.push('/');
      }
    })
    .catch(error => {
      console.error("Error verifying token:", error.response?.data || error);
      localStorage.removeItem('token');
      router.push('/');
    });
}

createApp(App).use(router).mount('#app');
