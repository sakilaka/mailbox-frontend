<template>
    <div>
        <div class="my-3 d-flex justify-content-between align-items-center">
            <h3 class="ms-4">Email Configurations</h3>
            <router-link style="background-color: #0CAF60; color: white;" class="btn me-3" to="/config">Create</router-link>
        </div>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Sl. No</th>
                    <th>Port</th>
                    <th>Host</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(config, index) in configs" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ config.incoming_port }}</td>
                    <td>{{ config.host }}</td>
                    <td>
                        <div v-for="(user, userIndex) in parseJson(config.username)" :key="userIndex">
                            {{ user.email }}
                        </div>
                    </td>
                    <td>
                        <div v-for="(user, userIndex) in parseJson(config.username)" :key="userIndex">
                            <span v-if="!showPassword[index][userIndex]">*****</span>
                            <span v-else>{{ user.password }}</span>
                            <!-- <button class="showHideButton" @click="togglePassword(index, userIndex)">
                                <EyeIcon v-if="!showPassword[index][userIndex]" />
                                <EyeOffIcon v-if="showPassword[index][userIndex]" />
                            </button> -->
                            <button class="showHideButton" @click="togglePassword(index, userIndex)">
                                {{ showPassword[index][userIndex] ? 'hide' : 'show' }}
                            </button>
                        </div>
                    </td>
                    <td>
                        <!-- Edit and Delete Buttons with Icons -->
                        <button class="ms-3" @click="editUser(config.id)">
                            <PencilIcon style="width: 21px;" />
                        </button>
                        <button class="ms-3" @click="deleteUser(config.id)">
                            <TrashIcon style="width: 21px;" />
                        </button>
                    </td>
                </tr>
                <tr v-if="configs.length === 0">
                    <td colspan="5" class="text-center">No data available</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script>
import {PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { apiUrl } from '@/globalVariable';
import axios from 'axios';
import toastr from "toastr";

export default {
    data() {
        return {
            configs: [],
            showPassword: [],
        };
    },
    
    components: {
        PencilIcon,
        TrashIcon
    },

    mounted() {
        this.fetchConfigurations();
    },
    methods: {
        async fetchConfigurations() {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get(`${apiUrl}all-config`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.configs = response.data.config;

                this.showPassword = this.configs.map((config) => {
                    const parsedUsers = this.parseJson(config.username);
                    return parsedUsers.map(() => false);
                });
            } catch (error) {
                console.error('Error fetching configurations:', error);
            }
        },
        parseJson(jsonString) {
            try {
                return JSON.parse(jsonString);
            } catch {
                return [];
            }
        },

        togglePassword(configIndex, userIndex) {
            this.showPassword[configIndex][userIndex] = !this.showPassword[configIndex][userIndex];
        },

        editUser(configId) {
            this.$router.push(`/configEdit/${configId}`);
        },

        // Method for deleting the configuration
        async deleteUser(configId) {
            try {
                await axios.delete(`${apiUrl}email-config/${configId}`);
                // this.$emit("deleted", configId); 
                toastr.success('Deleted Successfully.')
                this.fetchConfigurations();
            } catch (error) {
                console.error("Error deleting the config:", error);
            }
        }
    },
};
</script>

<style scoped>
.table {
    width: 98%;
    border-collapse: collapse;
    margin: 20px;
}

.table th,
.table td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
}

.table th {
    background-color: #f4f4f4;
}

.text-center {
    text-align: center;
}

.showHideButton {
    padding: 2px 12px;
    border: none;
    border-radius: 5px;
    margin-left: 5px;
    margin-top: 5px;
    cursor: pointer;
}
</style>