<template>
    <div class="email-list">
        <div v-if="loading" class="loader-container">
            <div class="loader"></div>
        </div>

        <div v-else>
            <div class="my-4 ms-3">
                <button class="trash_button" v-show="selectedEmails.length > 0" @click="moveSelectedEmailsToTrash">Trash
                    All</button>
            </div>

            <div v-if="emails.length > 0">
                <div v-for="email in emails" :key="email.id"
                    class="email-item ms-3 d-flex justify-content-between align-items-center p-3 border-bottom display"
                    >
                    <div class="d-flex align-items-center flex-grow-1">
                        <div class="d-flex gap-2">
                            <input style="cursor: pointer" class="me-3" type="checkbox" :value="email.id"
                            @change="toggleEmailSelection(email.id)" />
                        </div>

                        <!-- <div class="email-info ms-5">
                            <strong>{{ email.to }}</strong> - <span class="text-muted">{{ email.subject }}</span>
                            <p class="text-muted" v-html="email.message"></p>
                        </div> -->
                        <div class="email-info d-flex flex-grow-1 align-items-center">
                            <strong :style="{ fontWeight: email.is_read ? 'normal' : 'bold' }" class="me-2">
                                {{ email.to }}
                            </strong>
                            <span class="text-muted text-truncate" :style="{
                                fontWeight: email.is_read ? 'normal' : 'bold',
                                color: email.is_read ? 'black' : '',
                            }">{{ email.subject }}</span>
                            <span v-html="email.message" class="snippet mt-3 ms-2 text-truncate flex-grow-1"
                                :class="{ 'text-muted': !email.hovered }">
                            
                            </span>
                        </div>

                    </div>

                    <div class="email-actions d-flex">
                        <span title="Show">
                            <EyeIcon style="cursor: pointer;" class="h-5 w-5 mx-2"
                                @click="$router.push({ name: 'EmailSentDetails', params: { id: email.id } })" />
                        </span>
                        <span title="Move to trash">
                            <TrashIcon style="cursor: pointer;" class="h-5 w-5 mx-2"
                                @click.stop="moveToTrash(email.id)" />
                        </span>
                        <!-- <EnvelopeIcon class="h-5 w-5 mx-2" @click.stop="markAsRead(email.id)" /> -->
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
import toastr from 'toastr';import image from '../assets/img/Untitled.png';


export default {
    components: {
        EyeIcon,
        TrashIcon
    },
    data() {
        return {
            emails: [],
            loading: true,
            image,
            selectedEmails: [],
        };
    },

    mounted() {
        this.getSentEmail();
    },

    methods: {
        async getSentEmail() {
            try {
                this.loading = true; 
                const token = localStorage.getItem("token");
                const response = await axios.get(`${apiUrl}sent-emails`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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


        async moveToTrash(emailId) {
            try {
                await axios.patch(`${apiUrl}emails/${emailId}/sentTrash`);
                toastr.success('Successfully Email Move to Trash.');
                this.getSentEmail();
            } catch (error) {
                console.error('Error moving email to trash:', error);
            }
        },

        async moveSelectedEmailsToTrash() {
            if (!this.selectedEmails.length) return;
            try {
                // API call to move selected emails to trash
                await axios.patch(`${apiUrl}emails/trash`, {
                    emailIds: this.selectedEmails,
                });

                // Remove trashed emails from the local list
                this.emails = this.emails.filter(
                    (email) => !this.selectedEmails.includes(email.id)
                );

                // Clear the selection
                this.selectedEmails = [];
                toastr.success("Selected emails moved to trash.");
                this.getEmail();
            } catch (error) {
                console.error("Error moving emails to trash:", error);
                toastr.error("Failed to move emails to trash.");
            }
        },


        toggleEmailSelection(emailId) {
            const index = this.selectedEmails.indexOf(emailId);
            if (index === -1) {
                this.selectedEmails.push(emailId); // Add email to selection
            } else {
                this.selectedEmails.splice(index, 1); // Remove email from selection
            }
        },

    }
};
</script>

<style scoped>
.trash_button {
    cursor: pointer;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    background: linear-gradient(to right, #feae78, #fed0b2);
}
.email-item {
    cursor: pointer;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.email-item:hover {
    box-shadow: 0px 7px 12px rgba(0, 0, 0, 0.1);
    transform: scale(1.01);
}

.email-info {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
}

.snippet {
    max-width: 500px;
    /* Adjust as needed */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.email-actions {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.email-item:hover .email-actions {
    opacity: 1;
}

.email-item:hover .snippet {
    max-width: 350px;
}

.action-icon {
    cursor: pointer;
    color: #6c757d;
    /* Default muted color */
}

.action-icon:hover {
    color: #000;
    /* Highlight on hover */
}

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

@media (max-width: 698px) {
    .display {
        display: flex;
        flex-direction: column;
    }
}
</style>
