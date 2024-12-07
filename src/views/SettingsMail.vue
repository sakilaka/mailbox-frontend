<template>
    <div class="height-container">
        <h1 class="text-center mt-5">Please Update your Information</h1>
        <form @submit.prevent="updateInfo" class="updateForm shadow-lg">
            <div class="form-group">
                <label for="username">Username</label> <br />
                <input
                    type="text"
                    id="username"
                    v-model="username"
                    class="form-control w-100 mt-2"
                    required
                />
            </div>
            <div class="form-group">
                <label for="useremail">Email</label> <br />
                <input
                    type="text"
                    id="useremail"
                    v-model="useremail"
                    class="form-control w-100 mt-2"
                    required
                />
            </div>
            <div class="form-group mt-3">
                <label for="old_password">Old Password</label> <br />
                <input
                    type="password"
                    id="old_password"
                    v-model="old_password"
                    class="form-control w-100 mt-2"
                    required
                />
            </div>
            <div class="form-group mt-3">
                <label for="password">New Password</label> <br />
                <input
                    type="password"
                    id="password"
                    v-model="password"
                    class="form-control w-100 mt-2"
                    required
                />
            </div>
            <div class="form-group mt-3">
                <label for="password_confirmation">Confirm Password</label> <br />
                <input
                    type="password"
                    id="password_confirmation"
                    v-model="password_confirmation"
                    class="form-control w-100 mt-2"
                    required
                />
            </div>
            <button type="submit" class="btn btn-primary mt-4 ms-1" :disabled="isLoading">
                <span v-if="isLoading" class="loader"></span>
                <span v-else>Update Information</span>
            </button>
        </form>
    </div>
</template>


<script>
import axios from "axios";
import { apiUrl } from "@/globalVariable";
import toastr from "toastr";

export default {
    data() {
        return {
            username: "",
            useremail: "",
            old_password: "",
            password: "",
            password_confirmation: "",
            isLoading: false,
        };
    },
    methods: {
        async fetchUserDetails() {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${apiUrl}user/details`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.username = response.data.username; 
                this.useremail = response.data.email; 
            } catch (error) {
                toastr.error("Failed to fetch user details.");
                // this.$router.push('/');
            }
        },

        async updateInfo() {
            this.isLoading = true; 
            try {
                const token = localStorage.getItem("token");
                await axios.put(
                    `${apiUrl}user/update`,
                    {
                        username: this.username,
                        useremail: this.useremail,
                        old_password: this.old_password,
                        password: this.password,
                        password_confirmation: this.password_confirmation,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toastr.success("Information updated successfully!");
                this.old_password = '';
                this.password = '';
                this.password_confirmation = '';
            } catch (error) {
                toastr.error(
                    error.response.data.message || "Failed to update information. Please try again."
                );
            } finally {
                this.isLoading = false; 
            }
        },
    },
    mounted() {
        this.fetchUserDetails(); 
    },
};
</script>


<style scoped>
.loader {
    border: 4px solid #a4d4a3;
    border-top: 4px solid #0CAF60;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 5px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.updateForm {
    margin: 44px auto;
    width: 59%;
    padding: 30px;
}
.height-container{
    height: 500px;
}
</style>