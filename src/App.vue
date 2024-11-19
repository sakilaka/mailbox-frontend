<template>
  <div id="app" class="d-flex flex-column h-100">
    <Navbar v-if="isInitialized && isLoggedIn" />
    <div class="d-flex flex-grow-1">
      <Sidebar v-if="isInitialized && isLoggedIn" />
      <main class="flex-grow-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Navbar from './components/include/NavbarSection.vue';
import Sidebar from './components/include/EmailSidebar.vue';

export default {
  name: 'AppRoot',
  components: {
    Navbar,
    Sidebar,
  },
  data() {
    return {
      isInitialized: false,
      isLoggedIn: false,
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token; // Check if token exists.
      this.isInitialized = true; // Mark initialization complete.
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  /* padding: 20px; */
  background-color: white !important;
  overflow: auto;
}

.d-flex {
  display: flex;
}
.flex-grow-1 {
  flex-grow: 1;
}
</style>
