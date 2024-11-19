<template>
  <div class="header">
    <!-- Logo Section -->
    <div class="logo">
      <img
        :src="HeaderLogo"
        alt="Logo"
      />
    </div>

    <!-- Avatar Section -->
    <div class="avatar-container">
      <img
        class="avatar"
        src="https://thumbs.dreamstime.com/z/businessman-avatar-image-beard-hairstyle-male-profile-vector-illustration-178545831.jpg"
        alt="User Avatar"
        @click="toggleDropdown"
      />
      <div v-if="showDropdown" class="dropdown">
        <button @click="logout">Logout</button>
        <!-- <button @click="viewProfile">Your Profile</button> -->
      </div>
    </div>
  </div>

  <!-- Optional Overlay for Outside Click -->
  <div
    v-if="showDropdown"
    class="dropdown-overlay"
    @click="toggleDropdown"
  ></div>
</template>


<script>
import HeaderLogo from '../../../src/assets/img/1723997160_header-logo.png'

export default {
  data() {
    return {
      isInitialized: false,
      isLoggedIn: false,
      showDropdown: false,
      HeaderLogo
    };
  },
 
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem("token");
      this.isLoggedIn = !!token;
      this.isInitialized = true; // Ensure rendering only happens after initialization.
    },
    logout() {
      localStorage.removeItem("token");
      this.isLoggedIn = false; // Update state immediately.
      window.location.href = "/"; // Redirect to login page.
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
      // console.log(this.showDropdown);
    },
  },
};
</script>

<style scoped>

.header {
  background-color: white;
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
  top: 50px; /* Adjust the dropdown to appear below the avatar */
  right: 0;
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 150px;
  padding: 10px 0;
  visibility: visible;
  z-index: 1001; /* Make sure the dropdown is above other elements */
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
  background: rgba(0, 0, 0, 0.1); /* Slight dark background */
  z-index: 1000; /* Should be lower than dropdown */
  cursor: pointer;
}
</style>
