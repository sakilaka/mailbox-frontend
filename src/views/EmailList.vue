<template>
    <div class="email-list">



        <div v-if="loading" class="loader-container">
            <div class="loader"></div>
        </div>

        <!-- Email List -->
        <div v-else>
            <!-- Searchbar -->



            <div class="d-flex justify-content-between w-100">
                <div class="d-flex gap-5 p-4 mt-2">
            
                    <EnvelopeOpenIcon class="h-5 w-5" @click="filterByReadStatus" />
                    <StarIcon class="h-5 w-5" @click="filterWithoutStarred" />
                    <StarIcon class="h-5 w-5 text-warning" @click="filterByStarred" />
                    <SettingIcon class="h-5 w-5" style="width: 25px; height: 25px;" title="settings"
                        @click="openSettings" />

                </div>

                <div class="mt-1 d-flex" style="margin-right: 30px; position: relative;">
                    <!-- Input Field -->
                    <input type="text" v-model="searchQuery" @input="searchEmails" class="form-control searchbar ps-5"
                        placeholder="Search Email...." style="padding-right: 40px;" />

                    <!-- Search Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor"
                        style="width: 30px; height: 30px; position: absolute; top: 50%; right: 18px; transform: translateY(-50%); color: #666; cursor: pointer;">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>


                </div>
            </div>

            <hr>

            <!-- Email Items -->
            <div v-for="email in filteredEmails" :key="email.id"
                class="email-item ms-3 d-flex justify-content-between align-items-center p-3 border-bottom"
                @click="$router.push({ name: 'EmailDetails', params: { id: email.id } })">
                <div class="d-flex">
                    <div class="d-flex gap-2">
                        <input type="checkbox">
                        <StarIcon class="h-5 w-5" @click.stop="markAsStarred(email.id)"
                            :class="email.is_starred ? 'text-warning' : ''"
                            style="margin-top: 21px; margin-left: 10px;" />
                    </div>

                    <div class="email-info ms-5">
                        <strong>{{ email.sender }}</strong> - <span class="text-muted">{{ email.subject }}</span>
                        <p class="text-muted">{{ email.snippet }}</p>
                    </div>
                </div>
                <div class="email-actions d-flex">
                    <EyeIcon class="h-5 w-5 mx-2"
                        @click="$router.push({ name: 'EmailDetails', params: { id: email.id } })" />
                    <EnvelopeIcon class="h-5 w-5 mx-2" :class="email.is_read ? 'text-warning' : ''"
                        @click.stop="markAsRead(email.id)" />
                    <TrashIcon class="h-5 w-5 mx-2" @click.stop="moveToTrash(email.id)" />
                    <ArchiveBoxIcon class="h-5 w-5 mx-2" @click.stop="moveToArchive(email.id)" />
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import { apiUrl } from '@/globalVariable';
import { EyeIcon, EnvelopeIcon, TrashIcon, EnvelopeOpenIcon, StarIcon, ArchiveBoxIcon, CogIcon as SettingIcon } from '@heroicons/vue/24/outline';
import toastr from 'toastr';

export default {
    components: {
        EyeIcon,
        EnvelopeIcon,
        TrashIcon,
        StarIcon,
        EnvelopeOpenIcon,
        ArchiveBoxIcon,
        SettingIcon
    },
    data() {
        return {
            emails: [],
            loading: true,
            filteredEmails: [],
            searchQuery: '',
            isReadFiltered: null, 
            isStarredFiltered: null,
            isNotStarredFiltered: null,
        };
    },
    created() {
        this.filteredEmails = this.emails; 
    },

    mounted() {
        this.getEmail();
    },

    methods: {

        async getEmail() {
            try {
                this.loading = true; 
                const response = await axios.get(`${apiUrl}emails`);
                this.emails = response.data.email;
                this.filteredEmails = this.emails;
            } catch (error) {
                console.error('An error occurred while fetching emails.', error);
            } finally {
                this.loading = false;
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

        
        async markAsStarred(email) {
            try {

                if (!email.is_starred) {
                    await axios.patch(`${apiUrl}emails/${email}/star`);
                    toastr.success('Successfully Starred Email');
                    this.getEmail();
                }
            } catch (error) {
                console.error('Error marking email as starred:', error);
            }
        },

        searchEmails() {
            if (this.searchQuery.trim() === '') {
                this.filteredEmails = this.emails;
            } else {
                this.filteredEmails = this.emails.filter(email =>
                    email.snippet.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    email.sender.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
        },

        openSettings() {
            this.$router.push('/config');
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

        async moveToArchive(emailId) {
            try {
                await axios.patch(`${apiUrl}emails/${emailId}/archive`);
                toastr.success('Successfully Email move to Archive.');
                this.getEmail();
            } catch (error) {
                console.error('Error moving email to archive:', error);
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
      filtered = filtered.filter(email => email.is_read === this.isReadFiltered);
    }

    
    if (this.isStarredFiltered !== null) {
      filtered = filtered.filter(email => email.is_starred === this.isStarredFiltered);
    }

    
    if (this.isNotStarredFiltered !== null) {
      filtered = filtered.filter(email => email.is_starred === this.isNotStarredFiltered);
    }

    
    this.filteredEmails = filtered;
  }


    }
};
</script>

<style scoped>
.searchbar {
    margin: 10px;
    width: 100%;
    border: 1px solid #0CAF60;
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
