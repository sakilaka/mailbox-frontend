<template>
  <div id="app" class="d-flex position-relative flex-column">
    <!-- Navbar -->
    <Navbar :style="{ position: fixed }" v-if="isInitialized && isLoggedIn" />

    <div v-if="!isFetchingUserDetails" class="d-flex flex-grow-1">
      <!-- Sidebar -->
      <Sidebar v-if="isInitialized && isLoggedIn && isAdmin !== '1'" :class="{ 'sidebar-visible': isSidebarVisible }" />

      <!-- Main Content -->
      <main class="flex-grow-1" :style="{
        marginLeft: isSidebarVisible && isLoggedIn
          ? (isAdmin === '1' ? '0px' : sidebarWidth)
          : '100px',
        transition: 'margin 0.3s ease',
      }">
        <router-view />
      </main>
    </div>

    <!-- Show Loader while fetching user details -->
    <div v-else class="loading-container">
      <div id="loader"></div>
    </div>
  </div>
</template>


<script>
import Navbar from "./components/include/NavbarSection.vue";
import Sidebar from "./components/include/EmailSidebar.vue";
import { eventBus } from "../eventBus.js"; // Import the eventBus
import "toastr/build/toastr.min.css";
import axios from "axios";
import { apiUrl } from "./globalVariable";
import toastr from "toastr";

export default {
  name: "AppRoot",
  components: {
    Navbar,
    Sidebar,
  },
  data() {
    return {
      isInitialized: false,
      isLoggedIn: false,
      isSmallScreen: false,
      sidebarWidth: "350px",
      isAdmin: 0,
      isFetchingUserDetails: false
    };
  },
  computed: {
    isSidebarVisible() {
      return eventBus.isSidebarVisible;
    },
  },
  created() {
    this.checkLoginStatus();
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
  },
  mounted() {
    this.fetchUserDetails();
  },

  unmounted() {
    window.removeEventListener("resize", this.checkScreenSize);
  },

  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem("token");
      this.isLoggedIn = !!token;
      this.isInitialized = true;
    },
    async fetchUserDetails() {
      try {
        this.isFetchingUserDetails = true; // Start fetching
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}user/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.isAdmin = response.data.admin;
        console.log(response.data);
      } catch (error) {
        toastr.error("Failed to fetch user details.");
        this.$router.push('/');
      } finally {
        this.isFetchingUserDetails = false; // Mark as done
        this.isInitialized = true; // Mark initialization as complete
      }
    },

    checkScreenSize() {
      this.isSmallScreen = window.innerWidth <= 868;
      this.sidebarWidth = this.isSmallScreen ? "250px" : "350px"; // Adjust sidebar width dynamically
    },
    toggleSidebar() {
      eventBus.toggleSidebar();
    },
  },
};
</script>

<style scoped>
.loading-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 1000;
}

#loader {
    border: 4px solid #a4d4a3;
    border-top: 4px solid #0caf60;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* overflow: hidden; */
}

main {
  background-color: #fef7f2 !important;
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

.sidebar-visible {
  display: block;
  transform: translateX(0);
}



.sidebar {
  position: fixed;
  top: 70px;
  left: 0;
  height: 100%;
  width: 350px;
  z-index: 10000;
  transition: transform 0.3s ease;
}

/* Sidebar Styles */
@media (max-width: 868px) {
  .sidebar {
    position: fixed;
    top: 70px;
    left: 0;
    height: 100%;
    width: 250px;
    z-index: 10000;
    transition: transform 0.3s ease;
  }

}
</style>
