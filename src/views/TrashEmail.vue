<template>
    <div class="email-list">

        <div v-if="loading" class="loader-container">
            <div class="loader"></div>
        </div>

        <div v-else>
            <div class="my-4 ms-3 d-flex gap-3">
                <button class="trash_button" v-show="selectedEmails.length > 0" @click="moveSelectedEmailsToTrash">Delete
                    </button>
                <button class="dlt-btn" @click="confirmDeleteAll">Delete all email</button>
            </div>

            <div v-if="emails.length > 0">

                <div v-for="email in emails" :key="email.id"
                    class="email-item ms-3 d-flex justify-content-between align-items-center p-3 border-bottom display">
                    <div class="d-flex align-items-center flex-grow-1">

                        <!-- <input style="cursor: pointer" class="me-3" type="checkbox" :value="email.id"
                            @change="toggleEmailSelection(email.id)" /> -->

                    
                        <div class="email-info d-flex flex-grow-1 align-items-center">
                            <strong :style="{ fontWeight: email.is_read ? 'normal' : 'bold' }" class="me-2">
                                {{ email.sender }}
                            </strong>
                            <span class="text-muted text-truncate" :style="{
                                fontWeight: email.is_read ? 'normal' : 'bold',
                                color: email.is_read ? 'black' : '',
                            }">{{ email.subject }}</span>
                            <span class="snippet ms-2 text-truncate flex-grow-1"
                                :class="{ 'text-muted': !email.hovered }">
                                {{ email.snippet }}
                            </span>
                        </div>
                    </div>
                    <div class="email-actions d-flex">
                        <span title="Show">
                            <EyeIcon style="cursor: pointer;" class="h-5 w-5 mx-2"
                                @click="$router.push({ name: 'EmailDetails', params: { id: email.id } })" />
                        </span>
                        <span title="Delete Email">
                            <TrashIcon style="cursor: pointer;" class="h-5 w-5 mx-2"
                                @click.stop="deleteEmail(email.id)" />
                        </span>
                        <span title="Restore Email">
                            <ArrowUturnLeftIcon style="cursor: pointer;" class="h-5 w-5 mx-2"
                                @click.stop="restoreEmail(email.id)" />
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
import { EyeIcon, TrashIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';
import toastr from 'toastr';
import Swal from "sweetalert2";
import image from '../assets/img/Untitled.png';


export default {
    components: {
        EyeIcon,
        TrashIcon,
        ArrowUturnLeftIcon
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
        this.getTrashEmails();
    },

    methods: {
        async confirmDeleteAll() {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This will permanently delete all emails in the trash.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete all!",
            });

            if (result.isConfirmed) {
                this.deleteAllEmails();
            }
        },
        async deleteAllEmails() {
            try {
                await axios.delete(`${apiUrl}emails/delete-all-trash`);
                Swal.fire("Deleted!", "All trashed emails have been deleted.", "success");
                // Refresh the email list
                this.getTrashEmails();
            } catch (error) {
                console.error(error);
                Swal.fire("Error!", "Failed to delete emails.", "error");
            }
        },
        async getTrashEmails() {
            try {
                this.loading = true; // Show loader
                const response = await axios.get(`${apiUrl}emailsTrash`);
                this.emails = response.data.email;
            } catch (error) {
                console.error('Error fetching trash emails:', error);
            }
            finally {
                this.loading = false;
            }
        },

        async deleteEmail(emailId) {
            try {
                await axios.delete(`${apiUrl}emails/${emailId}/sentDelete`);
                toastr.success('Email Deleted Successfully.');
                this.getTrashEmails();
            } catch (error) {
                console.error('Error deleting email:', error);
            }
        },

        async restoreEmail(emailId) {
            try {
                await axios.patch(`${apiUrl}emails/${emailId}/sentRestore`);
                toastr.success('Email Restored Successfully.');
                this.getTrashEmails();
            } catch (error) {
                console.error('Error restoring email:', error);
            }
        },

        async moveToTrash(emailId) {
            try {
                await axios.patch(`${apiUrl}emails/${emailId}/trash`);
                toastr.success('Successfully Email Move to Trash.');
                this.getEmail();
            } catch (error) {
                console.error('Error moving email to trash:', error);
            }
        },

        async markAsRead(email) {
            try {
                if (!email.is_read) {
                    await axios.patch(`${apiUrl}emails/${email}/read`);
                    toastr.success('Successfully Read Email');
                    this.getEmail();
                }
            } catch (error) {
                console.error('Error marking email as read:', error);
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

.dlt-btn {
    border: none;
    padding: 5px 20px;
    /* margin: 10px; */
    border-radius: 6px;
    background-color: rgb(248, 46, 46);
    color: white;
}

@media (max-width: 698px) {
    .display {
        display: flex;
        flex-direction: column;
    }
}
</style>
