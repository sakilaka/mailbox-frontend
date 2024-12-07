<template>
    <div class="dashboard">
        <!-- Sidebar -->
        <aside :class="['sidebar', { collapsed: isSidebarCollapsed }]" @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave">
            <button class="toggle-btn" @click="toggleSidebar">
                ☰
            </button>

            <nav>
                <ul>
                    <li>
                        <a href="#" :class="{ active: activeSection === 'Dashboard' }" @click="setActive('Dashboard')">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="icon">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 10.5V21h7.5v-6h3v6H21V10.5L12 3z" />
                            </svg>
                            <span v-if="!isSidebarCollapsed">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="{ active: activeSection === 'Users' }" @click="setActive('Users')">
                            <UserGroupIcon class="icon" style="cursor: pointer; width: 26px; height: 26px" />
                            <span v-if="!isSidebarCollapsed">Users</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="dropdown-toggle" :class="{ active: activeSection === 'Settings' }"
                            @click="toggleDropdown('settings')">
                            <SettingIcon class="icon" style="cursor: pointer; width: 26px; height: 26px" />
                            <span v-if="!isSidebarCollapsed">Settings</span>
                        </a>
                        <ul v-if="dropdownOpen === 'settings' && !isSidebarCollapsed" class="dropdown">
                            <li>
                                <a href="#" :class="{ active: activeSubSection === 'Profile' }"
                                    @click="setActiveSub('Profile')">
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a href="#" :class="{ active: activeSubSection === 'Preferences' }"
                                    @click="setActiveSub('Preferences')">
                                    Preferences
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>

            </nav>
        </aside>

        <!-- Main Content -->
        <main class="content">
            <header>
                <h2 style="margin-bottom: -10px; margin-top: 10px;">{{ activeSection }}</h2>
            </header>

            <div v-if="activeSection === 'Dashboard'" class="cards">
                <div class="card">
                    <h2>Total Users</h2>
                    <p>{{ users }}</p>
                </div>
                <div class="card">
                    <h2>Total Emails</h2>
                    <p>{{ emails }}</p>
                </div>
            </div>

            <div v-if="activeSection === 'Users'">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Sl. No</th>
                            <th>Email</th>
                            <!-- <th>Referral</th> -->
                            <!-- <th>Email</th>
                            <th>Password</th> -->
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in userList" :key="index">
                        
                            <td>{{ index + 1 }}</td>
                            <td>{{ user.email }}</td>
                            
                            
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
                        <tr v-if="userList.length === 0">
                            <td colspan="5" class="text-center">No data available</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </main>
    </div>
</template>

<script>
import { UserGroupIcon, PencilIcon, TrashIcon, Cog6ToothIcon as SettingIcon } from "@heroicons/vue/24/outline";
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
            isSidebarCollapsed: false,
            isHovering: false,
            userList: {}
        };
    },
    components: {
        UserGroupIcon,
        SettingIcon,
        TrashIcon,
        PencilIcon
    },

    mounted() {
        this.getEmails();
        this.getUsers();
        this.getAllUsers();
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
                const response = await axios.get(`${apiUrl}all-email`);
                this.emails = response.data.total_email;
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

<style scoped>
.dashboard {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 250px;
    background-color: #ffffff;
    padding: 20px;
    transition: width 0.3s ease;
    border-right: 1px solid #e0e0e0;
    position: relative;
}

.sidebar.collapsed {
    width: 70px;
}

.toggle-btn {
    position: absolute;
    top: -2px;
    right: -25px;
    background: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.sidebar nav ul {
    list-style: none;
    padding: 0;
}

.sidebar nav ul li {
    margin: 15px 0;
}

.sidebar nav ul li a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333;
    font-size: 16px;
    padding: 10px;
    border-radius: 5px;
}

.sidebar nav ul li a .icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
}

.sidebar.collapsed .icon {
    margin-right: 0;
}

.sidebar nav ul li a.active {
    background-color: #007bff;
    color: #fff;
}

.dropdown {
    list-style: none;
    margin: 10px 0 0 20px;
    padding: 0;
}

.dropdown li a {
    font-size: 14px;
    color: #555;
}

.content {
    flex: 1;
    padding: 20px;
    margin-top: 20px;
}

/* Main Content */
.content {
    flex: 1;
    padding: 20px;
}

.content header {
    margin-bottom: 20px;
}

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
