<template>
  <div class="wrapper fadeInDown">
   <div id="formContent">
     <img :src="HeaderLogo" class="headerLogo" alt="">
     <br>
     <p class="loginp" style="margin: 20px 0px; color: black">SignUp MalishaEdu MailBox!!</p>
 
     <!-- Loader -->
     <div v-if="isLoading" class="loader-container">
       <div class="loader"></div>
     </div>
 
     <!-- Form -->
     <form v-else @submit.prevent="register">
       <input type="text" v-model="name" placeholder="Name" required />
       <input type="email" v-model="email" placeholder="Email" required />
       <input type="password" v-model="password" placeholder="Password" required />
       <input type="password" v-model="password_confirmation" placeholder="Confirm Password" required />
       <input type="submit" class="fadeIn fourth" value="Register">
     </form>
 
     <div id="formFooter"> 
       Already have an account?
       <router-link class="underlineHover text-color" to="/">Login</router-link>
     </div>
   </div>
 </div>
 </template>
 

<script>
import axios from 'axios';
import { apiUrl } from "@/globalVariable"; // Use apiUrl like in login
import HeaderLogo from '../../../src/assets/img/1723997160_header-logo.png';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      isLoading: false, // Loader state
      HeaderLogo
    };
  },
  methods: {
    async register() {
      this.isLoading = true; // Show loader
      try {
        const response = await axios.post(`${apiUrl}register`, {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
        });
        localStorage.setItem('token', response.data.token);
        this.$router.push('/'); // Redirect after successful registration
      } catch (error) {
        console.error("There was an error!", error);
        alert("Registration failed! Please check your inputs.");
      } finally {
        this.isLoading = false; // Hide loader
      }
    },
  },
};
</script>


<style>

.text-color{
  color: #0CAF60;
  text-decoration: none;
}
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
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
