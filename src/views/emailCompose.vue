<template>
    <div class="compose-email">
        <!-- <p>Compose Email</p> -->
        <form @submit.prevent="sendEmail">
            <div class="form-group">
                <label>From:</label>
                <select v-model="email.from" required>
                    <option v-for="userEmail in userEmails" :key="userEmail" :value="userEmail">
                        {{ userEmail }}
                    </option>
                    <option v-if="!userEmails.includes(email.from)" :value="email.from">
                        {{ email.from }} (not in list)
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
                        {{ file.name }}
                    </li>
                </ul>
            </div>


            <div class="text-end">
                <button type="submit" :disabled="isSending">
                    <span v-if="isSending" class="loader"></span>
                    <span v-else>Send</span>
                </button>
            </div>
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
            draftTimer: null,
            isDraftSaved: false,
        };
    },
    // watch: {
    //     email: {
    //         deep: true,
    //         handler() {
    //             this.startAutoSave();
    //         },
    //     },
    // },
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
            // this.startAutoSave();
        },

        // startAutoSave() {
        //     clearTimeout(this.draftTimer);

        //     this.draftTimer = setTimeout(() => {
        //         this.saveDraft();
        //     }, 5000);
        // },

        async saveDraft() {
            if (this.isDraftSaved) return; // Don't save if already sent or saved

            const { message, attachments, subject, to, from, cc } = this.email;

            if (!message && attachments.length === 0 && !subject && !to) return;

            let formData = new FormData();
            formData.append('message', message);
            formData.append('subject', subject);
            formData.append('to', to);
            formData.append('from', from);
            formData.append('cc', cc);

            attachments.forEach((file) => {
                formData.append('attachments[]', file);
            });

            try {
                const token = localStorage.getItem('token');
                await axios.post(`${apiUrl}drafts`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Draft saved successfully');
            } catch (error) {
                console.error('Failed to save draft:', error);
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

            // Add multiple attachments

            this.email.attachments.forEach((file) => {
                formData.append('attachments[]', file);
            });


            try {
                await axios.post(`${apiUrl}send-email`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
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
        }
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
    background-color: #0CAF60;
    text-align: center;
    color: white;
    padding: 23px;
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
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
