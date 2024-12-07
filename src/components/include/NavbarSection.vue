<template>
  <div class="header">
    <!-- Logo Section -->
    <div class="logo">
      <button v-if="isInitialized && isLoggedIn && isAdmin !== '1'" class="sidebar-toggle me-3" @click="toggleSidebar">
        {{ isSidebarVisible ? "✖" : "☰" }}
      </button>
      <router-link :to="isAdmin === '1' ? '/dashboard' : '/profile'">
        <img :src="HeaderLogo" alt="Logo" />
      </router-link>
    </div>

    <!-- Avatar Section -->
    <div class="avatar-container">
      <img class="avatar"
        src="https://thumbs.dreamstime.com/z/businessman-avatar-image-beard-hairstyle-male-profile-vector-illustration-178545831.jpg"
        alt="User Avatar" @click="toggleDropdown" />
      <div v-if="showDropdown" class="dropdown">
        <button @click="logout">Logout</button>
        <button @click="setting">Settings</button>
      </div>
    </div>
  </div>

  <!-- Optional Overlay for Outside Click -->
  <div v-if="showDropdown" class="dropdown-overlay" @click="toggleDropdown"></div>
</template>

<script>
import { eventBus } from "../../../eventBus.js";
import HeaderLogo from "../../../src/assets/img/1723997160_header-logo.png";
import axios from "axios";
import { apiUrl } from "../../globalVariable.js";
import toastr from "toastr";

export default {
  data() {
    return {
      isInitialized: false,
      isLoggedIn: false,
      showDropdown: false,
      HeaderLogo,
      isAdmin: null
    };
  },
  computed: {
    isSidebarVisible() {
      return eventBus.isSidebarVisible;
    },
  },
  mounted() {
    this.fetchUserDetails();
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem("token");
      this.isLoggedIn = !!token;
      this.isInitialized = true;
    },
    async fetchUserDetails() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}user/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.isAdmin = response.data.admin;

      } catch (error) {
        toastr.error("Failed to fetch user details.");
        // this.$router.push('/');
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      window.location.href = "/";
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    setting() {
      this.$router.push("/settings");
      this.showDropdown = false;
    },
    toggleSidebar() {
      eventBus.toggleSidebar();
    },
  },
};
</script>


<style scoped>
.header {
  /* background-color: #edf5fe; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  position: relative;
}

/* Logo Styling */
.logo img {
  height: 50px;
}

/* Avatar Styling */
.avatar-container {
  position: relative;
}

.avatar {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: 2px solid #ddd;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 150px;
  padding: 10px 0;
  visibility: visible;
  z-index: 1001;
}

.dropdown button {
  display: block;
  width: 100%;
  padding: 10px 15px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #333;
  transition: background-color 0.3s ease;
}

.dropdown button:hover {
  background-color: #f5f5f5;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1000;
  cursor: pointer;
}

.sidebar-toggle {
  z-index: 9999;
  font-size: 20px;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #edf5fe;
  transition: background-color 0.3s ease;
}

.sidebar-toggle:hover {
  background-color: #dfedfd;
}


</style>
