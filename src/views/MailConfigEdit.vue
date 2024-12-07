<template>
    <div class="container mt-4 p-4 border rounded bg-white">
        <h5 class="mb-4">Edit Email Box Configuration</h5>

        <div class="row">
            <!-- Mail Driver -->
            <div class="col-md-4 mb-3">
                <label for="mailDriver" class="form-label">Mail Driver</label>
                <input type="text" v-model="form.mail_driver" class="form-control" placeholder="IMAP" />
            </div>

            <!-- Mail Host -->
            <div class="col-md-4 mb-3">
                <label for="mailHost" class="form-label">Mail Host</label>
                <input type="text" v-model="form.mail_host" class="form-control" placeholder="imap.hostinger.com" />
            </div>

            <!-- Mail Host -->
            <div class="col-md-4 mb-3">
                <label for="mailHost" class="form-label">Mail Host(SMTP)</label>
                <input type="text" v-model="form.mail_smtp_host" class="form-control" placeholder="smtp.hostinger.com" />
            </div>

            <!-- Outgoing Port -->
            <div class="col-md-4 mb-3">
                <label for="outgoingPort" class="form-label">Outgoing Port</label>
                <input type="text" v-model="form.outgoing_port" class="form-control" placeholder="465" />
            </div>

            <!-- Incoming Port -->
            <div class="col-md-4 mb-3">
                <label for="incomingPort" class="form-label">Incoming Port</label>
                <input type="text" v-model="form.incoming_port" class="form-control" placeholder="993" />
            </div>

            <!-- Mail Encryption -->
            <div class="col-md-4 mb-3">
                <label for="mailEncryption" class="form-label">Mail Encryption</label>
                <input type="text" v-model="form.mail_encryption" class="form-control" placeholder="ssl" />
                <div v-if="validationErrors.mail_encryption" class="text-danger">
                    {{ validationErrors.mail_encryption }}
                </div>
            </div>

            <div class="col-md-4 mb-3">
                <label for="mailFromAddress" class="form-label">Mail From Address</label>
                <input type="text" name="mailFromAddress" placeholder="system@malishaedubd.com"
                    v-model="form.mail_from_address" />
            </div>

            <!-- Mail From Name -->
            <div class="col-md-4 mb-3">
                <label for="mailFromName" class="form-label">Mail From Name</label>
                <input type="text" v-model="form.mail_from_name" class="form-control" placeholder="Malisha" />
            </div>

            <!-- Accounts -->
            <div v-for="(account, index) in form.mail_username" :key="index" class="row mb-3">
                <div class="col-md-4">
                    <label :for="'mailUsername' + index" class="form-label">Mail Username {{ index + 1 }}</label>
                    <input type="text" v-model="account.email" class="form-control"
                        :placeholder="'email' + (index + 1) + '@example.com'" />
                </div>

                <div class="col-md-4">
                    <label :for="'mailPassword' + index" class="form-label">Mail Password {{ index + 1 }}</label>
                    <input type="password" v-model="account.password" class="form-control" placeholder="password" />
                </div>

                <div class="col-md-4 d-flex align-items-end">
                    <button type="button" @click="removeAccount(index)" class="btn btn-danger btn-sm"
                        v-if="form.mail_username.length > 1">
                        Remove
                    </button>
                </div>
            </div>

            <div class="mb-3">
                <button type="button" @click="addAccount" class="btn btn-primary">Add Another Email</button>
            </div>
        </div>

        <div class="d-flex justify-content-end">
            <button class="btn btn-success" @click="saveChanges">Save Changes</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { apiUrl } from "@/globalVariable";
import toastr from "toastr";

export default {
    data() {
        return {
            form: {
                mail_driver: "",
                mail_host: "",
                mail_smtp_host: "",
                outgoing_port: "",
                incoming_port: "",
                mail_username: [{ email: "", password: "" }],
                mail_encryption: "",
                mail_from_address: "",
                mail_from_name: "",
            },
            validationErrors: {}
        };
    },
    mounted() {
        // Fetch the existing data when the component is mounted
        this.fetchConfig();
    },
    methods: {
        // Fetch configuration details by ID
        async fetchConfig() {
            const id = this.$route.params.id; // Get ID from the route
            try {
                const response = await axios.get(`${apiUrl}email-config/${id}`);
                const config = response.data;

                // Prepopulate the form with fetched data
                this.form = {
                    mail_driver: config.driver,
                    mail_host: config.host,
                    mail_smtp_host: config.smtp_host,
                    outgoing_port: config.outgoing_port,
                    incoming_port: config.incoming_port,
                    mail_username: JSON.parse(config.username), // Parse JSON into array
                    mail_encryption: config.encryption,
                    mail_from_address: config.from_address,
                    mail_from_name: config.from_name,
                };
            } catch (error) {
                console.error("Error fetching the config:", error);
            }
        },
        addAccount() {
            this.form.mail_username.push({ email: "", password: "" });
        },
        removeAccount(index) {
            this.form.mail_username.splice(index, 1);
        },

        async saveChanges() {
            const id = this.$route.params.id; // Get ID from the route
            try {
                const token = localStorage.getItem("token");

                // Prepare data for saving
                const payload = {
                    ...this.form,
                    mail_username: JSON.stringify(this.form.mail_username), // Serialize array into JSON
                };

                const response = await axios.put(`${apiUrl}email-config/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                toastr.success(response.data.message);
                this.$router.push('/config-index');
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    this.validationErrors = error.response.data.errors;
                } else {
                    console.error(error);
                    alert("An error occurred while updating the configuration.");
                }
            }
        }

    }
};
</script>
