<template>
  <div class="wrapper fadeInDown">
    <div id="formContent">
      <img :src="HeaderLogo" class="headerLogo" alt="">
      <br>
      <p class="loginp" style="margin: 20px 0px; color: black">Login MalishaEdu MailBox!!</p>

      <form @submit.prevent="login">
        <!-- Loader -->
        <div v-if="isLoading" class="loader-container">
          <div class="loader"></div>
        </div>
        <!-- Input fields -->
        <div v-else>
          <input type="email" id="email" class="fadeIn second" v-model="email" placeholder="Email" />
          <input type="password" id="password" class="fadeIn third" v-model="password" placeholder="Password" />
          <input type="submit" class="fadeIn fourth button" value="Log In" />
        </div>
      </form>

      <div id="formFooter">
        Create a new account?
        <router-link class="underlineHover text-color" to="/register">Register</router-link>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { apiUrl } from "@/globalVariable";
import HeaderLogo from '../../../src/assets/img/1723997160_header-logo.png';

export default {
  data() {
    return {
      email: "",
      password: "",
      isLoading: false, // New loading state
      HeaderLogo
    };
  },
  methods: {
    async login() {
      this.isLoading = true; // Show loader
      try {
        const response = await axios.post(`${apiUrl}login`, {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem("token", response.data.token); // Save token
        console.log("Token set in localStorage:", localStorage.getItem("token"));
        window.location.href = "/profile";
      } catch (error) {
        console.error("There was an error!", error);
        alert("Login failed! Please check your credentials.");
      } finally {
        this.isLoading = false; // Hide loader
      }
    },
  },
};
</script>


<style>
.text-color {
  color: #0caf60;
  text-decoration: none;
}

.headerLogo{
  width: 100px;
  margin-top: 20px;
}
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0px;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #0CAF60;
  border-radius: 50%;
  width: 30px;
  height: 30px;
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

</style>
