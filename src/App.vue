<template>
  <div id="app" class="d-flex position-relative flex-column h-100">
    <Navbar v-if="isInitialized && isLoggedIn" />
    <div class="d-flex flex-grow-1">
      <Sidebar
        v-if="isInitialized && isLoggedIn"
        :class="{ 'sidebar-visible': isSidebarVisible }"
      />

      <main class="flex-grow-1">
        <router-view />
      </main>
    </div>

    <!-- Toggle Button for Sidebar -->
    <button
      v-if="isInitialized && isLoggedIn && isSmallScreen"
      class="sidebar-toggle"
      @click="toggleSidebar"
    >
      {{ isSidebarVisible ? '✖' : '☰' }}
    </button>
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
      isSidebarVisible: false, // Sidebar is hidden by default
      isSmallScreen: false,
    };
  },
  created() {
    this.checkLoginStatus();
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  unmounted() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
      this.isInitialized = true;
    },
    checkScreenSize() {
      this.isSmallScreen = window.innerWidth <= 868;
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
  },
};
</script>


<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  background-color: white !important;
  overflow: auto;
}

.d-flex {
  display: flex;
}

.flex-grow-1 {
  flex-grow: 1;
}

/* Sidebar Toggle Button */
.sidebar-toggle {
  position: fixed;
  top: 11px;
  left: 131px;
  z-index: 9999;
  font-size: 20px;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sidebar-toggle:hover {
  background-color: #555;
}

/* Sidebar Styles */
@media (max-width: 868px) {
  .sidebar {
    display: none;
    position: fixed;
    top: 70px;
    left: 0;
    height: 100%;
    width: 250px;
    z-index: 10000;
    transition: transform 0.3s ease;
  }

  .sidebar-visible {
    display: block;
    transform: translateX(0);
  }

  .sidebar:not(.sidebar-visible) {
    transform: translateX(-250px);
  }
}
</style>

