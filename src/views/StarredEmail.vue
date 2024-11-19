<template>

    <div class="email-list">
        <div v-if="loading" class="loader-container">
            <div class="loader"></div>
        </div>

      <div class="v-else">
        <!-- <div class="d-flex gap-5 p-4">
            <FolderIcon class="h-5 w-5" />
            <EnvelopeOpenIcon class="h-5 w-5" />
            <StarIcon class="h-5 w-5" />
            <StarIcon class="h-5 w-5 text-warning" />
        </div>

        <hr> -->

        <div v-for="email in emails" :key="email.id"
            class="email-item ms-3 d-flex justify-content-between align-items-center p-3 border-bottom"
            @click="$router.push({ name: 'EmailDetails', params: { id: email.id } })">
            <div class="d-flex">
                <div class="d-flex gap-2">
                    <input type="checkbox">
                    <!-- <StarIcon class="h-5 w-5" /> -->
                </div>
                <div class="email-info ms-5">
                    <strong>{{ email.sender }}</strong> - <span class="text-muted">{{ email.subject }}</span>
                    <p class="text-muted">{{ email.snippet }}</p>
                </div>
            </div>

            <div class="email-actions d-flex">
                <EyeIcon class="h-5 w-5 mx-2" @click="$router.push({ name: 'EmailDetails', params: { id: email.id } })"/>
                <EnvelopeIcon class="h-5 w-5 mx-2" @click.stop="markAsRead(email.id)" />
                <TrashIcon class="h-5 w-5 mx-2" @click.stop="moveToTrash(email.id)"/>
            </div>

        </div>
      </div>

    </div>
</template>

<script>
import axios from 'axios';
import { apiUrl } from '@/globalVariable';
import { EyeIcon, EnvelopeIcon, TrashIcon} from '@heroicons/vue/24/outline';
import toastr from 'toastr';

export default {
    components: {
        EyeIcon,
        EnvelopeIcon,
        TrashIcon,
    },
    data() {
        return {
            emails: [],
            loading: true,
        };
    },

    mounted(){
        this.getStarredEmails();
    },

    methods: {
        async getStarredEmails() {
            try {
                this.loading = true; 
                const response = await axios.get(`${apiUrl}emailsStarred`);
                this.emails = response.data.email;
            } catch (error) {
                console.error('Error fetching Starred emails:', error);
            }
            finally {
                this.loading = false;
            }
        },

        async deleteEmail(emailId) {
            try {
                await axios.delete(`${apiUrl}emails/${emailId}/delete`);
                this.getStarredEmails();
            } catch (error) {
                console.error('Error deleting email:', error);
            }
        },

        async markAsRead(email) {
            try {
                if (!email.is_read) {
                    await axios.patch(`${apiUrl}emails/${email}/read`);
                    toastr.success('Successfully Read Email');
                    this.getStarredEmails();
                }
            } catch (error) {
                console.error('Error marking email as read:', error);
            }
        },

        async moveToTrash(emailId) {
            try {
                await axios.patch(`${apiUrl}emails/${emailId}/trash`);
                toastr.success('Successfully Email Move to Trash.');
                this.getStarredEmails();
            } catch (error) {
                console.error('Error moving email to trash:', error);
            }
        },

    }
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
    /* background-color: rgba(255, 255, 255, 0.7); */
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
</style>
