<template>
    <div :class="['sidebar', { collapsed: !isSidebarVisible }]">
        <button class="compose-button mb-3" :style="{ width: isSidebarVisible ? '192px' : '67px' }"
            @click="$router.push('/compose')">
            <PencilSquareIcon style="width: 21px; margin-right: 6px; margin-top: -4px;" />
            <span v-if="isSidebarVisible">Compose</span>
        </button>


        <ul class="nav flex-column">
            <li class="nav-item bg" v-for="link in filteredLinks" :key="link.name">
                <router-link :to="link.path" class="nav-link d-flex align-items-center" active-class="active-link">
                    <component :is="link.icon" class="icon mx-2" />
                    <!-- Show link name only if sidebar is visible -->
                    <span v-if="isSidebarVisible" class="ms-2">{{ link.name }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
import axios from "axios";
import { apiUrl } from "@/globalVariable";
import toastr from "toastr";
import { eventBus } from "../../../eventBus.js";


import {
    InboxIcon,
    StarIcon,
    PaperAirplaneIcon,
    DocumentTextIcon,
    TrashIcon,
    ArchiveBoxIcon,
    Cog6ToothIcon,
    UserGroupIcon,
    HomeIcon
} from "@heroicons/vue/24/outline";

export default {

    data() {
        return {
            links: [
                { name: "Home", path: "/home", icon: HomeIcon },
                { name: "Inbox", path: "/profile", icon: InboxIcon },
                { name: "Starred", path: "/starred", icon: StarIcon },
                { name: "Sent", path: "/sent", icon: PaperAirplaneIcon },
                { name: "Draft", path: "/draft", icon: DocumentTextIcon },
                { name: "Trash", path: "/trash", icon: TrashIcon },
                { name: "Archive", path: "/archive", icon: ArchiveBoxIcon },
                { name: "Configuration", path: "/config-index", icon: Cog6ToothIcon },
                { name: "Members", path: "/members", icon: UserGroupIcon }
            ],
            PencilSquareIcon,
            is_referral: null, // Start as null to indicate loading
        };
    },

    components: {
        PencilSquareIcon
    },

    mounted() {
        this.fetchUserDetails();
    },

    computed: {
        filteredLinks() {
            if (this.is_referral === "1") {
                return this.links.filter(link => link.name !== "Configuration" && link.name !== "Members");
            }
            return this.links;
        },

        isSidebarVisible() {
            return eventBus.isSidebarVisible;
        },
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
                this.is_referral = response.data.referral;
                console.log(response.data);

            } catch (error) {
                toastr.error("Failed to fetch user details.");
                // this.$router.push('/');
            }
        }
    }
};
</script>


<style scoped>
.sidebar {
    width: 350px;
    padding: 20px;
    min-height: 750px;
    box-shadow: 0px 6px 11px rgb(180, 179, 179);
    margin-top: 3px;
    border-radius: 10px;
}

.nav-link {
    color: #2c3e50;
    display: flex;
    align-items: center;
    font-size: 16px;
    margin: 5px 0px;
    text-decoration: none;
}

.nav-link:hover,
.active-link {
    background-color: #0CAF60;
    border-radius: 5px;
    color: #fff;
}

.nav-link i {
    margin-right: 10px;
}

.icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.compose-button {
  background-color: rgb(12, 175, 96);
  border: none;
  padding: 17px 1px;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.3s ease; 
}

.sidebar.collapsed {
    width: 100px;
}
</style>
