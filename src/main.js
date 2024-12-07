import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/main.css';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'toastr/build/toastr.min.css';


createApp(App)
  .use(router) // Use the router
  .mount('#app');
