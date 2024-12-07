<template>
    <div>
        <div class="my-3 d-flex justify-content-between align-items-center">
            <h3 class="ms-4">Team Member List</h3>
            <button class="btn me-3" style="background-color: #0CAF60; color: white;" @click="openModal('add')">
                Add a Team Member
            </button>
        </div>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Sl. No</th>
                    <th>Email</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(member, index) in members" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ member.email }}</td>
                    <td>
                        <button class="ms-3" @click="openModal('edit', member)">
                            <PencilIcon style="width: 21px;" />
                        </button>
                        <button class="ms-3" @click="deleteUser(member.id)">
                            <TrashIcon style="width: 21px;" />
                        </button>
                    </td>
                </tr>
                <tr v-if="members.length === 0">
                    <td colspan="3" class="text-center">No data available</td>
                </tr>
            </tbody>
        </table>

        <!-- Custom Modal -->
        <div v-if="isModalVisible" class="custom-modal">
            <div class="modal-content">
                <h4>{{ modalType === 'add' ? 'Add Member' : 'Edit Member' }}</h4>
                <input type="email" v-model="modalData.email" placeholder="Enter email"
                    class="form-control my-3 w-100" />
                <div class="d-flex justify-content-between mt-2">
                    <button style="background-color: #0CAF60; color: white;" class="btn me-2" @click="saveMember">
                        {{ modalType === 'add' ? 'Add' : 'Save' }}
                    </button>
                    <button class="btn btn-secondary ms-2" @click="closeModal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import axios from 'axios';
import toastr from "toastr";
import { apiUrl } from "@/globalVariable";

export default {
    data() {
        return {
            members: [],
            isModalVisible: false,
            modalType: '', // 'add' or 'edit'
            modalData: {
                id: null,
                email: ''
            }
        };
    },

    components: {
        PencilIcon,
        TrashIcon
    },

    mounted() {
        this.fetchMembers();
    },

    methods: {
        fetchMembers() {
            const token = localStorage.getItem('token'); // Fetch the token from localStorage
            axios
                .get(`${apiUrl}members`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    this.members = response.data; // Assign the fetched data to the members property
                    toastr.success('Members fetched successfully.');
                })
                .catch(error => {
                    toastr.error('Error fetching members.'); // Display an error notification
                    console.error('Error fetching members:', error.response?.data || error.message);
                });
        },


        openModal(type, member = {}) {
            this.modalType = type;
            this.isModalVisible = true;
            this.modalData = type === 'edit' ? { ...member } : { id: null, email: '' };
        },

        closeModal() {
            this.isModalVisible = false;
            this.modalData = { id: null, email: '' };
        },

        saveMember() {
            const url = this.modalType === 'add'
                ? `${apiUrl}members`
                : `${apiUrl}members/${this.modalData.id}`;
            const method = this.modalType === 'add' ? 'post' : 'put';
            const token = localStorage.getItem('token');

            axios({
                method,
                url,
                data: this.modalData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(() => {
                    toastr.success('Member saved successfully.');
                    this.closeModal();
                    this.fetchMembers();
                })
                .catch(error => {
                    toastr.error('Error saving member.');
                    console.error(error);
                });
        },


        deleteUser(id) {
            if (confirm('Are you sure you want to delete this member?')) {
                axios.delete(`${apiUrl}members/${id}`)
                    .then(() => {
                        toastr.success('Member deleted successfully.');
                        this.fetchMembers();
                    })
                    .catch(error => {
                        toastr.error('Error deleting member.');
                        console.error(error);
                    });
            }
        }
    }
};
</script>

<style scoped>
.table {
    width: 98%;
    border-collapse: collapse;
    margin: 20px;
}

.table th,
.table td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
}

.table th {
    background-color: #f4f4f4;
}

.text-center {
    text-align: center;
}

.custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}
</style>
