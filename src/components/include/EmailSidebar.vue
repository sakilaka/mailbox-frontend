<template>
    <div class="sidebar">
        <button style="background-color: #0CAF60;" class="btn btn-success w-100 mb-3" @click="$router.push('/compose')">Compose</button>

        <ul class="nav flex-column">
            <li class="nav-item bg" v-for="link in links" :key="link.name">
                <router-link 
                    :to="link.path" 
                    class="nav-link"
                    active-class="active-link" 
                >
                    <i :class="link.icon"></i> {{ link.name }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            links: [
                { name: "Inbox", path: "/profile", icon: "bi bi-inbox-fill" },
                { name: "Starred", path: "/starred", icon: "bi bi-star-fill" },
                { name: "Sent", path: "/sent", icon: "bi bi-send-fill" },
                // { name: "Draft", path: "/draft", icon: "bi bi-file-earmark-text" },
                // { name: "Spam", path: "/spam", icon: "bi bi-exclamation-circle" },
                { name: "Trash", path: "/trash", icon: "bi bi-trash-fill" },
                { name: "Archive", path: "/archive", icon: "bi bi-archive-fill" },
                { name: "Configuration", path: "/config", icon: "bi bi-gear-fill" }
            ]
        };
    }
};
</script>

<style scoped>
.sidebar {
    width: 350px;
    background-color: #edf5fe;
    padding: 20px;
}

.nav-link {
    color: #2c3e50;
    display: flex;
    align-items: center;
    font-size: 20px;
    margin: 10px 0px;
    text-decoration: none;
}

.nav-link:hover,
.active-link {
    background-color: #0CAF60;
    border-radius: 5px;
    color: #fff; /* Adjust if you want white text on active/hover links */
}

.nav-link i {
    margin-right: 10px;
}
</style>
