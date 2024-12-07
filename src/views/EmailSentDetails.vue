<template>
    <div v-if="email" class="email-details">
        <div class="d-flex gap-3">

            <button @click="$router.back()" class="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 50px; height: 19px; "
                    class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <span title="Mark as read">
                <EnvelopeIcon style="height: 20px; width:20px;" class="h-5 w-5 mt-2 mx-2 "
                    :class="email.is_read ? 'text-warning' : ''" @click.stop="markAsRead(email.id)" />
            </span>
            <span title="Move to trash">
                <TrashIcon style="height: 20px; width:20px;" class="h-5 w-5 mt-2 mx-2"
                    @click.stop="moveToTrash(email.id)" />
            </span>
            <span title="Move to Archive">
                <ArchiveBoxIcon style="height: 20px; width:20px;" class="h-5 w-5 mt-2 mx-2"
                    @click.stop="moveToArchive(email.id)" />
            </span>

        </div>

        <hr>

        <div>
            <h4 style="margin-left: 95px;" class="mb-4">{{ email.subject }}</h4>

            <div class="d-flex justify-content-between display">
                <div class="d-flex mb-2">
                    <img style="width: 70px; height: 70px;"
                        src="https://thumbs.dreamstime.com/z/businessman-avatar-image-beard-hairstyle-male-profile-vector-illustration-178545831.jpg"
                        alt="">
                    <div class="ms-4 mt-2">
                        <p class=""> me</p>
                        <p><strong>to</strong> {{ email.to }}</p>
                    </div>
                </div>

                <div class="d-flex gap-2 time" style="margin-right: 80px;">
                    <p class="">{{ formatTime(email.created_at) }}</p>
                    <StarIcon style="height: 20px; width:20px;" class="h-5 w-5 ms-2" />
                </div>
            </div>

            <div class="container mx-auto my-3">
                <div>
                    <p v-html="email.message"></p>
                </div>

                <div v-if="email.attachments && email.attachments.length > 0" class="attachments">
                    <h5>Attachments</h5>
                    <ul class="attachment-list">
                        <li v-for="(attachment, index) in email.attachments" :key="index" class="attachment-item">
                            <!-- Attachment Preview -->
                            <div class="attachment-preview">
                                <img v-if="isImage(attachment)" :src="getAttachmentUrl(attachment)"
                                    :alt="getFileName(attachment)" class="attachment-image" />

                                <!-- Hover Icons -->
                                <div class="overlay">
                                    <!-- View Icon -->
                                    <!-- <svg @click="viewAttachment(attachment)" xmlns="http://www.w3.org/2000/svg"
                                        class="h-6 w-6 text-white cursor-pointer hover:text-gray-300" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15 10l4.55-4.55a9 9 0 1 0 4.55 4.55L15 10z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg> -->
                                    <EyeIcon style="cursor: pointer; color:white;" class="h-5 w-5 mx-2"
                                        @click="viewAttachment(attachment)" />
                                    <!-- Download Icon -->
                                    <svg @click="downloadAttachment(attachment)" xmlns="http://www.w3.org/2000/svg"
                                        class="h-6 w-6 text-white cursor-pointer hover:text-gray-300" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M4 16v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1M4 10l7 7m0 0l7-7m-7 7V3" />
                                    </svg>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>

            <div class="container mx-auto">
                <button @click="showReplyForm = !showReplyForm" class="reply-button">
                    {{ showReplyForm ? 'Cancel Reply' : 'Reply' }}
                </button>

                <div v-if="showReplyForm" class="reply-form">
                    <h3>Reply</h3>
                    <form @submit.prevent="sendReply">
                        <label>
                            To:
                            <input type="text" v-model="replyTo" readonly />
                        </label>
                        <label>
                            Message:
                            <ckeditor :editor="editor" v-model="replyMessage" :config="editorConfig"></ckeditor>
                        </label>
                        <button type="submit" :disabled="isSending" class="reply-button">
                            <span v-if="isSending" class="loader "></span>
                            <span v-else>Send Reply</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>

    </div>
    <div v-else>
        <p>Loading email details...</p>
        <div class="loader"></div>
    </div>
</template>

<script>
import axios from 'axios';
import { apiUrl, appUrl } from '@/globalVariable';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EnvelopeIcon, TrashIcon, ArchiveBoxIcon, StarIcon, EyeIcon } from '@heroicons/vue/24/outline';



export default {
    props: ['id'],
    data() {
        return {
            editor: ClassicEditor,
            editorConfig: {
                // Add any custom CKEditor configuration here if needed
                placeholder: 'Reply',
            },
            email: null,
            showReplyForm: false,
            replyTo: '',
            replyMessage: '',
            isSending: false, // Loader state for sending email
            isPreviewHovered: null,
        };
    },
    components: {
        Ckeditor,
        EnvelopeIcon,
        TrashIcon,
        ArchiveBoxIcon,
        StarIcon,
        EyeIcon
    },

    mounted() {
        this.fetchEmailDetails();
    },
    methods: {
        async fetchEmailDetails() {
            try {
                const response = await axios.get(`${apiUrl}sentEmails/${this.id}`);
                this.email = response.data.email;

                // Parse attachments if they exist
                if (this.email.attachment) {
                    this.email.attachments = JSON.parse(this.email.attachment);
                } else {
                    this.email.attachments = [];
                }

                this.replyTo = this.email.to;
            } catch (error) {
                console.error('An error occurred while fetching the email details.');
            }
        },

        // View the attachment in a new tab
        viewAttachment(attachment) {
            const url = this.getAttachmentUrl(attachment);
            window.open(url, '_blank');
        },



        downloadAttachment(attachment) {
            const url = `${apiUrl}download/${encodeURIComponent(attachment)}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = attachment.split('/').pop(); // Extract filename
                    link.click();
                    window.URL.revokeObjectURL(link.href); // Cleanup
                })
                .catch(error => console.error('Fetch error:', error));
        },

        getAttachmentUrl(attachment) {
            return `${appUrl}${attachment}`;
        },

        getFileName(attachment) {
            return attachment.split('/').pop();
        },

        isImage(attachment) {
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
            return imageExtensions.some((ext) => attachment.toLowerCase().endsWith(ext));
        },

        setPreviewHover(index) {
            this.isPreviewHovered = index;
        },

        async sendReply() {
            this.isSending = true;
            try {
                const response = await axios.post(`${apiUrl}emails/reply`, {
                    to: this.replyTo,
                    message: this.replyMessage,
                    originalEmailId: this.email.id,
                });
                toastr.success('Reply sent successfully.')
                console.log('Reply sent successfully:', response.data);
                this.replyMessage = '';
                this.showReplyForm = false;
            } catch (error) {
                toastr.error('Reply sent Error.')
                console.error('An error occurred while sending the reply.');
            } finally {
                this.isSending = false;
            }
        },

        formatTime(timestamp) {
            const date = new Date(timestamp);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }).format(date);

            const now = new Date();
            const diffInMs = now - date;
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            return `${formattedDate} (${diffInDays} days ago)`;
        },
    },
};
</script>

<style scoped>
.email-details {
    max-width: 100%;
    margin: 10px auto;
    background-color: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
}

/* h2 {
    color: #0CAF60;
} */

.reply-button {
    background-color: #0CAF60;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    text-decoration: none;
}

button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    background-color: white
}


.reply-form {
    margin-top: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.reply-form label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
}

.reply-form input,
.reply-form textarea {
    width: 100%;
    padding: 10px;
    /* border: 1px solid #0CAF60; */
    border-radius: 4px;
    margin-bottom: 15px;
    font-size: 14px;
    outline: none;
}

.reply-form textarea {
    resize: vertical;
}

.loader {
    border: 4px solid #a4d4a3;
    border-top: 4px solid #0CAF60;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin-right: 10px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.back-button {
    /* background-color: #0CAF60;
    color: white; */
    font-size: 14px;
    cursor: pointer;
    border: none;
    padding: 10px 30px;
    text-decoration: none;
    margin: 20px 0px;
}

.attachments {
    margin-top: 20px;
}

.attachment-list {
    list-style-type: none;
    padding: 0;
}

.attachment-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    position: relative;
}

.attachment-preview {
    position: relative;
    width: 250px;
    height: 250px;
    margin-right: 15px;
    overflow: hidden;
    cursor: pointer;
}

.attachment-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.file-icon {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 5px;
}


.attachment-name {
    flex-grow: 1;
}

.attachment-name a {
    text-decoration: none;
    color: #007bff;
}


.attachment-preview:hover .attachment-image {
    transform: scale(1.05);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    /* Space between icons */
    background-color: rgba(0, 0, 0, 0.5);
    /* Semi-transparent black overlay */
    opacity: 0;
    /* Hidden by default */
    transition: opacity 0.3s ease;
    /* Smooth fade-in effect */
}

.attachment-preview:hover .overlay {
    opacity: 1;
}


svg {
    width: 34px;
    /* margin: 10px; */
    height: 34px;
}

svg:hover {
    color: #ccc;
}

.time {
    font-size: 16px;
}

@media (max-width: 698px) {
    .display {
        display: flex;
        flex-direction: column;
        gap: 0px;
    }

    .time {
        font-size: 12px;
        margin-left: 95px;
        margin-top: -10px;
    }
}
</style>
