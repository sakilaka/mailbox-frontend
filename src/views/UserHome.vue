<template>
    <div class="cards p-4">
        <div class="card">
            <h2>Incoming Email</h2>
            <p>{{ emails }}</p>
        </div>
        <div class="card">
            <h2>Outgoing Email</h2>
            <p>{{ sentEmails }}</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { apiUrl } from "@/globalVariable";

export default {
    data() {
        return {
            activeSection: "Dashboard",
            activeSubSection: null,
            dropdownOpen: null,
            users: 0,
            emails: 0,
            sentEmails: 0,
            isSidebarCollapsed: false,
            isHovering: false,
            userList: {}
        };
    },
   

    mounted() {
        this.getEmails();
        this.getUsers();
        this.getAllUsers();
        this.getSentEmails();
    },

    methods: {
        setActive(section) {
            this.activeSection = section;
            this.activeSubSection = null;
            this.dropdownOpen = null;
        },
        toggleDropdown(section) {
            this.dropdownOpen = this.dropdownOpen === section ? null : section;
        },
        setActiveSub(subSection) {
            this.activeSubSection = subSection;
            this.activeSection = "Settings";
        },
        toggleSidebar() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },

        handleMouseOver() {
            if (this.isSidebarCollapsed) {
                this.isHovering = true;
                this.isSidebarCollapsed = false;
            }
        },

        async getEmails() {
            try {
                this.loading = true;
                const token = localStorage.getItem("token");
                const response = await axios.get(`${apiUrl}emails`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.emails = response.data.totalEmail;
            } catch (error) {
                console.error("An error occurred while fetching emails.", error);
            } finally {
                this.loading = false;
            }
        },

        async getSentEmails() {
            try {
                this.loading = true;
                const token = localStorage.getItem("token");
                const response = await axios.get(`${apiUrl}sent-emails`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.sentEmails = response.data.totalSentEmail;
            } catch (error) {
                console.error("An error occurred while fetching emails.", error);
            } finally {
                this.loading = false;
            }
        },

        async getUsers() {
            try {
                this.loading = true;
                const response = await axios.get(`${apiUrl}all-user`);
                this.users = response.data.total_user;
            } catch (error) {
                console.error("An error occurred while fetching users.", error);
            } finally {
                this.loading = false;
            }
        },

        async getAllUsers() {
            try {
                this.loading = true;
                const response = await axios.get(`${apiUrl}user-list`);
                this.userList = response.data.users;
            } catch (error) {
                console.error("An error occurred while fetching users.", error);
            } finally {
                this.loading = false;
            }
        }

    },
};
</script>

<style>
.cards {
    display: flex;
    gap: 20px;
}

.card {
    flex: 1;
    background-color: #ffffff;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card h2 {
    font-size: 18px;
    margin-bottom: 10px;
}

.card p {
    font-size: 24px;
    font-weight: bold;
}
</style>
