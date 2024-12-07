<template>
    <div class="email-list">
        <div v-if="loading" class="loader-container">
            <div class="loader"></div>
        </div>

        <!-- Email List -->
        <div v-else>
            <hr class="m-0" />
            <div v-if="emails.length > 0">
                <!-- Searchbar -->
                <div class="d-flex justify-content-between w-100 display">
                    <div class="d-flex gap-5 p-4 mt-2">
                        <!-- Tooltip for Envelope Icon -->
                        <span ref="envelopeIcon" style="cursor: pointer" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Read Emails">
                            <EnvelopeOpenIcon class="h-5 w-5" @click="filterByReadStatus" />
                        </span>

                        <!-- Tooltip for Star Icon -->
                        <span ref="starIcon" style="cursor: pointer" data-bs-toggle="tooltip" data-bs-placement="top"
                            title="Without Starred Emails">
                            <StarIcon class="h-5 w-5" @click="filterWithoutStarred" />
                        </span>

                        <!-- Tooltip for Star Icon (Starred Emails) -->
                        <span ref="starredIcon" style="cursor: pointer" data-bs-toggle="tooltip" data-bs-placement="top"
                            title="Starred Emails">
                            <StarIcon class="h-5 w-5 text-warning" @click="filterByStarred" />
                        </span>

                        <!-- Tooltip for Settings Icon -->
                        <span ref="settingsIconWrapper" style="cursor: pointer; width: 22px; height: 22px"
                            data-bs-toggle="tooltip" data-bs-placement="top" title="Settings" role="button">
                            <SettingIcon class="h-5 w-5" @click="openSettings" />
                        </span>

                        <button class="trash_button" v-show="selectedEmails.length > 0"
                            @click="moveSelectedEmailsToTrash">Trash All</button>
                    </div>

                    <div class="mt-1 d-flex" style="margin-right: 30px; position: relative">
                        <!-- Input Field -->
                        <input type="text" v-model="searchQuery" @input="searchEmails"
                            class="form-control searchbar ps-5" placeholder="Search Email...."
                            style="padding-right: 40px" />

                        <!-- Search Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" style="
                width: 30px;
                height: 30px;
                position: absolute;
                top: 50%;
                right: 18px;
                transform: translateY(-50%);
                color: #666;
                cursor: pointer;
              ">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                </div>

                <hr />

                <!-- Email Items -->
                <div v-for="email in filteredEmails" :key="email.id"
                    class="email-item d-flex justify-content-between align-items-center p-3 border-bottom"
                    @click="handleEmailClick(email)" @mouseover="email.hovered = true"
                    @mouseleave="email.hovered = false">
                    <!-- Email Content -->
                    <div class="d-flex align-items-center flex-grow-1">

                        <input style="cursor: pointer" class="me-3" type="checkbox" :value="email.id"
                            @change="toggleEmailSelection(email.id)" />

                        <StarIcon style="cursor: pointer" class="h-5 w-5 me-3" @click.stop="markAsStarred(email.id)"
                            :class="email.is_starred ? 'text-warning' : 'text-muted'" />
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

                    <!-- Email Actions -->
                    <div class="email-actions d-flex">
                        <span ref="eyeIcon" title="Show">
                            <EyeIcon class="h-5 w-5 mx-2"
                                @click="$router.push({ name: 'EmailDetails', params: { id: email.id } })" />
                        </span>
                        <span ref="markAsReadIcon" title="Mark As Read">
                            <EnvelopeIcon style="cursor: pointer" class="h-5 w-5 mx-2"
                                :class="email.is_read ? 'text-warning' : ''" @click.stop="markAsRead(email.id)" />
                        </span>
                        <span ref="trashIcon" title="Move to trash">
                            <TrashIcon class="h-5 w-5 mx-2" @click.stop="moveToTrash(email.id)" />
                        </span>
                        <span ref="archiveIcon" title="Move to Archive">
                            <ArchiveBoxIcon class="h-5 w-5 mx-2" @click.stop="moveToArchive(email.id)" />
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
import axios from "axios";
import { apiUrl } from "@/globalVariable";
import {
    EyeIcon,
    EnvelopeIcon,
    TrashIcon,
    EnvelopeOpenIcon,
    StarIcon,
    ArchiveBoxIcon,
    Cog6ToothIcon as SettingIcon,
} from "@heroicons/vue/24/outline";

import toastr from "toastr";
import "toastr/build/toastr.min.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import image from '../assets/img/Untitled.png';

export default {
    components: {
        EyeIcon,
        EnvelopeIcon,
        TrashIcon,
        StarIcon,
        EnvelopeOpenIcon,
        ArchiveBoxIcon,
        SettingIcon,

    },
    data() {
        return {
            emails: [],
            loading: true,
            filteredEmails: [],
            searchQuery: "",
            isReadFiltered: null,
            isStarredFiltered: null,
            isNotStarredFiltered: null,
            image,
            selectedEmails: [],
        };
    },
    created() {
        this.filteredEmails = this.emails;
    },


    mounted() {
        this.getEmail();
    },

    // beforeUnmount() {
    //     if (this.interval) {
    //         clearInterval(this.interval);
    //     }
    // },

    methods: {
        async getEmail() {
            try {
                this.loading = true;
                const token = localStorage.getItem("token");
                const response = await axios.get(`${apiUrl}emails`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.emails = response.data.email;
                this.filteredEmails = this.emails;
            } catch (error) {
                console.error("An error occurred while fetching emails.", error);
            } finally {
                this.loading = false;
            }
        },

        async markAsRead(email) {
            try {
                if (!email.is_read) {
                    await axios.patch(`${apiUrl}emails/${email}/read`);
                    toastr.success("Successfully Read Email");
                    this.getEmail();
                }
            } catch (error) {
                console.error("Error marking email as read:", error);
            }
        },

        async handleEmailClick(email) {
            try {
                if (!email.is_read) {
                    await axios.patch(`${apiUrl}emails/${email.id}/read`);
                    // toastr.success('Successfully Read Email');
                    // this.getEmail();
                    this.$router.push({ name: "EmailDetails", params: { id: email.id } });
                }
            } catch (error) {
                console.error("Error marking email as read:", error);
            }
        },

        async markAsStarred(email) {
            try {
                if (!email.is_starred) {
                    await axios.patch(`${apiUrl}emails/${email}/star`);
                    toastr.success("Successfully Starred Email");
                    this.getEmail();
                }
            } catch (error) {
                console.error("Error marking email as starred:", error);
            }
        },

        searchEmails() {
            if (this.searchQuery.trim() === "") {
                this.filteredEmails = this.emails;
            } else {
                this.filteredEmails = this.emails.filter(
                    (email) =>
                        email.snippet.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        email.sender.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
        },

        openSettings() {
            this.$router.push("/config-index");
        },

        async moveToTrash(emailId) {
            try {
                await axios.patch(`${apiUrl}emails/${emailId}/trash`);
                toastr.success("Successfully Email Move to Trash.");
                this.getEmail();
            } catch (error) {
                console.error("Error moving email to trash:", error);
            }
        },

        async moveToArchive(emailId) {
            try {
                await axios.patch(`${apiUrl}emails/${emailId}/archive`);
                toastr.success("Successfully Email move to Archive.");
                this.getEmail();
            } catch (error) {
                console.error("Error moving email to archive:", error);
            }
        },

        filterByReadStatus() {
            if (this.isReadFiltered === null || this.isReadFiltered === 0) {
                this.isReadFiltered = 1;
                this.isStarredFiltered = null;
                this.isNotStarredFiltered = null;
            } else {
                this.isReadFiltered = null;
            }
            this.applyFilters();
        },

        filterByStarred() {
            if (this.isStarredFiltered === null || this.isStarredFiltered === 0) {
                this.isStarredFiltered = 1;
                this.isNotStarredFiltered = null;
                this.isReadFiltered = null;
            } else {
                this.isStarredFiltered = null;
            }
            this.applyFilters();
        },

        filterWithoutStarred() {
            if (this.isNotStarredFiltered === null || this.isNotStarredFiltered === 1) {
                this.isNotStarredFiltered = 0;
                this.isStarredFiltered = null;
                this.isReadFiltered = null;
            } else {
                this.isNotStarredFiltered = null;
            }
            this.applyFilters();
        },

        applyFilters() {
            let filtered = this.emails;

            if (this.isReadFiltered !== null) {
                filtered = filtered.filter((email) => email.is_read === this.isReadFiltered);
            }

            if (this.isStarredFiltered !== null) {
                filtered = filtered.filter(
                    (email) => email.is_starred === this.isStarredFiltered
                );
            }

            if (this.isNotStarredFiltered !== null) {
                filtered = filtered.filter(
                    (email) => email.is_starred === this.isNotStarredFiltered
                );
            }

            this.filteredEmails = filtered;
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
    },
};
</script>

<style scoped>
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

.searchbar {
    margin: 10px;
    width: 100%;
    border: 1px solid #0caf60;
    border-radius: 10px;
    padding: 13px;
}

.email-list {
    flex: 1;
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
    border-top: 4px solid #0caf60;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

.tooltip {
    z-index: 1050 !important;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.h-5 {
    height: 1.25rem;
}

.w-5 {
    width: 1.25rem;
}

.starIcon {
    margin-top: 21px;
    margin-left: 10px;
}

@media (max-width: 698px) and (min-width: 500px) {
    .display {
        display: flex;
        flex-direction: column;
    }

    .starIcon {
        margin-top: 20px;
    }
}

@media (max-width: 500px) {
    .display {
        display: flex;
        flex-direction: column;
    }

    .starIcon {
        margin-top: 37px;
    }
}

.trash_button {
    cursor: pointer;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    background: linear-gradient(to right, #feae78, #fed0b2);
}
</style>
