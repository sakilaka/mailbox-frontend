<template>
    <div class="email-list">

        <div v-if="loading" class="loader-container">
            <div class="loader"></div>
        </div>

        <div v-else>
            ` <div v-if="emails.length > 0">
                <div v-for="email in emails" :key="email.id"
                    class="email-item ms-3 d-flex justify-content-between align-items-center p-3 border-bottom display"
                    >
                    <!-- <div class="d-flex">
                        <div class="d-flex gap-2">
                            <input type="checkbox">
                        </div>
                        <div class="email-info ms-5">
                            <strong>{{ email.to }}</strong> - <span class="text-muted">{{ email.subject }}</span>
                            <p class="text-muted" v-html="email.message"></p>
                        </div>
                    </div> -->

                     <div class="d-flex align-items-center flex-grow-1">
                        <input style="cursor: pointer" class="me-3" type="checkbox" :value="email.id"
                            @change="toggleEmailSelection(email.id)" />


                        <div class="email-info d-flex flex-grow-1 align-items-center">
                            <strong :style="{ fontWeight: email.is_read ? 'normal' : 'bold' }" class="me-2">
                                {{ email.to }}
                            </strong>
                            <span class="text-muted text-truncate" :style="{
                                fontWeight: email.is_read ? 'normal' : 'bold',
                                color: email.is_read ? 'black' : '',
                            }">{{ email.subject }}</span>
                            <span v-html="email.message" class="snippet ms-2 mt-3 text-truncate flex-grow-1"
                                :class="{ 'text-muted': !email.hovered }">
                                
                            </span>
                        </div>
                    </div>

                    <div class="email-actions d-flex">
                        <span title="Show">
                            <EyeIcon style="cursor: pointer;" class="h-5 w-5 mx-2"
                            @click="$router.push({ name: 'Compose', query: email })" />
                        </span>
                 
                        <span title="Move to trash">
                            <TrashIcon style="cursor: pointer;" class="h-5 w-5 mx-2"
                                @click.stop="moveToTrash(email.id)" />
                        </span>

                    </div>
                </div>
            </div>
            <div v-else style="margin: 150px auto" class="text-center d-flex justify-content-center align-items-center">
                <div class="p-4">
                    <img style="width: 80px; margin: 20px auto" :src="image" alt="">
                    <h2>You have no Email.</h2>
                    <p>It looks like you haven't sent any emails yet. Once you start — your emails will appear here!</p>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import axios from 'axios';
import { apiUrl } from '@/globalVariable';
import { EyeIcon, TrashIcon } from '@heroicons/vue/24/outline';
import toastr from 'toastr';
import image from '../assets/img/Untitled.png';

export default {
    components: {
        EyeIcon,
        TrashIcon,
    },
    data() {
        return {
            emails: [],
            loading: false,
            image
        };
    },



    mounted() {
        this.getDraftMail();
    },

    methods: {
        async getDraftMail() {
            try {
                this.loading = true;
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiUrl}drafts`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.emails = response.data.email;
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    console.log(error.response.data.errors);
                } else {
                    console.error(error);
                    console.log('An error occurred while fetching emails.');
                }
            } finally {
                this.loading = false;
            }
        },

        async moveToTrash(id) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${apiUrl}drafts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // this.emails = this.emails.filter(draft => draft.id !== id);
                toastr.success('Successfully Email Move to Trash.');
                this.getDraftMail();
            } catch (error) {
                console.error(error);
            }
        },

    },
};
</script>

<style scoped>
.loader-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 1000;
}

.loader {
    border: 4px solid #a4d4a3;
    border-top: 4px solid #0CAF60;
    border-radius: 50%;
    width: 40px;
    height: 40px;
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

.email-list {
    flex: 1;
}

.email-item:hover {
    background-color: #f1f1f1;
}

.h-5 {
    height: 1.25rem;
}

.w-5 {
    width: 1.25rem;
}

/* Sidebar visibility for devices with widths between 500px and 698px */
@media (max-width: 698px) and (min-width: 500px) {
    .display {
        display: flex;
        flex-direction: column;
    }

    .starIcon {
        margin-top: 20px;
    }
}

/* Sidebar visibility for small screens */
@media (max-width: 500px) {
    .display {
        display: flex;
        flex-direction: column;
    }

    .starIcon {
        margin-top: 37px;
    }
}
</style>
