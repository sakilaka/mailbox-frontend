<template>
    <div class="compose-email">
        <!-- <p>Compose Email</p> -->
        <form @submit.prevent="sendEmail">
            <!-- Form Inputs -->
            <div class="form-group">
                <label>From:</label>
                <select v-model="email.from" required>
                    <option v-for="userEmail in userEmails" :key="userEmail" :value="userEmail">
                        {{ userEmail }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label>To:</label>
                <input type="email" v-model="email.to" required />
            </div>
            <div class="form-group">
                <label>CC:</label>
                <input type="email" v-model="email.cc" />
            </div>
            <div class="form-group">
                <label>Subject:</label>
                <input type="text" v-model="email.subject" required />
            </div>
            <div class="form-group">
                <label>Message:</label>
                <ckeditor :editor="editor" v-model="email.message" :config="editorConfig" class="custom-editor">
                </ckeditor>
            </div>
            <div class="form-group">
                <label>Attachment:</label>
                <input type="file" @change="handleAttachment" multiple />
            </div>

            <div v-if="email.attachments.length > 0">
                <ul>
                    <li v-for="(file, index) in email.attachments" :key="index">
                        <p>{{ file.name }}</p>
                        <button @click="removeAttachment(index)" class="remove-button">Remove</button>
                    </li>
                </ul>
            </div>

            <!-- Buttons -->
            <div class="text-end">
                <button type="submit" :disabled="isSending">
                    <span v-if="isSending" class="loader"></span>
                    <span v-else>Send</span>
                </button>
                <button type="button" @click="openScheduleModal" class="ms-2 btn btn-secondary">Schedule Send</button>
            </div>

            <!-- Custom Modal -->
            <div v-if="isScheduleModalOpen" class="custom-modal">
                <div class="custom-modal-content">
                    <div class="custom-modal-header">
                        <h5>Schedule Email</h5>
                        <button class="close-btn" @click="closeScheduleModal">&times;</button>
                    </div>
                    <div class="custom-modal-body">
                        <form @submit.prevent="scheduleEmail">
                            <div class="form-group">
                                <label for="schedule-date">Select Date:</label>
                                <input id="schedule-date" type="date" v-model="scheduleDate" required />
                            </div>
                            <div class="form-group">
                                <label for="schedule-time">Select Time:</label>
                                <input id="schedule-time" type="time" v-model="scheduleTime" required />
                            </div>
                            <div class="text-end mt-3">
                                <button type="submit" :disabled="isScheduling" class="btn btn-primary">
                                    <span v-if="isScheduling" class="loader"></span>
                                    <span v-else>Schedule</span>
                                </button>
                                <button style="margin-left: 5px;margin-bottom: 2px;" type="button"
                                    class="btn btn-danger" @click="closeScheduleModal">
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <!-- Modal Background -->
            <div v-if="isScheduleModalOpen" class="custom-modal-overlay" @click="closeScheduleModal"></div>
        </form>

    </div>
</template>

<script>
import axios from 'axios';
import { apiUrl } from '@/globalVariable';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap JavaScript
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


export default {
    data() {
        return {
            editor: ClassicEditor,
            editorConfig: {
                placeholder: 'Compose your message...',
                height: 200,
            },
            email: {
                from: '',
                to: '',
                cc: '',
                subject: '',
                message: '',
                attachments: []
            },
            userEmails: [],
            isSending: false,
            isScheduling: false,

            draftTimer: null,
            isDraftSaved: false,
            isScheduleModalOpen: false,
            scheduleDate: '',
            scheduleTime: '',
        };
    },

    beforeRouteLeave(to, from, next) {
        if (!this.isDraftSaved) {
            this.saveDraft().then(() => {
                next();
            });
        } else {
            next();
        }
    },
    components: {
        Ckeditor,
    },

    async created() {
        const draftData = this.$route.query;

        if (draftData && Object.keys(draftData).length > 0) {
            this.email = {
                from: draftData.from || '',
                to: draftData.to || '',
                cc: draftData.cc || '',
                subject: draftData.subject || '',
                message: draftData.message || '',
                attachments: [] // Placeholder for attachments
            };

            // Fetch or populate attachments if they exist
            if (draftData.attachments && draftData.attachments.length > 0) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${apiUrl}drafts/${draftData.id}/attachments`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    // Set the attachments to email.attachments
                    this.email.attachments = response.data.attachments.map(file => ({
                        name: file.name,
                        url: file.url
                    }));
                } catch (error) {
                    console.error('Failed to fetch attachments:', error);
                }
            }
        } else {
            await this.getUserEmails();
        }
    },


    mounted() {
        this.getUserEmails();
    },


    methods: {
        openScheduleModal() {
            this.isScheduleModalOpen = true;
        },
        closeScheduleModal() {
            this.isScheduleModalOpen = false;
        },

        async getUserEmails() {
            try {
                const response = await axios.get(`${apiUrl}user-emails`);
                this.userEmails = response.data.emails;

                if (this.userEmails.length > 0) {
                    this.email.from = this.userEmails[0];
                }
            } catch (error) {
                console.error('An error occurred while fetching emails:', error);
            }
        },

        handleAttachment(event) {
            this.email.attachments = Array.from(event.target.files);
        },


        removeAttachment(index) {
            this.email.attachments.splice(index, 1);
        },


        async saveDraft() {
            if (this.isDraftSaved) {
                console.log("Draft already saved, skipping save operation.");
                return;
            }

            const { message, attachments, subject, to, from, cc } = this.email;


            console.log("Preparing to save draft", {
                message,
                attachments,
                subject,
                to,
                from,
                cc,
            });

            if (!message && attachments.length === 0 && !subject && !to) {
                console.log("No content to save as a draft.");
                return;
            }

            let formData = new FormData();
            formData.append("message", message || "");
            formData.append("subject", subject || "");
            formData.append("to", to || "");
            formData.append("from", from || "");
            formData.append("cc", cc || "");

            attachments.forEach((file) => {
                formData.append("attachments[]", file);
                console.log("Attachment added to draft", file);
            });

            try {
                const token = localStorage.getItem("token");
                const response = await axios.post(`${apiUrl}drafts`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Draft saved successfully", response.data);
                toastr.success("Draft saved successfully");
            } catch (error) {
                console.error("Failed to save draft", error);
            }
        },




        beforeDestroy() {
            this.saveDraft(); // Save draft when leaving the page
        },

        async sendEmail() {
            this.isSending = true; // Show the loader

            const formData = new FormData();
            formData.append('from', this.email.from);
            formData.append('to', this.email.to);
            formData.append('cc', this.email.cc);
            formData.append('subject', this.email.subject);
            formData.append('message', this.email.message);

            this.email.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });


            try {
                const token = localStorage.getItem("token");
                await axios.post(`${apiUrl}send-email`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    }
                });
                toastr.success('Email sent successfully!');
                this.isDraftSaved = true;
                this.$router.push('/profile');
            } catch (error) {
                console.error('Failed to send email:', error);
                toastr.error('Failed to send email.');
            } finally {
                this.isSending = false; // Hide loader
            }
        },

        async scheduleEmail() {
            this.isScheduling = true;
            const schedule_time = `${this.scheduleDate} ${this.scheduleTime}`;
            // console.log(schedule_time);


            const formData = new FormData();
            formData.append('from', this.email.from);
            formData.append('to', this.email.to);
            formData.append('cc', this.email.cc);
            formData.append('subject', this.email.subject);
            formData.append('message', this.email.message);
            formData.append('schedule_time', schedule_time);

            this.email.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });

            try {
                const token = localStorage.getItem("token");
                await axios.post(`${apiUrl}schedule-email`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    Authorization: `Bearer ${token}`,
                });
                this.isDraftSaved = true;
                toastr.success('Email scheduled successfully!');
            } catch (error) {
                console.error('Failed to schedule email:', error);
                toastr.error('Failed to schedule email.');
            } finally {
                this.isScheduling = false;
                this.closeScheduleModal();
                this.$router.push('/profile');
            }
        },
    }

};
</script>

<style scoped>
.compose-email {
    max-width: 100%;
    margin: 10px auto;
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
}

p {
    padding: 5px;
    font-size: 20px;
    border-radius: 5px;
    font-weight: bold;
}



.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    font-weight: bold;
    /* color: #0CAF60; */
    margin-bottom: 5px;
}

input,
select,
textarea {
    width: 100% !important;
    padding: 10px;
    border-right: 1px solid #0CAF60;
    border-left: 1px solid #0CAF60;
    border-radius: 4px;
    outline: none;
}

textarea {
    resize: vertical;
}

button {
    /* width: 100%; */
    padding: 8px 20px;
    background-color: #0CAF60;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 20px;
    cursor: pointer;
    font-weight: bold;

}

button:disabled {
    background-color: #a4d4a3;
    cursor: not-allowed;
}

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

/* Modal Overlay */
.custom-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    /* Ensure it's above all other content */
}

/* Modal Box */
.custom-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 500px;
    background: white;
    border-radius: 8px;
    z-index: 1000;
    /* Ensure it's above the overlay */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

/* Modal Content */
.custom-modal-content {
    padding: 20px;
}

.custom-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
}

.custom-modal-header h5 {
    margin: 0;
}

.custom-modal-body {
    margin-top: 15px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.close-btn:hover {
    color: red;
}
</style>
